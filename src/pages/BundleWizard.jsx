// src/pages/BundleWizard.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import Breadcrumbs from "../components/Breadcrumbs";
import Step1SelectModel from "../components/Step1SelectModel";
import Step3ExtrasConfigurator from "../components/Step3ExtrasConfigurator";
import BundleSummaryStep from "../components/BundleSummaryStep";

import { getConfiguradorModels, getCachedConfiguradorModels } from "../services/configuradorService";
import { getBundlePrices, calculateBundleBasePrice } from "../services/bundlePricingService";

// Normalizador de ID de paquete
const normalizeBundleId = (rawId = "") => {
  const clean = (rawId || "").toLowerCase();
  if (clean.includes("duo")) return "Duo-Emprendedor";
  if (clean.includes("tridente")) return "Tridente";
  if (clean.includes("megalodon")) return "Megalodon";
  return rawId;
};

// Configuraciones de pasos por paquete
const BUNDLE_STEPS_FLOW = {
  "Duo-Emprendedor": [
    {
      step: 0,
      title: "Vending de Agua",
      breadcrumb: "Vending Agua",
      modelType: "vendingAgua",
      type: "model",
    },
    {
      step: 1,
      title: "Extras de Vending de Agua",
      breadcrumb: "Extras Agua",
      modelType: "vendingAgua",
      type: "extras",
    },
    {
      step: 2,
      title: "Vending de Limpieza",
      breadcrumb: "Vending Limpieza",
      modelType: "vendingLimpieza",
      type: "model",
    },
    {
      step: 3,
      title: "Extras de Limpieza",
      breadcrumb: "Extras Limpieza",
      modelType: "vendingLimpieza",
      type: "extras",
    },
    {
      step: 4,
      title: "Resumen del Paquete",
      breadcrumb: "Resumen",
      type: "summary",
    },
  ],
  "Tridente": [
    {
      step: 0,
      title: "Vending de Agua",
      breadcrumb: "Vending Agua",
      modelType: "vendingAgua",
      type: "model",
    },
    {
      step: 1,
      title: "Extras de Vending de Agua",
      breadcrumb: "Extras Agua",
      modelType: "vendingAgua",
      type: "extras",
    },
    {
      step: 2,
      title: "Purificadora Mostrador",
      breadcrumb: "Purificadora",
      modelType: "mostrador",
      type: "model",
    },
    {
      step: 3,
      title: "Vending de Limpieza",
      breadcrumb: "Vending Limpieza",
      modelType: "vendingLimpieza",
      type: "model",
    },
    {
      step: 4,
      title: "Extras de Limpieza",
      breadcrumb: "Extras Limpieza",
      modelType: "vendingLimpieza",
      type: "extras",
    },
    {
      step: 5,
      title: "Resumen del Paquete",
      breadcrumb: "Resumen",
      type: "summary",
    },
  ],
  "Megalodon": [
    {
      step: 0,
      title: "Vending de Agua",
      breadcrumb: "Vending Agua",
      modelType: "vendingAgua",
      type: "model",
    },
    {
      step: 1,
      title: "Extras de Vending de Agua",
      breadcrumb: "Extras Agua",
      modelType: "vendingAgua",
      type: "extras",
    },
    {
      step: 2,
      title: "Purificadora Mostrador",
      breadcrumb: "Purificadora",
      modelType: "mostrador",
      type: "model",
    },
    {
      step: 3,
      title: "Vending Limpieza (8 Prod)",
      breadcrumb: "Limpieza 8",
      modelType: "vendingLimpieza",
      type: "model",
    },
    {
      step: 4,
      title: "Extras de Limpieza",
      breadcrumb: "Extras Limpieza",
      modelType: "vendingLimpieza",
      type: "extras",
    },
    {
      step: 5,
      title: "Resumen del Paquete",
      breadcrumb: "Resumen",
      type: "summary",
    },
  ],
};

