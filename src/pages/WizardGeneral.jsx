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

const API_URL = import.meta.env.VITE_API_URL;

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

  // Sincronizar paso con URL
  const step = parseInt(searchParams.get("s")) || (id === "Vending" ? 0 : 1);
  
  const [vendingType, setVendingType] = useState(id !== "Vending" ? VendingTypeEnum.NONE : null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [extrasPrice, setExtrasPrice] = useState(0);
  const [summaryData, setSummaryData] = useState(null);

  const [allModels, setAllModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);

  // Fetch all models
  useEffect(() => {
    const fetchAllModels = async () => {
      try {
        const response = await fetch(`${API_URL}/api/configurador/models`);
        if (!response.ok) throw new Error("Error al cargar todos los modelos.");
        const data = await response.json();
        setAllModels(data);
      } catch (error) {
        console.error("Failed to fetch all models:", error);
        toast.error("Error al cargar los modelos de máquinas.");
      } finally {
        setLoadingModels(false);
      }
    };
    fetchAllModels();
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
    
    if (id === "Purificadora") filteredByCategory = allModels.filter(m => m.slug.includes("Neptuno"));
    else if (id === "Vending") filteredByCategory = allModels.filter(m => m.slug.includes("Atlantis"));
    else if (id === "Vending-Limpieza") filteredByCategory = allModels.filter(m => m.slug === "Vending5" || m.slug === "Vending8");
    else if (id === "Duo-Emprendedor") filteredByCategory = allModels.filter(m => m.slug.includes("duo-emprendedor"));
    else if (id === "Tridente") filteredByCategory = allModels.filter(m => m.slug.includes("tridente"));
    else if (id === "Megalodon") filteredByCategory = allModels.filter(m => m.slug.includes("megalodon"));

    if (id === "Vending" && vendingType) {
      return filteredByCategory.filter(m => m.vendingType === vendingType);
    }
    return filteredByCategory;
  }, [id, vendingType, allModels, loadingModels]);

  const landingImages = useMemo(() => {
    if (loadingModels) return [];
    let images = modelos.flatMap(m => m.images.filter(img => img.context === 'CAROUSEL' && img.url).map(img => img.url));
    return [...new Set(images.filter(url => url && url.trim() !== ""))];
  }, [modelos, loadingModels]);

  const availableVendingTypes = useMemo(() => {
    if (loadingModels) return [];
    const types = new Set();
    allModels.forEach(m => {
      if (m.vendingType === VendingTypeEnum.TRADICIONAL || m.vendingType === VendingTypeEnum.TOUCH) {
        types.add(m.vendingType);
      }
    });
    return Array.from(types);
  }, [allModels, loadingModels]);

  const getVendingTypeImage = (type) => {
    const model = allModels.find(m => m.vendingType === type && m.images.some(img => img.context === 'CAROUSEL'));
    return model?.images.find(img => img.context === 'CAROUSEL')?.url || "/img/placeholder.png";
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
    <div ref={wizardRef} className="bg-slate-50 min-h-screen pt-12 sm:pt-16 pb-32">
      {/* Breadcrumbs Container más pequeño */}
      <div className="max-w-7xl mx-auto pt-2 px-4 sm:px-6">
        <div className={`bg-white/50 backdrop-blur-sm rounded-xl border border-slate-100 p-2 sm:p-3 transition-all duration-500 ${
          (step === 0 || step === 3) ? 'mb-2 sm:mb-4' : 'mb-12 sm:mb-24'
        }`}>
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