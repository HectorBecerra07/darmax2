// src/pages/BundleWizard.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import Step3ExtrasConfigurator from "../components/Step3ExtrasConfigurator";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const API_URL = import.meta.env.VITE_API_URL;

// --- Helper Functions and Constants ---
const formatCurrency = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(value);

// --- PDF Generation Utilities (adapted from Step4Summary) ---
const BRAND_BLUE = "#5188C9";
const BRAND_TEAL = "#03A4A4";

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
function hexToRgb(hex) {
  const s = hex.replace("#", "");
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}


// --- Bundle Configuration ---

const bundleStepsConfig = {
  "Duo-Emprendedor": [
    {
      step: 0,
      title: "Paso 1: Selecciona tu Vending de Agua",
      modelType: "vendingAgua",
      filter: (m) => m.name.toLowerCase().includes('touch') || m.name.toLowerCase().includes('atlantis'),
      imageType: 'secondary',
    },
    {
      step: 1,
      title: "Paso 2: Configura Extras del Vending de Agua",
      modelType: "vendingAgua",
      type: "extras",
    },
    {
      step: 2,
      title: "Paso 3: Selecciona tu Vending de Limpieza",
      modelType: "vendingLimpieza",
    },
    {
      step: 3,
      title: "Paso 4: Configura Extras de Vending de Limpieza",
      modelType: "vendingLimpieza",
      type: "extras",
    },
    { step: 4, title: "Paso 5: Resumen del Paquete", type: "summary" },
  ],
  Tridente: [
    {
      step: 0,
      title: "Paso 1: Selecciona tu Vending de Agua",
      modelType: "vendingAgua",
      imageType: 'secondary',
      filter: (m) => !(m.slug.toLowerCase().includes('vending5') || m.slug.toLowerCase().includes('vending8') || m.name.toLowerCase().includes('mostrador')),
    },
    {
      step: 1,
      title: "Paso 2: Configura Extras de Vending de Agua",
      modelType: "vendingAgua",
      type: "extras",
    },
    {
      step: 2,
      title: "Paso 3: Selecciona tu Purificadora",
      modelType: "mostrador",
      imageType: 'secondary',
    },
    {
      step: 3,
      title: "Paso 4: Selecciona tu Vending de Limpieza",
      modelType: "vendingLimpieza",
      imageType: 'secondary',
      filter: (m) => m.slug.toLowerCase() === 'vending5',
    },
    {
      step: 4,
      title: "Paso 5: Configura Extras de Vending de Limpieza",
      modelType: "vendingLimpieza",
      type: "extras",
    },
    { step: 5, title: "Paso 6: Resumen del Paquete", type: "summary" },
  ],
  Megalodon: [
    {
      step: 0,
      title: "Paso 1: Selecciona tu Vending de Agua",
      modelType: "vendingAgua",
      imageType: 'secondary',
      filter: (m) => m.name.toLowerCase().includes('atlantis'),
    },
    {
      step: 1,
      title: "Paso 2: Configura Extras de Vending de Agua",
      modelType: "vendingAgua",
      type: "extras",
    },
    {
      step: 2,
      title: "Paso 3: Selecciona tu Purificadora",
      modelType: "mostrador",
      imageType: 'secondary',
    },
    {
      step: 3,
      title: "Paso 4: Selecciona tu Vending de Limpieza (8 Productos)",
      modelType: "vendingLimpieza",
      filter: (m) => m.slug.toLowerCase() === "vending8",
      imageType: 'secondary',
    },
    {
      step: 4,
      title: "Paso 5: Configura Extras de Vending de Limpieza",
      modelType: "vendingLimpieza",
      type: "extras",
    },
    { step: 5, title: "Paso 6: Resumen del Paquete", type: "summary" },
  ],
};

// --- Child Components ---

