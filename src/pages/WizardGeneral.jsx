// WizardGeneral.jsx
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowTopRightOnSquareIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Step0SelectVendingType from "../components/Step0SelectVendingType";
import Step1SelectModel from "../components/Step1SelectModel";
import Step2ModelDetails from "../components/Step2ModelDetails";
import Step3ExtrasConfigurator from "../components/Step3ExtrasConfigurator";
import Step4Summary from "../components/Step4Summary";
import CarouselImages from "../components/CarouselImages";
import Breadcrumbs from "../components/Breadcrumbs";
import toast from "react-hot-toast";
import { getConfiguradorModels, getCachedConfiguradorModels } from "../services/configuradorService";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

export default function WizardGeneral() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const wizardRef = useRef(null);
  const isFirstMountRef = useRef(true);
  const prevStepRef = useRef(null);

  // Sincronizar paso y tipo con URL
  const urlType = searchParams.get("tipo")?.toUpperCase() || searchParams.get("type")?.toUpperCase();
  const validUrlType = (urlType === 'TOUCH' || urlType === 'TRADICIONAL') ? urlType : null;

  const step = parseInt(searchParams.get("s")) || (id === "Vending" ? (validUrlType ? 1 : 0) : 1);
  
  const [vendingType, setVendingType] = useState(
    id !== "Vending" ? VendingTypeEnum.NONE : (validUrlType || null)
  );
  const [selectedModel, setSelectedModel] = useState(null);
  const [extrasPrice, setExtrasPrice] = useState(0);
  const [summaryData, setSummaryData] = useState(null);

  const [allModels, setAllModels] = useState(() => getCachedConfiguradorModels() || []);
  const [loadingModels, setLoadingModels] = useState(() => !getCachedConfiguradorModels());

  // Fetch all models con cache en memoria
  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      try {
        const data = await getConfiguradorModels();
        if (isMounted) {
          setAllModels(data);
        }
      } catch (error) {
        console.error("Failed to fetch all models:", error);
        toast.error("Error al cargar los modelos de máquinas.");
      } finally {
        if (isMounted) {
          setLoadingModels(false);
        }
      }
    };
    loadModels();
    return () => {
      isMounted = false;
    };
  }, []);

  // Efecto para manejar el scroll pausado y suave al entrar y al cambiar de paso
  useEffect(() => {
    if (!wizardRef.current || loadingModels) return;

    const isMobile = window.innerWidth < 640;
    const isExtrasStep = (id === "Vending" && step === 2) || (id !== "Vending" && step === 3);

    // En el paso de extras en escritorio, no realizar movimiento de scroll al entrar
    if (isExtrasStep) {
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }

    const isTargetStep = (id === "Vending" && step === 0) || step === 1;

    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    let isCancelled = false;
    let animFrameId = null;
    let pauseTimer = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (startY, endY, duration, onComplete) => {
      const distance = endY - startY;
      if (Math.abs(distance) < 2) {
        if (onComplete && !isCancelled) onComplete();
        return;
      }

      let startTime = null;
      const stepAnim = (currentTime) => {
        if (isCancelled) return;
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          animFrameId = requestAnimationFrame(stepAnim);
        } else {
          if (onComplete && !isCancelled) onComplete();
        }
      };

      animFrameId = requestAnimationFrame(stepAnim);
    };

    const handleUserScroll = () => {
      isCancelled = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (pauseTimer) clearTimeout(pauseTimer);
    };

    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchmove", handleUserScroll, { passive: true });

    if (isTargetStep) {
      const performDescent = () => {
        if (isCancelled) return;
        const targetElement =
          document.getElementById("extras-top-anchor") ||
          document.getElementById("step0-vending-container") ||
          document.getElementById("step1-model-container") ||
          document.getElementById("wizard-main-content") ||
          wizardRef.current;

        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const targetY = Math.max(0, rect.top + window.pageYOffset - 85);
          animateScroll(window.pageYOffset, targetY, 1200);
        }
      };

      if (window.pageYOffset > 15) {
        // Al avanzar o retroceder de paso: sube suavemente al inicio para mostrar breadcrumbs
        animateScroll(window.pageYOffset, 0, 550, () => {
          if (isCancelled) return;
          pauseTimer = setTimeout(() => {
            if (!isCancelled) performDescent();
          }, 450);
        });
      } else {
        // Al entrar por primera vez: asegura tope superior, pausa y desciende pausadamente
        window.scrollTo(0, 0);
        pauseTimer = setTimeout(() => {
          if (!isCancelled) performDescent();
        }, 700);
      }
    } else {
      // Otros pasos del configurador: descenso suave al contenido
      const yOffset = -85;
      const element = wizardRef.current;
      const rect = element.getBoundingClientRect();
      const targetY = Math.max(0, rect.top + window.pageYOffset + yOffset);
      animateScroll(window.pageYOffset, targetY, 700);
    }

    return () => {
      isCancelled = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (pauseTimer) clearTimeout(pauseTimer);
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchmove", handleUserScroll);
    };
  }, [step, loadingModels, id]);

  const setStep = (newStep) => {
    setSearchParams({ s: newStep });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(Math.max(0, step - 1));

  // Redirigir a paso 1 si se intenta acceder a pasos avanzados sin modelo seleccionado
  useEffect(() => {
    if (!loadingModels && !selectedModel && step >= 2) {
      setStep(1);
    }
  }, [step, selectedModel, loadingModels]);

  const breadcrumbSteps = useMemo(() => {
    const dynamicSteps = [];
    if (id === "Vending") {
      dynamicSteps.push(
        { label: "Tipo" },
        { label: "Modelo" },
        { label: "Extras" },
        { label: "Resumen" }
      );
    } else {
      dynamicSteps.push(
        { label: "Modelo" },
        { label: "Detalles" },
        { label: "Extras" },
        { label: "Resumen" }
      );
    }
    return [{ label: "Inicio", path: "/#catalogo" }, ...dynamicSteps];
  }, [id]);

  const actualBreadcrumbStepIndex = useMemo(() => {
    const baseBreadcrumbCount = 1;
    const adjustedStep = (id === "Vending") ? step : (step - 1);
    return baseBreadcrumbCount + adjustedStep;
  }, [id, step]);

  const modelos = useMemo(() => {
    if (loadingModels) return [];
    let filteredByCategory = allModels;
    
    if (id === "Purificadora") {
      filteredByCategory = allModels.filter(
        (m) =>
          m.slug.toLowerCase().includes("neptuno") ||
          m.slug.toLowerCase().includes("poseidon") ||
          m.slug.toLowerCase().includes("mostrador") ||
          m.slug.toLowerCase().includes("purificadora")
      );
    } else if (id === "Vending") {
      filteredByCategory = allModels.filter(
        (m) =>
          (m.slug.toLowerCase().includes("atlantis") || m.isAtlantis) &&
          !m.slug.toLowerCase().includes("vending5") &&
          !m.slug.toLowerCase().includes("vending8") &&
          !m.slug.toLowerCase().includes("limpieza")
      );
    } else if (id === "Vending-Limpieza") {
      filteredByCategory = allModels.filter(
        (m) =>
          m.slug.toLowerCase() === "vending5" ||
          m.slug.toLowerCase() === "vending8" ||
          m.slug.toLowerCase().includes("limpieza") ||
          (m.name && m.name.toLowerCase().includes("clean"))
      );
    } else if (id === "Duo-Emprendedor") {
      filteredByCategory = allModels.filter((m) => m.slug.toLowerCase().includes("duo-emprendedor"));
    } else if (id === "Tridente") {
      filteredByCategory = allModels.filter((m) => m.slug.toLowerCase().includes("tridente"));
    } else if (id === "Megalodon") {
      filteredByCategory = allModels.filter((m) => m.slug.toLowerCase().includes("megalodon"));
    }

    if (id === "Vending" && vendingType) {
      return filteredByCategory.filter((m) => m.vendingType === vendingType);
    }
    return filteredByCategory;
  }, [id, vendingType, allModels, loadingModels]);

  const landingImages = useMemo(() => {
    if (loadingModels) return [];
    let images = modelos.flatMap((m) =>
      (m.images || []).filter((img) => img.context === "CAROUSEL" && img.url).map((img) => optimizeCloudinaryUrl(img.url, 900))
    );
    const unique = [...new Set(images.filter((url) => url && url.trim() !== ""))];
    if (unique.length > 0) return unique;

    // Respaldo con cualquier imagen disponible del modelo si no tiene etiqueta CAROUSEL
    const fallbackImgs = modelos.flatMap((m) =>
      (m.images || []).filter((img) => img.url).map((img) => optimizeCloudinaryUrl(img.url, 900))
    );
    return [...new Set(fallbackImgs.filter((url) => url && url.trim() !== ""))];
  }, [modelos, loadingModels]);

  // Precarga inmediata en memoria para transicion instantanea
  useEffect(() => {
    if (landingImages && landingImages.length > 0) {
      landingImages.slice(0, 3).forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [landingImages]);

  const selectedModelHasOsmosis = useMemo(() => {
    if (!selectedModel) return false;
    const raw = `${selectedModel.name || ""} ${selectedModel.description || ""} ${selectedModel.slug || ""}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const isLimpieza =
      id === "Vending-Limpieza" ||
      raw.includes("limpieza") ||
      raw.includes("vending5") ||
      raw.includes("vending8");
    return !isLimpieza && raw.includes("osmosis");
  }, [selectedModel, id]);

  const catalogHasOsmosis = useMemo(() => {
    const isLimpieza =
      id === "Vending-Limpieza" ||
      (id && id.toLowerCase().includes("limpieza"));
    if (isLimpieza) return false;
    if (modelos && modelos.length > 0) {
      return modelos.some((m) => {
        const raw = `${m.name || ""} ${m.description || ""} ${m.slug || ""}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return raw.includes("osmosis");
      });
    }
    return id === "Vending" || id === "Purificadora";
  }, [modelos, id]);

  const availableVendingTypes = useMemo(() => {
    if (loadingModels) return [];
    const types = new Set();
    const waterVendingModels = allModels.filter(
      (m) =>
        (m.slug.toLowerCase().includes("atlantis") || m.isAtlantis) &&
        !m.slug.toLowerCase().includes("vending5") &&
        !m.slug.toLowerCase().includes("vending8") &&
        !m.slug.toLowerCase().includes("limpieza")
    );

    waterVendingModels.forEach((m) => {
      if (m.vendingType === VendingTypeEnum.TRADICIONAL || m.vendingType === VendingTypeEnum.TOUCH) {
        types.add(m.vendingType);
      }
    });

    const result = [];
    if (types.has(VendingTypeEnum.TOUCH)) result.push(VendingTypeEnum.TOUCH);
    if (types.has(VendingTypeEnum.TRADICIONAL)) result.push(VendingTypeEnum.TRADICIONAL);
    return result.length > 0 ? result : [VendingTypeEnum.TOUCH, VendingTypeEnum.TRADICIONAL];
  }, [allModels, loadingModels]);

  const getVendingTypeImage = (type) => {
    // Filtrar unicamente modelos de vending de agua (Atlantis) y excluir maquinas de limpieza
    const waterVendingModels = allModels.filter(
      (m) =>
        (m.slug.toLowerCase().includes("atlantis") || m.isAtlantis) &&
        !m.slug.toLowerCase().includes("vending5") &&
        !m.slug.toLowerCase().includes("vending8") &&
        !m.slug.toLowerCase().includes("limpieza")
    );

    const model = waterVendingModels.find(
      (m) => m.vendingType === type && m.images && m.images.length > 0
    );

    if (model && model.images && model.images.length > 0) {
      const secondaryImg = model.images.find((img) => img.isSecondary && img.url);
      if (secondaryImg) return optimizeCloudinaryUrl(secondaryImg.url, 700);

      const carouselImg = model.images.find((img) => img.context === "CAROUSEL" && img.url);
      if (carouselImg) return optimizeCloudinaryUrl(carouselImg.url, 700);

      const baseImg = model.images.find((img) => img.url);
      if (baseImg) return optimizeCloudinaryUrl(baseImg.url, 700);
    }

    if (type === VendingTypeEnum.TOUCH) {
      return optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/1touch_heazvd.png", 700);
    }
    return optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776397327/tradicional_atlantis_hbnrfy.png", 700);
  };

  if (loadingModels) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stepVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div ref={wizardRef} className="bg-[#fbfbfd] min-h-screen pt-20 sm:pt-22 lg:pt-[86px] pb-6 sm:pb-8 lg:pb-10 font-montserrat not-italic">
      {/* NAVEGACIÓN Y BREADCRUMBS ADAPTADOS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3 sm:mb-5">
        <Breadcrumbs
          steps={breadcrumbSteps}
          currentStepIndex={actualBreadcrumbStepIndex}
          onStepClick={(index) => {
            const baseBreadcrumbCount = 1;
            const newStep = index - baseBreadcrumbCount;
            setStep((id === "Vending") ? newStep : (newStep + 1));
          }}
        />
      </div>

      <main id="wizard-main-content" className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${id}-${step}`}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="min-h-0 sm:min-h-[520px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start"
          >
            {id === "Vending" && step === 0 && (
              <div className="col-span-1 lg:col-span-2">
                <Step0SelectVendingType
                  onSelect={(type) => {
                    setVendingType(type);
                    setSelectedModel(null);
                    nextStep();
                  }}
                  availableVendingTypes={availableVendingTypes}
                  getVendingTypeImage={getVendingTypeImage}
                />
              </div>
            )}

            {step === 1 && (
              <div className="col-span-1 lg:col-span-2">
                <Step1SelectModel
                  modelos={modelos}
                  vendingType={vendingType}
                  categoryId={id}
                  onSelect={setSelectedModel}
                  onNext={nextStep}
                  catalogHasOsmosis={catalogHasOsmosis}
                />
              </div>
            )}

            {/* Paso 2 para NO-Vending: Detalles del modelo */}
            {id !== "Vending" && step === 2 && selectedModel && (
              <>
                <div className="w-full lg:sticky lg:top-28 lg:self-start space-y-3">
                  <CarouselImages
                    images={selectedModel.images
                      .filter(img => img.context === 'CAROUSEL' && img.url)
                      .map(img => optimizeCloudinaryUrl(img.url, 900))
                      .filter(url => url && url.trim() !== "")
                    }
                  />

                  {/* Botón para conocer más sobre ósmosis inversa */}
                  {selectedModelHasOsmosis && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-3xl mx-auto"
                    >
                      <Link
                        to="/blog/osmosis-inversa-vs-agua-alcalina"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-cyan-50/50 to-white border border-[#168387]/25 hover:border-[#168387] hover:shadow-lg hover:shadow-cyan-900/5 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#168387] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <SparklesIcon className="w-5 h-5" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#168387] transition-colors">
                                ¿Quieres conocer más sobre ósmosis inversa?
                              </p>
                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#168387]/10 text-[#168387] border border-[#168387]/20 group-hover:bg-[#168387] group-hover:text-white transition-colors shrink-0">
                                <span className="sm:hidden">Pulse aquí</span>
                                <span className="hidden sm:inline">Da clic aquí</span>
                              </span>
                            </div>
                            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block truncate">
                              <span className="sm:hidden font-semibold text-[#168387]">Pulse aquí</span>
                              <span className="hidden sm:inline font-semibold text-[#168387]">Da clic aquí</span>
                              {" "}para descubrir cómo funciona y por qué es el estándar de oro en purificación
                            </span>
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-[#168387] group-hover:border-[#168387]/40 group-hover:bg-[#168387]/5 shrink-0 transition-all">
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </div>
                <div className="w-full">
                  <Step2ModelDetails
                    modelo={selectedModel}
                    vendingType={vendingType}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                </div>
              </>
            )}

            {/* Extras: Paso 2 para Vending, Paso 3 para otras categorías */}
            {((id === "Vending" && step === 2) || (id !== "Vending" && step === 3)) && selectedModel && (
              <div className="col-span-1 lg:col-span-2">
                <Step3ExtrasConfigurator
                  selectedModelId={selectedModel.slug}
                  onSelect={(summary) => {
                    setSummaryData(summary);
                    const totalExtras = summary.selectedExtras.reduce(
                      (acc, curr) => acc + (curr.priceOverride ?? curr.extra.basePrice),
                      0
                    );
                    setExtrasPrice(totalExtras);
                  }}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              </div>
            )}

            {/* Resumen: Paso 3 para Vending, Paso 4 para otras categorías */}
            {((id === "Vending" && step === 3) || (id !== "Vending" && step === 4)) && summaryData && (
              <div className="col-span-1 lg:col-span-2">
                <Step4Summary
                  summaryData={summaryData}
                  onBack={prevStep}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}