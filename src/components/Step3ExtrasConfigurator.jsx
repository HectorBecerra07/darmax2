import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
       // 1. Try Tinaco specific WITH Alcalina (Most specific)
       if (selectedTinacoExtraId && hasAguaAlcalina) {
            image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, true);
            if (!image) image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, false);
            if (image) return image;
       }
       
       // 2. Fallback to Base WITH Alcalina (Prioritize showing Alcalina feature over generic Tinaco)
       if (hasAguaAlcalina) {
         image = getRelevantImage("MODEL_BASE_ALCALINA", true, null, true);
         if (image) return image;
       }

       // 3. Try Tinaco specific (Standard/Generic)
       if (selectedTinacoExtraId) {
         image = getRelevantImage("TINACO", true, selectedTinacoExtraId, false); // Generic Tinaco
         if (image) return image;
       }

       // 4. Fallback to Base (Standard)
       image = getRelevantImage("MODEL_BASE", true, null, false);
       if (image) return image;

       // 5. Fallback to Secondary (if user uploaded Mostrador as Secondary like a Vending Machine)
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
    <div className={`w-full pb-32 ${hasAnyPreview ? "lg:flex lg:items-start lg:gap-12" : "flex justify-center"}`}>
      {/* Panel de Vista Previa: FIXED en Móvil, STICKY en Desktop */}
      {hasAnyPreview && (
        <div className="
          fixed top-[72px] left-0 right-0 z-40 bg-slate-50 border-b border-cyan-500/20 px-4 pt-2 pb-4 shadow-md
          lg:static lg:w-[40%] lg:sticky lg:top-24 lg:bg-transparent lg:border-none lg:p-0 lg:m-0 lg:shadow-none
        ">
          <div className="flex flex-col gap-3 max-w-7xl mx-auto">
            {displayImageSrc && (
              <div className="bg-white border-2 border-[#24d4da]/30 rounded-2xl p-2 lg:p-4 shadow-sm lg:shadow-xl overflow-hidden">
                <div className="h-32 sm:h-56 lg:h-auto lg:aspect-video w-full overflow-hidden rounded-xl bg-slate-50/50 flex items-center justify-center">
                  <motion.img
                    key={displayImageSrc}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={displayImageSrc}
                    alt={`Imagen de ${modelData.name}`}
                    className="max-h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* Configuración actual (solo visible si hay espacio o en desktop) */}
            <div className="hidden sm:block bg-[#168387]/5 border border-[#168387]/10 rounded-xl p-3">
              <p className="text-[10px] sm:text-xs font-bold text-[#168387] leading-tight">
                <span className="font-black uppercase tracking-wider block mb-1 opacity-60 text-[8px]">Modelo actual:</span>
                {currentDisplayString}
              </p>
            </div>

            {/* Imagen secundaria solo visible en Desktop */}
            {secondaryImageSrc && (
              <div className="hidden lg:block bg-white border border-slate-100 rounded-2xl p-4 shadow-lg">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                  Vista Adicional
                </span>
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-50/50 flex items-center justify-center">
                  <img
                    src={secondaryImageSrc}
                    alt="Imagen secundaria"
                    className="max-h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Listado de Extras: Añadimos padding-top en móvil para compensar el FIXED */}
      <div className={`
        ${hasAnyPreview ? "lg:w-[60%] pt-[200px] lg:pt-0" : "w-full max-w-3xl"} 
        flex flex-col
      `}>
        <div className="space-y-1 mb-6">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter">
            Extras <span className="text-[#168387]">Opcionales</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Personaliza tu unidad con componentes de alto rendimiento.
          </p>
        </div>

        {/* Los extras fluyen con el scroll normal de la página en móvil, interno en desktop */}
        <div className="space-y-2 mb-8 lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:max-h-[calc(100vh-280px)] scrollbar-thin">
          {alcalinaExtra && renderExtraItem(alcalinaExtra)}

          {[
            { id: "tinacos", title: "Tinacos (Almacenamiento)", items: tinacoExtras },
            { id: "otros", title: "Otros Componentes", items: otherExtras }
          ].map((section) => (
            section.items.length > 0 && (
              <div key={section.id} className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)}
                  className="w-full flex justify-between items-center p-3 sm:p-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[9px] sm:text-xs font-black text-slate-700 uppercase tracking-[0.2em]">
                    {section.title}
                  </span>
                  <div className={`p-1 rounded-md transition-all ${openAccordion === section.id ? 'bg-[#168387] text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openAccordion === section.id && (
                  <ul className="p-2 space-y-2 border-t border-slate-50">
                    {section.items.map(renderExtraItem)}
                  </ul>
                )}
              </div>
            )
          ))}
        </div>

        {/* Footer Actions: Siempre visible al final */}
        {!hideFooterActions && (
          <div className="
            fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 flex gap-3 z-30
            lg:static lg:p-0 lg:pt-6 lg:bg-transparent lg:border-t-0
          ">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition"
            >
              Atrás
            </button>
            <button
              onClick={() => {
                if (!buildPayload) return;
                onSelect?.(buildPayload);
                onNext?.();
              }}
              className="flex-[2] px-4 py-3 rounded-xl bg-[#168387] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#24d4da] transition-all shadow-lg shadow-cyan-900/10"
            >
              Confirmar Selección
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