const ModelCard = ({ model, onSelect, isSelected, imageType }) => {
    const imageToShow = useMemo(() => {
        if (!model.images || model.images.length === 0) return null;

        const sortedImages = [...model.images].sort((a, b) => a.priority - b.priority);

        if (imageType === 'secondary') {
            const secondaryImage = sortedImages.find(img => img.isSecondary);
            if (secondaryImage) return secondaryImage;
        }
        
        // Fallback to the first non-secondary image if available, otherwise first image overall.
        const primaryImage = sortedImages.find(img => !img.isSecondary);
        return primaryImage || sortedImages[0];
    }, [model.images, imageType]);

    return (
    <div
      onClick={() => onSelect(model)}
      className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 text-center ${
        isSelected
          ? "border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-50"
          : "border-gray-200 bg-white hover:border-cyan-400 hover:shadow-lg"
      }`}
    >
      {isSelected && (
          <div className="absolute top-3 right-3 bg-cyan-500 text-white rounded-full h-6 w-6 flex items-center justify-center z-10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
      )}
      {imageToShow ? (
          <img
              src={imageToShow.url}
              alt={imageToShow.alt || model.name}
              className="w-full h-48 object-contain rounded-lg mb-4 shadow-md"
          />
      ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm mb-4 shadow-inner">
              Sin Imagen
          </div>
      )}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900">{model.name}</h3>
        <p className="text-sm text-gray-600 mt-2">
          {model.description}
        </p>
      </div>
      <div className="mt-4">
        <p className="text-xl font-extrabold text-gray-800">
          {formatCurrency(model.basePrice)}
        </p>
      </div>
    </div>
    )
};
  

const ModelSelectionStep = ({
  title,
  models,
  onSelect,
  selectedModelId,
  imageType,
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">{title}</h2>
    {models.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onSelect={onSelect}
            isSelected={selectedModelId === model.id}
            imageType={imageType}
          />
        ))}
      </div>
    ) : (
      <div className="text-center text-gray-500 py-8">
        <p className="font-semibold">No se encontraron modelos para esta categoría.</p>
        <p className="text-sm mt-1">Por favor, verifica que los modelos correctos existan en la base de datos.</p>
      </div>
    )}
  </div>
);

const BundleSummary = ({ config, extras, steps, onEdit }) => {
    const total = useMemo(() => {
        let modelsTotal = Object.values(config).reduce((acc, model) => acc + (model?.basePrice || 0), 0);
        
        let extrasTotal = Object.values(extras).reduce((acc, extraGroup) => {
            if (!extraGroup || !extraGroup.selectedExtras) return acc;
            const groupTotal = extraGroup.selectedExtras.reduce((sum, extra) => {
                return sum + (extra.priceOverride ?? extra.extra.basePrice);
            }, 0);
            return acc + groupTotal;
        }, 0);

        return modelsTotal + extrasTotal;
    }, [config, extras]);
  
    const summaryItems = useMemo(
      () =>
        steps
          .filter((s) => s.type !== "summary" && s.type !== "extras")
          .map((step) => ({
            ...step,
            model: config[step.modelType],
            extras: extras[step.modelType]?.selectedExtras || [],
          })),
      [steps, config, extras]
    );
  
    return (
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          Resumen de tu Paquete
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {summaryItems.map((item, index) => (
            <div key={item.modelType} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-grow">
                  <p className="text-xs font-medium text-gray-500">{item.title.replace(/:/g, '')}</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {item.model?.name || "No seleccionado"}
                  </p>
                  {/* Display extras */}
                  {item.extras.length > 0 && (
                      <div className="pl-4 mt-2 text-sm text-gray-600">
                          <p className="font-semibold">Extras:</p>
                          <ul className="list-disc list-inside">
                              {item.extras.map(extra => (
                                  <li key={extra.id}>{extra.extra.name} - {formatCurrency(extra.priceOverride ?? extra.extra.basePrice)}</li>
                              ))}
                          </ul>
                      </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 sm:mt-0 sm:gap-6">
                   <p className="font-bold text-gray-800 sm:text-right">
                    {item.model ? formatCurrency(item.model.basePrice) : "—"}
                  </p>
                  <button
                    onClick={() => onEdit(steps.findIndex(s => s.modelType === item.modelType && s.type !== 'extras'))}
                    className="text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Total */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-dashed">
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                Total del Paquete:
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {formatCurrency(total)}
              </p>
          </div>
        </div>
      </div>
    );
  };
  

// --- Main Component ---

export default function BundleWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [allModels, setAllModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bundleConfig, setBundleConfig] = useState({
    mostrador: null,
    vendingAgua: null,
    vendingLimpieza: null,
  });

  const [extrasConfig, setExtrasConfig] = useState({
    mostrador: null,
    vendingAgua: null,
    vendingLimpieza: null,
  });

  const steps = useMemo(() => bundleStepsConfig[id] || [], [id]);
  const currentStepInfo = useMemo(() => steps[step], [step, steps]);
  const totalSteps = steps.length;

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        navigate("/inicia-tu-negocio");
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [isModalOpen, navigate]);

  useEffect(() => {
    const fetchAllModels = async () => {
      setLoadingModels(true);
      try {
        const response = await fetch(`${API_URL}/api/configurador/models`);
        if (!response.ok) throw new Error("Error al cargar modelos.");
        const data = await response.json();
        setAllModels(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchAllModels();
  }, []);

  const generarPDF = async () => {
    toast.loading("Generando PDF...", { id: "pdf-toast" });
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const M = 15;
    let y = 45;

    try {
        const templateImage = await loadImage("/img/Plantillas/coti_dar.jpg");

        const addHeader = (pageNumber = 1) => {
            doc.addImage(templateImage, "PNG", 0, 0, pageW, pageH);
            doc.setFontSize(9);
            doc.setTextColor("#888");
            doc.text(`Página ${pageNumber}`, pageW / 2, pageH - 8, { align: "center" });
        };

        const ensureSpace = (need = 8) => {
            if (y + need > pageH - 25) {
                doc.addPage();
                addHeader(doc.getNumberOfPages());
                y = 45;
            }
        };

        const writeTitle = (text) => {
            ensureSpace(12);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor("#111");
            doc.text(text, pageW / 2, y, { align: "center" });
            y += 12;
        };

        const writeH2 = (text) => {
            ensureSpace(10);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(hexToRgb(BRAND_BLUE).r, hexToRgb(BRAND_BLUE).g, hexToRgb(BRAND_BLUE).b);
            doc.text(text, M, y);
            y += 8;
        };
        
        const write = (text, { bold = false, size = 11 } = {}) => {
            const maxWidth = pageW - M * 2;
            doc.setFont("helvetica", bold ? "bold" : "normal");
            doc.setFontSize(size);
            doc.setTextColor("#333");
            const lines = doc.splitTextToSize(text, maxWidth);
            lines.forEach(line => {
                ensureSpace(6);
                doc.text(line, M, y);
                y += 6;
            });
            y += 2;
        };

        const writeBullets = (items) => {
            if (!items || items.length === 0) return;
            const maxWidth = pageW - M * 2 - 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor("#333");
            items.forEach(it => {
                const lines = doc.splitTextToSize(it, maxWidth);
                lines.forEach((line, index) => {
                    ensureSpace(5);
                    doc.text(index === 0 ? `• ${line}` : line, M + 5, y);
                    y += 5;
                });
            });
            y += 3;
        };

        // ====== PDF CONTENT ======
        addHeader(1);
        writeTitle(`Cotización de Paquete: ${id}`);
        y += 5;

        const summaryItems = steps.filter(s => s.type !== 'summary' && s.type !== 'extras');
        let total = 0;

        for (const item of summaryItems) {
            const model = bundleConfig[item.modelType];
            const extras = extrasConfig[item.modelType]?.selectedExtras || [];
            
            if (model) {
                total += model.basePrice;
                writeH2(item.title.replace(/Paso \d: /g, ''));
                write(`${model.name} — ${formatCurrency(model.basePrice)}`, { bold: true, size: 12 });
                if (model.description) write(model.description, { size: 10 });
                writeBullets(model.features);

                if (extras.length > 0) {
                    write("Extras seleccionados:", { bold: true, size: 11 });
                    const extraItems = extras.map(e => `${e.extra.name} - ${formatCurrency(e.priceOverride ?? e.extra.basePrice)}`);
                    writeBullets(extraItems);
                    extras.forEach(e => {
                        total += (e.priceOverride ?? e.extra.basePrice);
                    });
                }

                if (model.images && model.images.length > 0) {
                    try {
                        const modelImage = await loadImage(model.images[0].url);
                        const imgW = 60;
                        const imgH = (modelImage.height / modelImage.width) * imgW;

                        ensureSpace(imgH + 5);
                        try {
                            doc.addImage(modelImage, M, y, imgW, imgH);
                        } catch (addImgError) {
                            console.error("Error adding image to PDF:", addImgError);
                            write("  [Error al renderizar imagen]", { size: 9, bold: false });
                        }
                        y += imgH + 5;
                    } catch (imgError) {
                        console.error(`Could not load image for model ${model.name}:`, imgError);
                        write("  [Imagen no disponible]", { size: 9, bold: false });
                    }
                }
                y += 5;
            }
        }

        ensureSpace(20);
        doc.setLineWidth(0.5);
        doc.setDrawColor("#ddd");
        doc.line(M, y, pageW - M, y);
        y += 10;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor("#111");
        doc.text("Total del Paquete:", M, y);
        doc.text(formatCurrency(total), pageW - M, y, { align: "right" });
        y += 10;
        
        doc.save(`Darmax_Paquete_${id}.pdf`);
        toast.success("PDF generado con éxito", { id: "pdf-toast" });

    } catch (error) {
        console.error("Error al generar PDF:", error);
        toast.error("No se pudo generar el PDF", { id: "pdf-toast" });
    }
  };

  const handleFinish = () => {
    setIsModalOpen(true);
  };


  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));
  const goToStep = (stepIndex) => setStep(Math.max(0, Math.min(stepIndex, totalSteps - 1)));

  const handleSelect = (model) => {
    if (!currentStepInfo) return;
    const modelType = currentStepInfo.modelType;
    setBundleConfig((prev) => ({ ...prev, [modelType]: model }));
    setExtrasConfig((prev) => ({ ...prev, [modelType]: null })); // Reset extras for this model type
    nextStep();
  };

  const handleExtrasSelect = (extras) => {
    if (!currentStepInfo) return;
    const modelType = currentStepInfo.modelType;
    setExtrasConfig(prev => ({ ...prev, [modelType]: extras }));
    nextStep();
  };

  const getModelsForCurrentStep = (bundleConfig, id) => {
    if (!currentStepInfo || currentStepInfo.type === "summary" || currentStepInfo.type === "extras") return [];
    
    const { modelType, filter: specificFilter } = currentStepInfo;
    
    let baseFiltered = allModels.filter(m => {
        const slug = m.slug.toLowerCase();
        switch(modelType) {
            case 'mostrador':
                if ((id === 'Tridente' || id === 'Megalodon') && bundleConfig.vendingAgua) {
                    const vendingName = bundleConfig.vendingAgua.name.toLowerCase();
                    if (vendingName.includes('max')) {
                        return (slug.includes('neptuno') || slug.includes('poseidon')) && m.name.toLowerCase().includes('osmosis');
                    } else {
                        return (slug.includes('neptuno') || slug.includes('poseidon')) && !m.name.toLowerCase().includes('osmosis');
                    }
                }
                return slug.includes('neptuno') || slug.includes('poseidon');

            case 'vendingAgua': return true;

            case 'vendingLimpieza': return slug === 'vending5' || slug === 'vending8';

            default: return false;
        }
    });

        const models = baseFiltered.map(m => {
            if ((id === 'Tridente' || id === 'Megalodon') && modelType === 'mostrador') {
                return { ...m,
                    basePrice: 18000
                };
            }
            return m;
        });

        if (specificFilter) {
            return models.filter(specificFilter);
        }

        return models;
  };

  if (loadingModels) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 text-lg text-gray-700">
          Cargando configurador...
        </div>
      </div>
    );
  }

  if (!currentStepInfo) {
    return (
        <div className="text-center p-8 my-20">
            <h2 className="text-2xl font-bold text-red-600">Configurador no encontrado</h2>
            <p className="text-gray-600 mt-2">El tipo de paquete "${id}" no es válido.</p>
            <button onClick={() => navigate('/inicia-tu-negocio')} className="mt-8 px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors">
                Volver a Modelos de Negocio
            </button>
        </div>
    );
  }

  const renderCurrentStep = () => {
    if (currentStepInfo.type === "summary") {
      return <BundleSummary config={bundleConfig} extras={extrasConfig} steps={steps} onEdit={goToStep} />;
    }

    if (currentStepInfo.type === "extras") {
        const modelType = currentStepInfo.modelType;
        const selectedModel = bundleConfig[modelType];
        if (!selectedModel) {
            // This case should ideally not be reached if the flow is correct.
            return <div className="text-center text-red-500">Por favor, primero selecciona un modelo en el paso anterior.</div>
        }
        return (
          <Step3ExtrasConfigurator
            selectedModelId={selectedModel.slug} // (si tu endpoint realmente recibe slug)
            hideFooterActions
            onChange={(payload) => {
              // aquí guardas la selección sin avanzar de paso
              setExtrasConfig((prev) => ({ ...prev, [modelType]: payload }));
            }}
          />
        );

    }
    
    const models = getModelsForCurrentStep(bundleConfig, id);
    return (
      <ModelSelectionStep
        title={currentStepInfo.title}
        models={models}
        onSelect={handleSelect}
        selectedModelId={bundleConfig[currentStepInfo.modelType]?.id}
        imageType={currentStepInfo.imageType}
      />
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Configurador de Paquete - Darmax</title>
        <meta name="description" content="Configura tu paquete de purificadora y vending a la medida de tus necesidades." />
      </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Configurador de Paquete
            </h1>
            <p className="mt-2 text-base sm:text-lg text-cyan-600 font-semibold">{id}</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
            <div className="flex justify-between mb-2">
                {steps.map((s, index) => (
                    <div key={index} className={`text-xs text-center font-semibold ${step >= index ? 'text-cyan-600' : 'text-gray-400'}`}>
                        PASO {index + 1}
                    </div>
                ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step) / (totalSteps - 1)) * 100}%` }}
            ></div>
            </div>
        </div>

        <div className="bg-white p-6 sm:p-10 border border-gray-200/80 rounded-3xl shadow-lg min-h-[300px]">
            <AnimatePresence mode="wait">
                <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                {renderCurrentStep()}
                </motion.div>
            </AnimatePresence>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between max-w-3xl mx-auto gap-4">
            <button
            onClick={prevStep}
            disabled={step === 0}
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
            >
            Anterior
            </button>
            {step < totalSteps - 1 ? (
            <button
                onClick={nextStep}
                disabled={currentStepInfo?.type !== 'extras' && !bundleConfig[currentStepInfo?.modelType]}
                className="w-full sm:w-auto px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-cyan-700 shadow-sm"
            >
                Siguiente
            </button>
            ) : (
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
                 <button
                    onClick={generarPDF}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold transition-colors hover:bg-slate-900 shadow-sm"
                >
                    Descargar PDF
                </button>
                <button
                    onClick={handleFinish}
                    className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl font-semibold transition-colors hover:bg-green-700 shadow-sm"
                >
                    Finalizar
                </button>
            </div>
            )}
        </div>
        </div>
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
            <motion.div 
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm mx-4"
            >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Configuración Terminada!</h2>
                <p className="text-gray-600">Gracias por configurar tu paquete.</p>
                <p className="mt-3 text-sm text-gray-500 animate-pulse">Serás redirigido en unos segundos...</p>
            </motion.div>
        </div>
      )}
    </div>
  );
}