export default function BundleWizard() {
  const { id: rawId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const wizardContainerRef = useRef(null);

  const bundleId = useMemo(() => normalizeBundleId(rawId), [rawId]);
  const stepsConfig = useMemo(() => BUNDLE_STEPS_FLOW[bundleId] || [], [bundleId]);

  const step = Math.min(
    Math.max(0, parseInt(searchParams.get("s"), 10) || 0),
    Math.max(0, stepsConfig.length - 1)
  );

  const [allModels, setAllModels] = useState(() => getCachedConfiguradorModels() || []);
  const [loadingModels, setLoadingModels] = useState(() => !getCachedConfiguradorModels());
  const [bundlePrices, setBundlePrices] = useState(null);

  // Estados de configuración de equipos y extras
  const [bundleConfig, setBundleConfig] = useState({
    vendingAgua: null,
    mostrador: null,
    vendingLimpieza: null,
  });

  const [extrasConfig, setExtrasConfig] = useState({
    vendingAgua: null,
    mostrador: null,
    vendingLimpieza: null,
  });

  // Cargar modelos y precios dinámicos
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      try {
        const [modelsData, pricesData] = await Promise.all([
          getConfiguradorModels(),
          getBundlePrices(),
        ]);
        if (isMounted) {
          setAllModels(modelsData);
          setBundlePrices(pricesData);
        }
      } catch (error) {
        console.error("Error al cargar datos del configurador de paquetes:", error);
        toast.error("Error al cargar los modelos de máquinas.");
      } finally {
        if (isMounted) {
          setLoadingModels(false);
        }
      }
    };
    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Control de scroll suave entre pasos
  useEffect(() => {
    if (!wizardContainerRef.current || loadingModels) return;
    const isMobile = window.innerWidth < 640;
    const isTabletOrMobile = window.innerWidth < 1024;
    const isExtras = stepsConfig[step]?.type === "extras";

    if (isMobile || (isExtras && isTabletOrMobile)) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const timer = setTimeout(() => {
      const targetElement =
        document.getElementById("step1-model-container") ||
        document.getElementById("extras-top-anchor") ||
        document.getElementById("bundle-wizard-content") ||
        wizardContainerRef.current;

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const targetY = Math.max(0, rect.top + window.pageYOffset - 85);
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [step, loadingModels]);

  const setStep = (newStep) => {
    setSearchParams({ s: newStep });
  };

  const nextStep = () => {
    setStep(Math.min(step + 1, stepsConfig.length - 1));
  };

  const prevStep = () => {
    setStep(Math.max(0, step - 1));
  };

  const currentStepInfo = stepsConfig[step];

  // Breadcrumbs interactivos adaptados al paquete
  const breadcrumbSteps = useMemo(() => {
    const list = [{ label: "Inicio", path: "/#catalogo" }];
    stepsConfig.forEach((s) => {
      list.push({ label: s.breadcrumb });
    });
    return list;
  }, [stepsConfig]);

  // Selección de modelos para el paso actual
  const modelsForCurrentStep = useMemo(() => {
    if (!currentStepInfo || currentStepInfo.type !== "model" || loadingModels) return [];

    const { modelType } = currentStepInfo;

    if (modelType === "vendingAgua") {
      // Filtrar Vending de Agua (Atlantis y AtlantisTouch)
      return allModels.filter(
        (m) =>
          (m.slug.toLowerCase().includes("atlantis") || m.isAtlantis) &&
          !m.slug.toLowerCase().includes("vending5") &&
          !m.slug.toLowerCase().includes("vending8") &&
          !m.slug.toLowerCase().includes("limpieza")
      );
    }

    if (modelType === "mostrador") {
      // Filtrar Purificadora Mostrador emparejada con la ósmosis del vending de agua
      const waterModel = bundleConfig.vendingAgua;
      const rawWater = `${waterModel?.name || ""} ${waterModel?.slug || ""}`.toLowerCase();
      const hasOsmosis = rawWater.includes("max") || rawWater.includes("osmosis");

      return allModels
        .filter((m) => {
          const s = m.slug.toLowerCase();
          const n = (m.name || "").toLowerCase();
          const isMostradorModel = s.includes("neptuno") || s.includes("poseidon") || n.includes("mostrador");
          if (!isMostradorModel) return false;

          const isOsmosisModel = s.includes("aplus") || n.includes("osmosis");
          return hasOsmosis ? isOsmosisModel : !isOsmosisModel;
        })
        .map((m) => ({
          ...m,
          // Precio bonificado especial en paquete
          basePrice: 18000,
          description: "Purificadora de Mostrador en acero inoxidable incluida a precio especial en tu paquete.",
        }));
    }

    if (modelType === "vendingLimpieza") {
      if (bundleId === "Megalodon") {
        return allModels.filter((m) => m.slug.toLowerCase() === "vending8");
      }
      if (bundleId === "Tridente") {
        return allModels.filter((m) => m.slug.toLowerCase() === "vending5");
      }
      // Duo-Emprendedor: muestra tanto 5 como 8 productos
      return allModels.filter(
        (m) => m.slug.toLowerCase() === "vending5" || m.slug.toLowerCase() === "vending8"
      );
    }

    return [];
  }, [currentStepInfo, allModels, bundleConfig.vendingAgua, bundleId, loadingModels]);

  // Manejo de selección de modelo
  const handleModelSelect = (model) => {
    if (!currentStepInfo) return;
    const { modelType } = currentStepInfo;

    setBundleConfig((prev) => {
      const updated = { ...prev, [modelType]: model };

      // Si se selecciona Vending de Agua en Tridente o Megalodón, auto-emparejar mostrador
      if (modelType === "vendingAgua" && (bundleId === "Tridente" || bundleId === "Megalodon")) {
        const rawWater = `${model?.name || ""} ${model?.slug || ""}`.toLowerCase();
        const hasOsmosis = rawWater.includes("max") || rawWater.includes("osmosis");
        const matchingMostrador = allModels.find((m) => {
          const s = m.slug.toLowerCase();
          const n = (m.name || "").toLowerCase();
          const isM = s.includes("neptuno") || s.includes("poseidon") || n.includes("mostrador");
          if (!isM) return false;
          return hasOsmosis ? (s.includes("aplus") || n.includes("osmosis")) : (!s.includes("aplus") && !n.includes("osmosis"));
        });
        if (matchingMostrador) {
          updated.mostrador = {
            ...matchingMostrador,
            basePrice: 18000,
          };
        }
      }

      // Si es Megalodón o Tridente, auto-seleccionar la vending de limpieza correspondiente si aún no existe
      if (bundleId === "Megalodon" && !updated.vendingLimpieza) {
        const v8 = allModels.find((m) => m.slug.toLowerCase() === "vending8");
        if (v8) updated.vendingLimpieza = v8;
      } else if (bundleId === "Tridente" && !updated.vendingLimpieza) {
        const v5 = allModels.find((m) => m.slug.toLowerCase() === "vending5");
        if (v5) updated.vendingLimpieza = v5;
      }

      return updated;
    });

    nextStep();
  };

  // Manejo de extras seleccionados
  const handleExtrasSelect = (modelType, summaryPayload) => {
    setExtrasConfig((prev) => ({
      ...prev,
      [modelType]: summaryPayload,
    }));
    nextStep();
  };

  // Cálculo del precio base del paquete con los descuentos combo
  const calculatedBundleBasePrice = useMemo(() => {
    return calculateBundleBasePrice(
      bundleId,
      bundleConfig.vendingAgua,
      bundleConfig.vendingLimpieza,
      bundlePrices || undefined
    );
  }, [bundleId, bundleConfig.vendingAgua, bundleConfig.vendingLimpieza, bundlePrices]);

  if (loadingModels) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stepsConfig || stepsConfig.length === 0) {
    return (
      <div className="text-center p-8 my-20 font-montserrat">
        <h2 className="text-2xl font-bold text-red-600">Paquete no encontrado</h2>
        <p className="text-gray-600 mt-2">El identificador "{rawId}" no es válido.</p>
        <button
          onClick={() => navigate("/#catalogo")}
          className="mt-6 px-6 py-3 bg-[#168387] text-white rounded-xl font-bold hover:bg-[#126b6e] transition"
        >
          Volver a Catálogo
        </button>
      </div>
    );
  }

  const stepVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const isExtrasStepView = currentStepInfo?.type === "extras";

  return (
    <div
      ref={wizardContainerRef}
      className="bg-[#fbfbfd] min-h-screen pt-20 sm:pt-22 lg:pt-[86px] pb-12 font-montserrat not-italic"
    >
      <Helmet>
        <title>{`Configurador ${bundleId} - Darmax`}</title>
        <meta
          name="description"
          content="Configura tu paquete combo de agua purificada y productos de limpieza con precios especiales."
        />
      </Helmet>

      {/* Breadcrumbs en Cápsula (Oculto en móvil/tablet durante los pasos configurables) */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 mb-4 sm:mb-6 ${isExtrasStepView ? "hidden lg:block" : ""}`}>
        <Breadcrumbs
          steps={breadcrumbSteps}
          currentStepIndex={step + 1}
          onStepClick={(index) => {
            if (index === 0) {
              navigate("/#catalogo");
            } else {
              setStep(index - 1);
            }
          }}
        />
      </div>

      <main id="bundle-wizard-content" className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${bundleId}-${step}`}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="w-full"
          >
            {/* 1. PASO DE SELECCIÓN DE MODELO */}
            {currentStepInfo?.type === "model" && (
              <Step1SelectModel
                modelos={modelsForCurrentStep}
                categoryId={currentStepInfo.modelType === "vendingAgua" ? "Vending" : currentStepInfo.title}
                vendingType="NONE"
                onSelect={handleModelSelect}
                onNext={() => {}}
                catalogHasOsmosis={currentStepInfo.modelType === "vendingAgua" || currentStepInfo.modelType === "mostrador"}
                subtitleOverride={`${bundleId.replace(/-/g, " ")} • Paso ${step + 1} de ${stepsConfig.length}`}
                titleOverride={
                  currentStepInfo.modelType === "vendingLimpieza" ? (
                    <>
                      <span className="block sm:whitespace-nowrap">Elige tu modelo</span>
                      <span className="block pt-1 pb-1.5 leading-tight">
                        <span className="text-[#031638]">de Darmax </span>
                        <span className="bg-gradient-to-r from-[#53c406] via-[#5bc809] to-[#90e119] bg-clip-text text-transparent inline-block">
                          Clean
                        </span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block sm:whitespace-nowrap">Selecciona tu</span>
                      <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent block pt-1 pb-1.5 leading-tight">
                        {currentStepInfo.title}
                      </span>
                    </>
                  )
                }
                descriptionOverride={
                  currentStepInfo.modelType === "vendingAgua"
                    ? "Elige la tecnología de agua purificada que impulsará tu estación de venta automática."
                    : currentStepInfo.modelType === "mostrador"
                    ? "Purificadora para mostrador emparejada especialmente con la tecnología de tu vending seleccionada."
                    : "Diversifica tus ingresos con la venta de productos de limpieza a granel de alta demanda."
                }
                ctaTextOverride="Seleccionar en Paquete"
                hidePpmNotice={currentStepInfo.modelType !== "vendingAgua"}
                hideOsmosisBanner={currentStepInfo.modelType !== "vendingAgua"}
              />
            )}

            {/* 2. PASO DE CONFIGURACIÓN DE EXTRAS */}
            {currentStepInfo?.type === "extras" && (
              <div className="col-span-1 lg:col-span-2">
                {bundleConfig[currentStepInfo.modelType] ? (
                  <Step3ExtrasConfigurator
                    selectedModelId={bundleConfig[currentStepInfo.modelType].slug}
                    onSelect={(summary) => handleExtrasSelect(currentStepInfo.modelType, summary)}
                    onNext={nextStep}
                    onBack={prevStep}
                    hideFooterActions={false}
                  />
                ) : (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                    <p className="text-slate-600 font-bold mb-4">
                      Por favor, selecciona primero el equipo correspondiente.
                    </p>
                    <button
                      onClick={prevStep}
                      className="px-6 py-2.5 rounded-xl bg-[#168387] text-white font-bold"
                    >
                      Regresar al paso anterior
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. PASO DE RESUMEN FINAL DEL PAQUETE */}
            {currentStepInfo?.type === "summary" && (
              <BundleSummaryStep
                bundleId={bundleId}
                bundleConfig={bundleConfig}
                extrasConfig={extrasConfig}
                bundleBasePrice={calculatedBundleBasePrice}
                onBack={prevStep}
                onEditStep={(stepIdx) => setStep(stepIdx)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
