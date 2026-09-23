import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import FormattedDescription from "../utils/formatDescription";

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
  const [openSections, setOpenSections] = useState(["otros"]);
  const [activeView, setActiveView] = useState("primary");

  const toggleSection = (sectionId) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

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

  useEffect(() => {
    setActiveView("primary");
  }, [displayImageSrc]);

  const currentDisplayString = useMemo(() => {
    if (!modelData) return "Cargando...";
    const baseText = `Configuración base de ${modelData.name}`;

    const selectedModelExtras = extras.filter((me) => seleccionados.includes(me.id));
    if (!selectedModelExtras.length) return baseText;

    const parts = selectedModelExtras.map((me) => me.extra?.name).filter(Boolean);
    return `${baseText} + ${parts.join(" + ")}`;
  }, [seleccionados, modelData, extras]);

  const getExtraPriority = (modelExtra) => {
    const extraCode = modelExtra.extra?.code?.toLowerCase() || "";
    const extraName = modelExtra.extra?.name?.toLowerCase() || "";

    // 1. Indispensable (Violeta)
    if (
      extraCode.includes("aviso") ||
      extraCode.includes("funcionamiento") ||
      extraName.includes("aviso") ||
      extraName.includes("funcionamiento")
    ) {
      return 1;
    }

    // 2. Altamente Recomendado (Ámbar)
    if (
      extraCode.includes("insumo") ||
      (extraName.includes("insumo") && (extraName.includes("anual") || extraName.includes("kit"))) ||
      extraCode.includes("pipa") ||
      extraName.includes("pipa")
    ) {
      return 2;
    }

    // 3. Recomendado (Turquesa)
    if (
      extraCode === "agua-alcalina" ||
      extraName.includes("alcalina")
    ) {
      return 3;
    }

    // 4. Opcional (Esmeralda)
    if (
      extraCode.includes("seguro") ||
      extraName.includes("seguro") ||
      extraCode.includes("mantenimiento") ||
      extraName.includes("mantenimiento")
    ) {
      return 4;
    }

    // 5. Demás adicionales estándar
    return 5;
  };

  const tinacoExtras = useMemo(
    () => extras.filter((me) => me.extra?.isTinaco),
    [extras]
  );

  const adicionalesExtras = useMemo(() => {
    const items = extras.filter((me) => !me.extra?.isTinaco);
    return [...items].sort((a, b) => getExtraPriority(a) - getExtraPriority(b));
  }, [extras]);

  const estaDeshabilitado = (_modelExtra) => {
    return false;
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

  const renderExtraItem = (modelExtra) => {
    const isSelected = seleccionados.includes(modelExtra.id);
    const disabled = estaDeshabilitado(modelExtra);
    const extraCode = modelExtra.extra?.code?.toLowerCase() || "";
    const extraName = modelExtra.extra?.name?.toLowerCase() || "";

    const isAlcalina =
      extraCode === "agua-alcalina" ||
      extraName.includes("alcalina");

    const isAltamenteRecomendado =
      extraCode.includes("insumo") ||
      (extraName.includes("insumo") && (extraName.includes("anual") || extraName.includes("kit"))) ||
      extraCode.includes("pipa") ||
      extraName.includes("pipa");

    const isAviso =
      extraCode.includes("aviso") ||
      extraCode.includes("funcionamiento") ||
      extraName.includes("aviso") ||
      extraName.includes("funcionamiento");

    const isOpcional =
      extraCode.includes("seguro") ||
      extraName.includes("seguro") ||
      extraCode.includes("mantenimiento") ||
      extraName.includes("mantenimiento");

    const isTinaco = Boolean(modelExtra.extra?.isTinaco);

    let containerClasses = "border-gray-200 hover:border-gray-400 bg-white";
    if (isAlcalina) {
      containerClasses = isSelected
        ? "bg-gradient-to-r from-[#288EB9]/20 via-[#1DB3BA]/20 to-teal-50/80 border-[#168387] shadow-md shadow-[#168387]/15 ring-1 ring-[#168387]"
        : "bg-gradient-to-r from-[#288EB9]/10 via-[#1DB3BA]/10 to-teal-50/40 border-[#1DB3BA]/40 hover:border-[#1DB3BA] hover:shadow-md";
    } else if (isAltamenteRecomendado) {
      containerClasses = isSelected
        ? "bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-50/90 border-amber-500 shadow-md shadow-amber-500/15 ring-1 ring-amber-500"
        : "bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-50/40 border-amber-300/60 hover:border-amber-400 hover:shadow-md";
    } else if (isAviso) {
      containerClasses = isSelected
        ? "bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-50/90 border-violet-600 shadow-md shadow-violet-600/15 ring-1 ring-violet-600"
        : "bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-purple-50/40 border-violet-300/60 hover:border-violet-400 hover:shadow-md";
    } else if (isOpcional) {
      containerClasses = isSelected
        ? "bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-50/90 border-emerald-600 shadow-md shadow-emerald-500/15 ring-1 ring-emerald-600"
        : "bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-50/40 border-emerald-300/60 hover:border-emerald-400 hover:shadow-md";
    } else if (isTinaco && isSelected) {
      containerClasses = "border-[#168387] bg-teal-50/50 shadow-sm ring-1 ring-[#168387]";
    } else if (isSelected) {
      containerClasses = "border-gray-900 bg-gray-50 shadow-md";
    }

    return (
      <li
        key={modelExtra.id}
        className={`list-none relative overflow-hidden border rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-sm ${containerClasses} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => {
          if (!disabled) toggleExtra(modelExtra.id);
        }}
      >
        {/* Difuminado suave decorativo exclusivo para Agua Alcalina */}
        {isAlcalina && (
          <>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-[#288EB9]/25 to-[#1DB3BA]/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-[#1DB3BA]/20 rounded-full blur-xl pointer-events-none" />
          </>
        )}

        {/* Difuminado suave decorativo exclusivo para Altamente Recomendado (Insumos Anuales y Toma de pipa) */}
        {isAltamenteRecomendado && (
          <>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-amber-400/25 to-orange-500/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
          </>
        )}

        {/* Difuminado suave decorativo exclusivo para Aviso de Funcionamiento */}
        {isAviso && (
          <>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-violet-500/25 to-indigo-600/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />
          </>
        )}

        {/* Difuminado suave decorativo exclusivo para Opcional (Seguro y Plan de Mantenimiento) */}
        {isOpcional && (
          <>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-emerald-400/25 to-teal-500/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
          </>
        )}

        <div className="relative z-10 flex justify-between items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p
                className={`font-semibold break-words ${
                  isAlcalina || isAltamenteRecomendado || isAviso || isOpcional ? "text-[#031638] font-bold" : "text-gray-800"
                }`}
              >
                {modelExtra.extra?.name}
              </p>
              {isAlcalina && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-xs">
                  Recomendado
                </span>
              )}
              {isAltamenteRecomendado && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                  Altamente Recomendado
                </span>
              )}
              {isAviso && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs">
                  Indispensable
                </span>
              )}
              {isOpcional && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs">
                  Opcional
                </span>
              )}
            </div>
            {!isSelected && (
              <FormattedDescription text={modelExtra.extra?.description} className="mt-1" />
            )}
            <p
              className={`text-sm font-bold mt-1 ${
                isAlcalina
                  ? "text-[#168387]"
                  : isAltamenteRecomendado
                  ? "text-amber-700"
                  : isAviso
                  ? "text-violet-700"
                  : isOpcional
                  ? "text-emerald-700"
                  : "text-gray-700"
              }`}
            >
              ${(modelExtra.priceOverride ?? modelExtra.extra?.basePrice ?? 0).toLocaleString()} MXN
            </p>
          </div>
          <input
            type={isTinaco ? "radio" : "checkbox"}
            name={isTinaco ? "tinaco-selector" : undefined}
            checked={isSelected}
            readOnly
            disabled={disabled}
            className={`w-5 h-5 shrink-0 ${
              isTinaco
                ? "accent-[#168387]"
                : isAlcalina
                ? "accent-[#168387]"
                : isAltamenteRecomendado
                ? "accent-amber-600"
                : isAviso
                ? "accent-violet-600"
                : isOpcional
                ? "accent-emerald-600"
                : "accent-black"
            }`}
          />
        </div>
      </li>
    );
  };

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
          fixed top-[72px] left-0 right-0 z-40 bg-slate-50 border-b border-cyan-500/20 px-4 pt-2 pb-3 shadow-md
          lg:static lg:w-[40%] lg:sticky lg:top-24 lg:self-start lg:bg-transparent lg:border-none lg:p-0 lg:m-0 lg:shadow-none
        ">
          <div className="flex flex-col gap-2.5 max-w-7xl mx-auto">
            {/* Contenedor de Imagen única (reactiva con switch) */}
            <div className="bg-white border-2 border-[#24d4da]/30 rounded-2xl p-2 lg:p-3 shadow-sm lg:shadow-xl overflow-hidden relative">
              {/* Barra superior con switch para alternar vistas si existen ambas */}
              {Boolean(displayImageSrc && secondaryImageSrc) && (
                <div className="flex items-center justify-between gap-2 mb-2 px-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    {activeView === "primary" ? "Configuración actual" : "Vista complementaria"}
                  </span>
                  <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveView("primary")}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold rounded-md transition-all duration-200 cursor-pointer ${
                        activeView === "primary"
                          ? "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Principal
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView("secondary")}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold rounded-md transition-all duration-200 cursor-pointer ${
                        activeView === "secondary"
                          ? "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Adicional
                    </button>
                  </div>
                </div>
              )}

              <div className="h-32 sm:h-56 lg:h-auto lg:aspect-video w-full overflow-hidden rounded-xl bg-slate-50/50 flex items-center justify-center">
                <motion.img
                  key={activeView === "secondary" && secondaryImageSrc ? secondaryImageSrc : displayImageSrc}
                  initial={{ scale: 0.96, opacity: 0.85 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  src={optimizeCloudinaryUrl(
                    activeView === "secondary" && secondaryImageSrc ? secondaryImageSrc : displayImageSrc,
                    800
                  )}
                  alt={`Imagen de ${modelData.name}`}
                  className="max-h-full w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Configuración actual (solo visible si hay espacio o en desktop) */}
            <div className="hidden sm:block bg-[#168387]/5 border border-[#168387]/10 rounded-xl p-2.5">
              <p className="text-[10px] sm:text-xs font-bold text-[#168387] leading-tight">
                <span className="font-black uppercase tracking-wider block mb-1 opacity-60 text-[8px]">Modelo actual:</span>
                {currentDisplayString}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Listado de Extras: Añadimos padding-top en móvil para compensar el FIXED */}
      <div className={`
        ${hasAnyPreview ? "lg:w-[60%] pt-[200px] lg:pt-0" : "w-full max-w-3xl"} 
        flex flex-col font-montserrat not-italic
      `}>
        <div className="mb-6">
          <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-1.5 block">
            Personalización
          </span>
          <h2 className="font-montserrat not-italic text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[#031638] mb-2">
            Añade extras{" "}
            <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
              adicionales
            </span>
          </h2>
          <p className="text-slate-600 font-montserrat not-italic text-xs sm:text-sm md:text-base font-normal leading-relaxed">
            Personaliza tu unidad con componentes de alto rendimiento.
          </p>
        </div>

        {/* Los extras fluyen con el scroll normal de la página en móvil, interno en desktop */}
        <div className="space-y-2 mb-8 lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:max-h-[calc(100vh-280px)] scrollbar-thin">
          {[
            { id: "otros", title: "Adicionales", items: adicionalesExtras },
            { id: "tinacos", title: "Tinacos (Almacenamiento)", items: tinacoExtras }
          ].map((section) => {
            const isOpen = openSections.includes(section.id);
            return (
              section.items.length > 0 && (
                <div key={section.id} className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex justify-between items-center p-3 sm:p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] sm:text-xs font-black text-slate-700 uppercase tracking-[0.2em]">
                        {section.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100">
                        {section.items.length}
                      </span>
                    </div>
                    <div className={`p-1 rounded-md transition-all ${isOpen ? 'bg-[#168387] text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {isOpen && (
                    <ul className="p-2 space-y-2 border-t border-slate-50">
                      {section.items.map(renderExtraItem)}
                    </ul>
                  )}
                </div>
              )
            );
          })}
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
