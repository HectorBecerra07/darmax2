import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Step3ExtrasConfigurator({
  selectedModelId,
  onSelect,     // se usa cuando SI quieres que el propio componente “finalice”
  onNext,
  onBack,

  // ✅ NUEVO
  hideFooterActions = false,
  onChange, // (payload) => void  (se llama en cada cambio)
}) {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seleccionados, setSeleccionados] = useState([]);
  const [openAccordion, setOpenAccordion] = useState("otros");

  useEffect(() => {
    const fetchModelDetails = async () => {
      if (!selectedModelId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/api/configurador/models/${selectedModelId}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar los detalles del modelo.");
        }
        const data = await response.json();
        setModelData(data);

        const defaultExtras = (data.extras || [])
          .filter((me) => me.isDefault)
          .map((me) => me.id);

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

  const extras = modelData?.extras || [];

  const selectedTinacoExtraId = useMemo(() => {
    if (!modelData) return null;
    const tinacoExtra = extras.find(
      (me) => seleccionados.includes(me.id) && me.extra?.isTinaco
    );
    return tinacoExtra ? tinacoExtra.extra.code : null;
  }, [seleccionados, modelData, extras]);

  const hasAguaAlcalina = useMemo(() => {
    if (!modelData) return false;
    return extras.some(
      (me) => seleccionados.includes(me.id) && me.extra?.code === "agua-alcalina"
    );
  }, [seleccionados, modelData, extras]);

  const isMostrador = useMemo(() => {
    if (!modelData) return false;
    const s = modelData.slug.toLowerCase();
    return s.includes("neptuno") || modelData.name.toLowerCase().includes("mostrador");
  }, [modelData]);

  const getRelevantImage = useMemo(
    () =>
      (
        contextType,
        modelSpecific = true,
        tinacoCode = null,
        forAlcalina = false,
        isSecondary = false,
        secondaryVariant = null
      ) => {
        if (!modelData?.images?.length) return null;

        let filteredImages = modelData.images.filter((img) => {
          if (img.context !== contextType) return false;
          if (modelSpecific && img.modelId !== modelData.id) return false;
          if (forAlcalina !== img.onlyWhenAlcalina) return false;
          if (isSecondary !== img.isSecondary) return false;

          if (tinacoCode) return img.tinacoExtra?.code === tinacoCode;
          if (secondaryVariant) return img.secondaryVariantKey === secondaryVariant;

          if (!tinacoCode && img.tinacoExtraId) return false;
          return true;
        });

        filteredImages.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        return filteredImages.length ? filteredImages[0].url : null;
      },
    [modelData]
  );

  const displayImageSrc = useMemo(() => {
    if (!modelData) return null;
    let image = null;

    // Logic for Mostrador (Neptuno): Prioritize showing SOMETHING (Base or Secondary) 
    // because Mostrador is often just one main furniture image.
    if (isMostrador) {
       // 1. Try Tinaco specific (if exists)
       if (selectedTinacoExtraId) {
         if (hasAguaAlcalina) {
            image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, true);
            if (!image) image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, false);
         }
         if (!image) image = getRelevantImage("TINACO", true, selectedTinacoExtraId, hasAguaAlcalina);
         if (!image && hasAguaAlcalina) image = getRelevantImage("TINACO", true, selectedTinacoExtraId, false);
         
         if (image) return image;
       }
       
       // 2. Fallback to Base (standard)
       if (hasAguaAlcalina) {
         image = getRelevantImage("MODEL_BASE_ALCALINA", true, null, true);
       }
       if (!image) {
         image = getRelevantImage("MODEL_BASE", true, null, false);
       }
       if (image) return image;

       // 3. Fallback to Secondary (if user uploaded Mostrador as Secondary like a Vending Machine)
       // This ensures the furniture shows up in the main box if no base/tinaco image is found.
       if (hasAguaAlcalina) {
          image = getRelevantImage("SECONDARY_ALCALINA", true, null, true, true);
          if (!image) image = getRelevantImage("SECONDARY_ALCALINA", true, null, false, true);
       }
       if (!image) {
          image = getRelevantImage("SECONDARY", true, null, hasAguaAlcalina, true);
          if (!image && hasAguaAlcalina) image = getRelevantImage("SECONDARY", true, null, false, true);
       }
       return image;
    }

    // Standard Logic (Vending, etc.)
    if (selectedTinacoExtraId) {
      if (hasAguaAlcalina) {
        // Try TINACO_ALCALINA context first (explicit combination)
        image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, true);
        if (!image) {
          // Try with onlyWhenAlcalina=false just in case
          image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, false);
        }
        if (image) return image;
      }

      image = getRelevantImage("TINACO", true, selectedTinacoExtraId, hasAguaAlcalina);
      if (!image && hasAguaAlcalina) {
        image = getRelevantImage("TINACO", true, selectedTinacoExtraId, false);
      }
      if (image) return image;
    }

    if (hasAguaAlcalina) {
      image = getRelevantImage("MODEL_BASE_ALCALINA", true, null, true);
      if (image) return image;
    }

    return getRelevantImage("MODEL_BASE", true, null, false);
  }, [modelData, selectedTinacoExtraId, hasAguaAlcalina, getRelevantImage, isMostrador]);

  const secondaryImageSrc = useMemo(() => {
    if (!modelData) return null;

    let image = null;

    if (hasAguaAlcalina) {
      // Try SECONDARY_ALCALINA context first
      image = getRelevantImage("SECONDARY_ALCALINA", true, null, true, true);
      if (!image) {
        image = getRelevantImage("SECONDARY_ALCALINA", true, null, false, true);
      }
      if (image) {
          // Prevent duplicate if Mostrador used this as primary
          if (isMostrador && image === displayImageSrc) return null;
          return image;
      }
    }

    image = getRelevantImage("SECONDARY", true, null, hasAguaAlcalina, true);
    if (!image && hasAguaAlcalina) {
      image = getRelevantImage("SECONDARY", true, null, false, true);
    }
    
    // Prevent duplicate if Mostrador used this as primary
    if (isMostrador && image === displayImageSrc) return null;

    return image;
  }, [modelData, hasAguaAlcalina, getRelevantImage, isMostrador, displayImageSrc]);

  const currentDisplayString = useMemo(() => {
    if (!modelData) return "Cargando...";
    const baseText = `Configuración base de ${modelData.name}`;

    const selectedModelExtras = extras.filter((me) => seleccionados.includes(me.id));
    if (!selectedModelExtras.length) return baseText;

    const parts = selectedModelExtras.map((me) => me.extra?.name).filter(Boolean);
    return `${baseText} + ${parts.join(" + ")}`;
  }, [seleccionados, modelData, extras]);

  const tinacoExtras = extras.filter((me) => me.extra?.isTinaco);
  const alcalinaExtra = extras.find((me) => me.extra?.code === "agua-alcalina");
  const otherExtras = extras.filter(
    (me) => !me.extra?.isTinaco && me.extra?.code !== "agua-alcalina"
  );

  const estaDeshabilitado = (modelExtra) => {
    if (!modelExtra?.extra?.isTinaco) return false;

    const hayTinacoSeleccionado = seleccionados.some((id) => {
      const selectedMe = extras.find((me) => me.id === id);
      return selectedMe?.extra?.isTinaco;
    });

    return hayTinacoSeleccionado && !seleccionados.includes(modelExtra.id);
  };

  const toggleExtra = (modelExtraId) => {
    const extraSeleccionado = extras.find((me) => me.id === modelExtraId);
    if (!extraSeleccionado) return;

    const esTinaco = extraSeleccionado.extra?.isTinaco;

    setSeleccionados((prev) => {
      if (prev.includes(modelExtraId)) {
        return prev.filter((item) => item !== modelExtraId);
      } else {
        if (esTinaco) {
          const sinOtrosTinacos = prev.filter((prevModelExtraId) => {
            const prevExtra = extras.find((me) => me.id === prevModelExtraId);
            return !prevExtra?.extra?.isTinaco;
          });
          return [...sinOtrosTinacos, modelExtraId];
        }
        return [...prev, modelExtraId];
      }
    });
  };

  const buildPayload = useMemo(() => {
    if (!modelData) return null;
    const extrasSeleccionados = extras.filter((e) => seleccionados.includes(e.id));
    return {
      model: modelData,
      selectedExtras: extrasSeleccionados,
      displayImage: displayImageSrc,
      secondaryImage: secondaryImageSrc,
      summaryString: currentDisplayString,
    };
  }, [modelData, extras, seleccionados, displayImageSrc, secondaryImageSrc, currentDisplayString]);

  // ✅ NUEVO: avisar al padre “en vivo” cuando cambie la selección
  useEffect(() => {
    if (onChange && buildPayload) onChange(buildPayload);
  }, [onChange, buildPayload]);

  const renderExtraItem = (modelExtra) => (
    <li
      key={modelExtra.id}
      className={`list-none border rounded-lg p-4 cursor-pointer transition shadow-md ${
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
          <p className="font-medium text-gray-800 break-words">{modelExtra.extra?.name}</p>
          <p className="text-gray-500 text-sm">{modelExtra.extra?.description}</p>
          <p className="text-sm font-bold text-gray-700">
            ${(modelExtra.priceOverride ?? modelExtra.extra?.basePrice ?? 0).toLocaleString()} MXN
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
  );

  if (loading || !modelData) {
    return (
      <div className="text-center p-8 text-lg text-gray-700">
        Cargando opciones de configuración...
      </div>
    );
  }

  const hasAnyPreview = Boolean(displayImageSrc || secondaryImageSrc);

  return (
    <div className={hasAnyPreview ? "md:flex md:gap-8 lg:gap-12" : "flex justify-center"}>
      {/* Izquierda */}
      {hasAnyPreview && (
        <div className="md:w-1/2 md:sticky md:top-8 md:self-start">
          <div className="flex flex-col gap-4">
            {displayImageSrc && (
              <div>
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

            {secondaryImageSrc && (
              <div>
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
                  <p className="text-xs text-gray-500 mt-2">Componente adicional para {modelData.name}.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Derecha */}
      <div
        className={
          hasAnyPreview
            ? "md:w-1/2 space-y-8 mt-8 md:mt-0"
            : "w-full max-w-3xl space-y-8 mt-8 md:mt-0 px-4"
        }
      >
        <h2 className="text-3xl font-bold text-gray-800">Extras Opcionales</h2>

        <div className="space-y-4">
          {alcalinaExtra && renderExtraItem(alcalinaExtra)}

          {tinacoExtras.length > 0 && (
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setOpenAccordion(openAccordion === "tinacos" ? null : "tinacos")}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
              >
                <span className="font-semibold text-lg text-gray-800">Tinacos (Almacenamiento)</span>
                <span className="text-2xl text-gray-500">{openAccordion === "tinacos" ? "-" : "+"}</span>
              </button>
              {openAccordion === "tinacos" && (
                <ul className="p-4 space-y-4 bg-white">{tinacoExtras.map(renderExtraItem)}</ul>
              )}
            </div>
          )}

          {otherExtras.length > 0 && (
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setOpenAccordion(openAccordion === "otros" ? null : "otros")}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
              >
                <span className="font-semibold text-lg text-gray-800">Otros</span>
                <span className="text-2xl text-gray-500">{openAccordion === "otros" ? "-" : "+"}</span>
              </button>
              {openAccordion === "otros" && (
                <ul className="p-4 space-y-4 bg-white">{otherExtras.map(renderExtraItem)}</ul>
              )}
            </div>
          )}
        </div>

        {/* ✅ Solo mostrar footer si NO está embebido */}
        {!hideFooterActions && (
          <div className="flex flex-col md:flex-row justify-between gap-4 pt-4">
            <button
              onClick={onBack}
              className="bg-gray-300 text-gray-800 rounded-lg px-6 py-3 hover:bg-gray-400"
            >
              ← Regresar
            </button>

            <button
              onClick={() => {
                if (!buildPayload) return;
                onSelect?.(buildPayload);
                onNext?.();
              }}
              className="bg-black text-white rounded-lg px-6 py-3 hover:opacity-90"
            >
              Continuar →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
