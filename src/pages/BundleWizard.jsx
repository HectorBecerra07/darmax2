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
      title: "Paso 1: Selecciona tu Purificadora",
      modelType: "mostrador",
    },
    {
      step: 1,
      title: "Paso 2: Configura Extras de Purificadora",
      modelType: "mostrador",
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
      title: "Paso 1: Selecciona tu Purificadora",
      modelType: "mostrador",
    },
    {
      step: 1,
      title: "Paso 2: Configura Extras de Purificadora",
      modelType: "mostrador",
      type: "extras",
    },
    {
      step: 2,
      title: "Paso 3: Selecciona tu Vending de Agua",
      modelType: "vendingAgua",
    },
    {
      step: 3,
      title: "Paso 4: Configura Extras de Vending de Agua",
      modelType: "vendingAgua",
      type: "extras",
    },
    {
      step: 4,
      title: "Paso 5: Selecciona tu Vending de Limpieza",
      modelType: "vendingLimpieza",
    },
    {
      step: 5,
      title: "Paso 6: Configura Extras de Vending de Limpieza",
      modelType: "vendingLimpieza",
      type: "extras",
    },
    { step: 6, title: "Paso 7: Resumen del Paquete", type: "summary" },
  ],
  Megalodon: [
    {
      step: 0,
      title: "Paso 1: Selecciona tu Purificadora con Ósmosis Inversa",
      modelType: "mostrador",
      filter: (m) => m.name.toLowerCase().includes('osmosis'),
    },
    {
      step: 1,
      title: "Paso 2: Configura Extras de Purificadora",
      modelType: "mostrador",
      type: "extras",
    },
    {
      step: 2,
      title: "Paso 3: Selecciona tu Vending de Agua (Atlantis MAX)",
      modelType: "vendingAgua",
      filter: (m) => m.name.toLowerCase().includes('max'),
    },
    {
      step: 3,
      title: "Paso 4: Configura Extras de Vending de Agua",
      modelType: "vendingAgua",
      type: "extras",
    },
    {
      step: 4,
      title: "Paso 5: Selecciona tu Vending de Limpieza (8 Productos)",
      modelType: "vendingLimpieza",
      filter: (m) => m.slug.toLowerCase() === "vending8",
    },
    {
      step: 5,
      title: "Paso 6: Configura Extras de Vending de Limpieza",
      modelType: "vendingLimpieza",
      type: "extras",
    },
    { step: 6, title: "Paso 7: Resumen del Paquete", type: "summary" },
  ],
};

// --- Child Components ---

const ModelCard = ({ model, onSelect, isSelected }) => (
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
      {model.images && model.images.length > 0 ? (
          <img
              src={model.images[0].url}
              alt={model.images[0].alt || model.name}
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
  );
  

const ModelSelectionStep = ({
  title,
  models,
  onSelect,
  selectedModelId,
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
        const logo = await loadImage("/img/darmax-logo.png");
        const LOGO_W = 30;
        const LOGO_H = (logo.height / logo.width) * LOGO_W;

        const addHeader = (pageNumber = 1) => {
            doc.addImage(logo, "PNG", M, 10, LOGO_W, LOGO_H);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor("#111");
            doc.text("DARMAX Agua y Tecnología", pageW - M, 14, { align: "right" });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor("#444");
            doc.text("darmaxagua@gmail.com | 55 1965 5369", pageW - M, 20, { align: "right" });
            const GAP = 8;
            const xStartTop = M + LOGO_W + GAP;
            const rgbB = hexToRgb(BRAND_BLUE);
            const rgbT = hexToRgb(BRAND_TEAL);
            doc.setDrawColor(rgbB.r, rgbB.g, rgbB.b);
            doc.setLineWidth(1.2);
            doc.line(xStartTop, 32, pageW - M, 32);
            doc.setDrawColor(rgbT.r, rgbT.g, rgbT.b);
            doc.setLineWidth(0.8);
            doc.line(xStartTop, 35, pageW - M, 35);
        };

        const addFooter = (pageNumber) => {
            const yBot1 = pageH - 20;
            const yBot2 = pageH - 17;
            const rgbB = hexToRgb(BRAND_BLUE);
            const rgbT = hexToRgb(BRAND_TEAL);
            doc.setDrawColor(rgbB.r, rgbB.g, rgbB.b);
            doc.setLineWidth(1.2);
            doc.line(M, yBot1, pageW - M, yBot1);
            doc.setDrawColor(rgbT.r, rgbT.g, rgbT.b);
            doc.setLineWidth(0.8);
            doc.line(M, yBot2, pageW - M, yBot2);
            doc.setFontSize(9);
            doc.setTextColor("#888");
            doc.text(`Página ${pageNumber}`, pageW / 2, pageH - 10, { align: "center" });
        }

        const ensureSpace = (need = 8) => {
            if (y + need > pageH - 25) {
                addFooter(doc.getNumberOfPages());
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
                            doc.addImage(modelImage, "JPEG", M, y, imgW, imgH);
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
        
        addFooter(doc.getNumberOfPages());

        doc.save(`Darmax_Paquete_${id}.pdf`);
        toast.success("PDF generado con éxito", { id: "pdf-toast" });

    } catch (error) {
        console.error("Error al generar PDF:", error);
        toast.error("No se pudo generar el PDF", { id: "pdf-toast" });
    }
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

  const getModelsForCurrentStep = () => {
    if (!currentStepInfo || currentStepInfo.type === "summary" || currentStepInfo.type === "extras") return [];
    
    const { modelType, filter: specificFilter } = currentStepInfo;
    
    let baseFiltered = allModels.filter(m => {
        const slug = m.slug.toLowerCase();
        switch(modelType) {
            case 'mostrador': return slug.includes('neptuno') || slug.includes('poseidon');
            case 'vendingAgua': return slug.includes('atlantis');
            case 'vendingLimpieza': return slug === 'vending5' || slug === 'vending8';
            default: return false;
        }
    });

    if (specificFilter) {
        return baseFiltered.filter(specificFilter);
    }
    
    return baseFiltered;
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
            <p className="text-gray-600 mt-2">El tipo de paquete "{id}" no es válido.</p>
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
                selectedModelId={selectedModel.slug}
                onSelect={handleExtrasSelect}
                onNext={nextStep}
                onBack={prevStep}
            />
        );
    }
    
    const models = getModelsForCurrentStep();
    return (
      <ModelSelectionStep
        title={currentStepInfo.title}
        models={models}
        onSelect={handleSelect}
        selectedModelId={bundleConfig[currentStepInfo.modelType]?.id}
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
                    onClick={() => toast.success("¡Configuración completada!")}
                    className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl font-semibold transition-colors hover:bg-green-700 shadow-sm"
                >
                    Finalizar
                </button>
            </div>
            )}
        </div>
        </div>
    </div>
  );
}
