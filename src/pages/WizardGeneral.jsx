// WizardGeneral.jsx
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step0SelectVendingType from "../components/Step0SelectVendingType";
import Step1SelectModel from "../components/Step1SelectModel";
import Step2ModelDetails from "../components/Step2ModelDetails";
import Step3ExtrasConfigurator from "../components/Step3ExtrasConfigurator";
import Step4Summary from "../components/Step4Summary";
import CarouselImages from "../components/CarouselImages";
import Breadcrumbs from "../components/Breadcrumbs";
import toast from "react-hot-toast";
import { getConfiguradorModels, getCachedConfiguradorModels } from "../services/configuradorService";

const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

export default function WizardGeneral() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const wizardRef = useRef(null);

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

  // Efecto para manejar el scroll al cambiar de paso
  useEffect(() => {
    if (wizardRef.current && !loadingModels) {
      const yOffset = -100; // Offset para el Navbar
      const element = wizardRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [step, loadingModels]);

  const setStep = (newStep) => {
    setSearchParams({ s: newStep });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(Math.max(0, step - 1));

  const breadcrumbSteps = useMemo(() => {
    const dynamicSteps = [];
    if (id === "Vending") {
      dynamicSteps.push(
        { label: "Tipo" },
        { label: "Modelo" },
        { label: "Detalles" },
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
      (m.images || []).filter((img) => img.context === "CAROUSEL" && img.url).map((img) => img.url)
    );
    return [...new Set(images.filter((url) => url && url.trim() !== ""))];
  }, [modelos, loadingModels]);

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
      if (secondaryImg) return secondaryImg.url;

      const carouselImg = model.images.find((img) => img.context === "CAROUSEL" && img.url);
      if (carouselImg) return carouselImg.url;

      const baseImg = model.images.find((img) => img.url);
      if (baseImg) return baseImg.url;
    }

    if (type === VendingTypeEnum.TOUCH) {
      return "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/1touch_heazvd.png";
    }
    return "https://res.cloudinary.com/defkuaytw/image/upload/v1776397327/tradicional_atlantis_hbnrfy.png";
  };

  if (loadingModels) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transitionEnd: { x: "none" } // Elimina el transform al terminar para no romper el sticky
    },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div ref={wizardRef} className="bg-slate-50 min-h-screen pt-20 sm:pt-24 lg:pt-28 pb-32">
      {/* NAVEGACIÓN Y BREADCRUMBS ADAPTADOS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
          <Breadcrumbs
            steps={breadcrumbSteps}
            currentStepIndex={actualBreadcrumbStepIndex}
            onStepClick={(index) => {
              const baseBreadcrumbCount = 1;
              const newStep = index - baseBreadcrumbCount;
              setStep((id === "Vending") ? newStep : (newStep + 1));
            }}
          />

          {/* Indicador de progreso para escritorio y tablet */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <span>Paso</span>
            <span className="text-[#168387] font-black">{Math.min(actualBreadcrumbStepIndex, breadcrumbSteps.length - 1)}</span>
            <span>de</span>
            <span>{breadcrumbSteps.length - 1}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${id}-${step}`}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start"
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
              <>
                <div className="w-full lg:sticky lg:top-28">
                  <CarouselImages images={landingImages} />
                </div>
                <div className="w-full">
                  <Step1SelectModel
                    modelos={modelos}
                    vendingType={vendingType}
                    categoryId={id}
                    onSelect={setSelectedModel}
                    onNext={nextStep}
                  />
                </div>
              </>
            )}

            {step === 2 && selectedModel && (
              <>
                <div className="w-full lg:sticky lg:top-28">
                  <CarouselImages
                    images={selectedModel.images
                      .filter(img => img.context === 'CAROUSEL' && img.url)
                      .map(img => img.url)
                      .filter(url => url && url.trim() !== "")
                    }
                  />
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

            {step === 3 && selectedModel && (
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

            {step === 4 && summaryData && (
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