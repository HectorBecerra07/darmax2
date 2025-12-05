// WizardGeneral.jsx
import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Step0SelectVendingType from "../components/Step0SelectVendingType";
import Step1SelectModel from "../components/Step1SelectModel";
import Step2ModelDetails from "../components/Step2ModelDetails";
import Step3ExtrasConfigurator from "../components/Step3ExtrasConfigurator";
import Step4Summary from "../components/Step4Summary";
import CarouselImages from "../components/CarouselImages";
import Breadcrumbs from "../components/Breadcrumbs";
import { VendingType as VendingTypeEnum } from "@prisma/client";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function WizardGeneral() {
  const { id } = useParams();
  const [step, setStep] = useState(id === "Vending" ? 0 : 1);
  const [vendingType, setVendingType] = useState(id !== "Vending" ? VendingTypeEnum.NONE : null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [extrasPrice, setExtrasPrice] = useState(0);
  const [summaryData, setSummaryData] = useState(null);

  const [allModels, setAllModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);

  // Fetch all models from the API
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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

  const breadcrumbSteps = useMemo(() => {
    const dynamicSteps = [];
    if (id === "Vending") {
      dynamicSteps.push(
        { label: "Tipo de Vending" }, // Wizard Step 0
        { label: "Seleccionar Modelo" }, // Wizard Step 1
        { label: "Detalles del Modelo" }, // Wizard Step 2
        { label: "Extras Opcionales" }, // Wizard Step 3
        { label: "Resumen" } // Wizard Step 4
      );
    } else { // Purificadora or Vending-Limpieza
      dynamicSteps.push(
        { label: "Seleccionar Modelo" }, // Wizard Step 1
        { label: "Detalles del Modelo" }, // Wizard Step 2
        { label: "Extras Opcionales" }, // Wizard Step 3
        { label: "Resumen" } // Wizard Step 4
      );
    }

    const finalBreadcrumbSteps = [
      { label: "Inicio", path: "/" },
    ];

    finalBreadcrumbSteps.push(...dynamicSteps);
    return finalBreadcrumbSteps;
  }, [id]);

  const actualBreadcrumbStepIndex = useMemo(() => {
    let baseBreadcrumbCount = 1; // "Inicio"
    const adjustedStep = (id === "Vending") ? step : (step - 1);
    return baseBreadcrumbCount + adjustedStep;
  }, [id, step]);

  // Modelos filtrados dinámicamente desde la DB
  const modelos = useMemo(() => {
    if (loadingModels) return [];
    
    let filteredByCategory = [];
    if (id === "Purificadora") {
      filteredByCategory = allModels.filter(m => m.slug.includes("Neptuno"));
    } else if (id === "Vending") {
      // Mostrar solo vending de agua (Atlantis)
      filteredByCategory = allModels.filter(m => m.slug.includes("Atlantis"));
    } else if (id === "Vending-Limpieza") {
      // Mostrar solo vending de limpieza
      filteredByCategory = allModels.filter(m => m.slug === "Vending5" || m.slug === "Vending8");
    } else {
        filteredByCategory = allModels;
    }

    // El filtro de tipo de Vending solo aplica a la categoría "Vending"
    if (id === "Vending" && vendingType) {
      return filteredByCategory.filter(m => m.vendingType === vendingType);
    }
    return filteredByCategory;
  }, [id, vendingType, allModels, loadingModels]);

  // Imágenes para el carrusel de Step 1
  const landingImages = useMemo(() => {
    if (loadingModels) return [];
    
    let images = [];
    if (id === "Purificadora") {
      images = allModels.filter(m => m.slug.includes("Neptuno"))
                       .flatMap(m => m.images.filter(img => img.context === 'CAROUSEL').map(img => img.url));
    } else if (id === "Vending-Limpieza") {
      images = allModels.filter(m => m.slug.includes("Vending") && m.slug.includes("Limpieza"))
                       .flatMap(m => m.images.filter(img => img.context === 'CAROUSEL').map(img => img.url));
    } else if (id === "Vending") {
        if (vendingType === VendingTypeEnum.TRADICIONAL) {
            images = allModels.filter(m => m.vendingType === VendingTypeEnum.TRADICIONAL)
                              .flatMap(m => m.images.filter(img => img.context === 'CAROUSEL').map(img => img.url));
        } else if (vendingType === VendingTypeEnum.TOUCH) {
            images = allModels.filter(m => m.vendingType === VendingTypeEnum.TOUCH)
                              .flatMap(m => m.images.filter(img => img.context === 'CAROUSEL').map(img => img.url));
        } else { // antes de elegir tipo, mezcla de Vending tradicional y touch
             images = allModels.filter(m => m.vendingType === VendingTypeEnum.TRADICIONAL || m.vendingType === VendingTypeEnum.TOUCH)
                               .flatMap(m => m.images.filter(img => img.context === 'CAROUSEL').map(img => img.url));
        }
    }
    return [...new Set(images)]; // Eliminar duplicados
  }, [id, vendingType, allModels, loadingModels]);

  // Tipos de vending disponibles dinámicamente
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

  // Función para obtener la imagen representativa de un tipo de vending
  const getVendingTypeImage = useMemo(() => (type) => {
    if (loadingModels) return "";
    // Busca la primera imagen de carrusel de un modelo de ese tipo
    const modelWithImage = allModels.find(m => m.vendingType === type && m.images.some(img => img.context === 'CAROUSEL'));
    return modelWithImage?.images.find(img => img.context === 'CAROUSEL')?.url || "/img/placeholder.png"; // Fallback placeholder
  }, [allModels, loadingModels]);

  if (loadingModels) {
    return <div className="text-center p-8 text-lg text-gray-700">Cargando modelos...</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          steps={breadcrumbSteps}
          currentStepIndex={actualBreadcrumbStepIndex}
          onStepClick={(index) => {
            let baseBreadcrumbCount = 1;
            const newStep = index - baseBreadcrumbCount;
            setStep((id === "Vending") ? newStep : (newStep + 1));
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
      >
        {id === "Vending" && step === 0 && (
          <div className="col-span-2">
            <Step0SelectVendingType
              onSelect={(type) => {
                setVendingType(type);
                setSelectedModel(null);
                setStep(1);
              }}
              availableVendingTypes={availableVendingTypes}
              getVendingTypeImage={getVendingTypeImage}
            />
          </div>
        )}

        {step === 1 && (
          <>
            <div className="space-y-10">
              <CarouselImages images={landingImages} />
            </div>
            <div>
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
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <CarouselImages
              images={selectedModel.images.filter(img => img.context === 'CAROUSEL').map(img => img.url)}
            />
            <div>
              <Step2ModelDetails
                modelo={selectedModel}
                vendingType={vendingType}
                onNext={() => { nextStep(); }}
                onBack={prevStep}
              />
            </div>
          </div>
        )}

        {step === 3 && selectedModel && (
          <div className="col-span-2">
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
          <div className="col-span-2">
            <Step4Summary
              summaryData={summaryData}
              onBack={prevStep}
            />
          </div>
        )}
      </motion.div>
    </>
  );
}