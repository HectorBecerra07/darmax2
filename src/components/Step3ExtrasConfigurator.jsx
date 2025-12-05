import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Step3ExtrasConfigurator({ selectedModelId, onSelect, onNext, onBack }) {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seleccionados, setSeleccionados] = useState([]); // Almacena los IDs de ModelExtra seleccionados

  // Fetch data for the selected model
  useEffect(() => {
    const fetchModelDetails = async () => {
      if (!selectedModelId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/configurador/models/${selectedModelId}`);
        if (!response.ok) {
          throw new Error("Error al cargar los detalles del modelo.");
        }
        const data = await response.json();
        setModelData(data);
        // Pre-seleccionar extras marcados como isDefault si existen
        const defaultExtras = data.extras.filter(me => me.isDefault).map(me => me.id);
        setSeleccionados(defaultExtras);
      } catch (error) {
        toast.error(error.message);
        setModelData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchModelDetails();
  }, [selectedModelId]);

  // Derive extras (ModelExtra) for display from fetched data
  const extras = modelData?.extras || [];
  
  // Find currently selected tinaco extra
  const selectedTinacoExtraId = useMemo(() => {
    if (!modelData) return null;
    const tinacoExtra = extras.find(me => seleccionados.includes(me.id) && me.extra.isTinaco);
    return tinacoExtra ? tinacoExtra.extra.code : null; // Devuelve el código del extra (ej. "tinaco-1100")
  }, [seleccionados, modelData, extras]);

  // Determine if agua-alcalina is selected
  const hasAguaAlcalina = useMemo(() => {
    if (!modelData) return false;
    return extras.some(me => seleccionados.includes(me.id) && me.extra.code === "agua-alcalina");
  }, [seleccionados, modelData, extras]);


  // Logic for selecting images based on context and selected extras
  const getRelevantImage = useMemo(() => (contextType, modelSpecific = true, tinacoCode = null, forAlcalina = false, isSecondary = false, secondaryVariant = null) => {
    if (!modelData || !modelData.images || modelData.images.length === 0) return null;

    let filteredImages = modelData.images.filter(img => {
      // Basic context match
      if (img.context !== contextType) return false;
      // Model specific check
      if (modelSpecific && img.modelId !== modelData.id) return false; // Should not happen with current fetch
      // Alcalina specific
      if (forAlcalina !== img.onlyWhenAlcalina) return false;
      // Secondary specific
      if (isSecondary !== img.isSecondary) return false;
      // Tinaco specific
      if (tinacoCode) {
          return img.tinacoExtra?.code === tinacoCode;
      }
      // Secondary variant specific
      if (secondaryVariant) {
          return img.secondaryVariantKey === secondaryVariant;
      }
      // If tinacoCode is null, and img.tinacoExtraId is not null, it's not a direct match (unless context is TINACO or TINACO_ALCALINA specifically for tinaco images)
      if (!tinacoCode && img.tinacoExtraId) return false;

      return true;
    });

    // Sort by priority (highest first) and return the first one
    filteredImages.sort((a, b) => b.priority - a.priority);
    return filteredImages.length > 0 ? filteredImages[0].url : null;

  }, [modelData]);


  const displayImageSrc = useMemo(() => {
    if (!modelData) return null;
    let image = null;

    if (selectedTinacoExtraId) {
      // Prioritize specific alcalina version for tinaco
      image = getRelevantImage('TINACO', true, selectedTinacoExtraId, hasAguaAlcalina);
      
      // Fallback for tinaco if alcalina-specific one isn't found
      if (!image && hasAguaAlcalina) {
          image = getRelevantImage('TINACO', true, selectedTinacoExtraId, false);
      }
      if (image) return image;
    }

    // Prioritize specific alcalina version for base model
    if (hasAguaAlcalina) {
        image = getRelevantImage('MODEL_BASE_ALCALINA', true, null, true);
        if (image) return image;
    }

    // Fallback to base model image
    image = getRelevantImage('MODEL_BASE', true, null, false);
    return image;

  }, [modelData, selectedTinacoExtraId, hasAguaAlcalina, getRelevantImage]);

  const secondaryImageSrc = useMemo(() => {
    if (!modelData) return null;
    
    // Prioritize specific alcalina version for secondary image
    let image = getRelevantImage('SECONDARY', true, null, hasAguaAlcalina, true);

    // Fallback for secondary image if alcalina-specific one isn't found
    if (!image && hasAguaAlcalina) {
        image = getRelevantImage('SECONDARY', true, null, false, true);
    }

    return image;
  }, [modelData, hasAguaAlcalina, getRelevantImage]);


  const currentDisplayString = useMemo(() => {
    if (!modelData) return "Cargando...";
    const baseText = `Configuración base de ${modelData.name}`;

    const selectedModelExtras = extras.filter(me => seleccionados.includes(me.id));
    if (selectedModelExtras.length === 0) return baseText;

    const parts = selectedModelExtras.map(me => me.extra.name);
    return `${baseText} + ${parts.join(" + ")}`;
  }, [seleccionados, modelData, extras]);


  const toggleExtra = (modelExtraId) => {
    const extraSeleccionado = extras.find(me => me.id === modelExtraId);
    if (!extraSeleccionado) return;

    const esTinaco = extraSeleccionado.extra.isTinaco;

    setSeleccionados((prev) => {
      if (prev.includes(modelExtraId)) {
        return prev.filter((item) => item !== modelExtraId);
      } else {
        if (esTinaco) {
          // Si es un tinaco, deseleccionar cualquier otro tinaco
          const sinOtrosTinacos = prev.filter((prevModelExtraId) => {
            const prevExtra = extras.find(me => me.id === prevModelExtraId);
            return !prevExtra?.extra.isTinaco;
          });
          return [...sinOtrosTinacos, modelExtraId];
        }
        return [...prev, modelExtraId];
      }
    });
  };

  const estaDeshabilitado = (modelExtra) => {
    if (!modelExtra.extra.isTinaco) return false; // Solo deshabilitamos tinacos

    const hayTinacoSeleccionado = seleccionados.some(id => {
      const selectedMe = extras.find(me => me.id === id);
      return selectedMe?.extra.isTinaco;
    });

    // Deshabilitar otros tinacos si ya hay uno seleccionado y no es el actual
    return hayTinacoSeleccionado && !seleccionados.includes(modelExtra.id);
  };

  if (loading || !modelData) {
    return <div className="text-center p-8 text-lg text-gray-700">Cargando opciones de configuración...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Extras Opcionales</h2>

      {/* Vista previa ARRIBA */}
      {(displayImageSrc || secondaryImageSrc) && (
        <div className={`max-w-4xl mx-auto md:flex md:gap-4 ${!secondaryImageSrc ? 'md:justify-center' : ''}`}>
          {/* Vista previa del modelo */}
          {displayImageSrc && (
            <div className={`${!secondaryImageSrc ? 'md:w-full' : 'md:w-1/2'}`}>
              <h3 className="text-lg font-semibold text-gray-800">Vista previa del modelo</h3>
              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={displayImageSrc}
                    alt={`Imagen de ${modelData.name} - ${currentDisplayString}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sugerencia visual: {currentDisplayString}.
                </p>
              </div>
            </div>
          )}

          {/* Vista previa secundaria (vending Atlantis) */}
          {secondaryImageSrc && (
            <div className={`${!displayImageSrc ? 'md:w-full' : 'md:w-1/2'} ${displayImageSrc ? 'mt-8 md:mt-0' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800">Vista previa de la Vending</h3>
              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={secondaryImageSrc}
                    alt={`Imagen secundaria para ${modelData.name}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Componente adicional para {modelData.name}.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de extras */}
      <ul className="space-y-4 max-w-3xl mx-auto">
        {extras.map((modelExtra) => (
          <li
            key={modelExtra.id}
            className={`border rounded-lg p-4 cursor-pointer transition ${
              seleccionados.includes(modelExtra.id)
                ? "border-gray-900 bg-gray-50"
                : "border-gray-300 hover:border-gray-500"
            } ${estaDeshabilitado(modelExtra) ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (!estaDeshabilitado(modelExtra)) toggleExtra(modelExtra.id);
            }}
          >
            <div className="flex justify-between items-center gap-4">
              <div className="min-w-0">
                <p className="font-medium text-gray-800 break-words">{modelExtra.extra.name}</p>
                <p className="text-gray-500 text-sm">{modelExtra.extra.description}</p>
                <p className="text-sm font-bold text-gray-700">
                  ${(modelExtra.priceOverride ?? modelExtra.extra.basePrice).toLocaleString()} MXN
                </p>
              </div>
              <input
                type="checkbox"
                checked={seleccionados.includes(modelExtra.id)}
                readOnly
                disabled={estaDeshabilitado(modelExtra)}
                className="w-5 h-5 accent-black shrink-0"
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Botones */}
      <div className="flex flex-col md:flex-row justify-between gap-4 max-w-3xl mx-auto mt-8">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-800 rounded-lg px-6 py-3 hover:bg-gray-400"
        >
          ← Regresar
        </button>

        <button
          onClick={() => {
            const extrasSeleccionados = extras.filter((e) => seleccionados.includes(e.id));
            
            // Pasar todos los datos relevantes al componente padre
            onSelect({
              model: modelData, // El objeto MachineModel completo
              selectedExtras: extrasSeleccionados, // Los ModelExtra seleccionados
              displayImage: displayImageSrc, // URL de la imagen principal
              secondaryImage: secondaryImageSrc, // URL de la imagen secundaria
              summaryString: currentDisplayString, // Cadena de resumen
            });
            onNext();
          }}
          className="bg-black text-white rounded-lg px-6 py-3 hover:opacity-90"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}