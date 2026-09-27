import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import FormattedDescription from "../utils/formatDescription";

const API_URL = import.meta.env.VITE_API_URL;

export default function Step3ExtrasConfigurator({
  selectedModelId,
  onSelect,
  onNext,
  onBack,
  hideFooterActions = false,
  onChange,
}) {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seleccionados, setSeleccionados] = useState([]);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);
  const [activeView, setActiveView] = useState("primary");

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
    const baseText = `Configuración de ${modelData.name}`;

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

  const alcalinaExtra = useMemo(() => {
    if (!extras.length) return null;
    return extras.find((me) => {
      const code = me.extra?.code?.toLowerCase() || "";
      const name = me.extra?.name?.toLowerCase() || "";
      return code === "agua-alcalina" || name.includes("alcalina");
    });
  }, [extras]);

  const hasAlcalinaExtra = Boolean(alcalinaExtra);

  const tinacoExtras = useMemo(
    () => extras.filter((me) => me.extra?.isTinaco),
    [extras]
  );

  const adicionalesExtras = useMemo(() => {
    const items = extras.filter(
      (me) => !me.extra?.isTinaco && me.id !== alcalinaExtra?.id
    );
    return [...items].sort((a, b) => getExtraPriority(a) - getExtraPriority(b));
  }, [extras, alcalinaExtra]);

  const subSteps = useMemo(() => {
    const list = [];
    if (hasAlcalinaExtra) {
      list.push({
        id: "agua",
        badge: "Tipo de Agua",
        navLabel: "Tipo de Agua",
        titlePrefix: "Selecciona si deseas agregar",
        titleHighlight: "otro tipo de agua",
        subtitle: "",
      });
    }
    if (tinacoExtras.length > 0) {
      list.push({
        id: "almacenamiento",
        badge: "Almacenamiento",
        navLabel: "Almacenamiento",
        titlePrefix: "Selecciona tu",
        titleHighlight: "almacenamiento",
        subtitle: "Elige la capacidad de almacenamiento adecuada para tu modelo.",
      });
    }
    if (adicionalesExtras.length > 0 || list.length === 0) {
      list.push({
        id: "adicionales",
        badge: "Extras Adicionales",
        navLabel: "Adicionales",
        titlePrefix: "Añade extras",
        titleHighlight: "adicionales",
        subtitle: "Personaliza tu unidad con componentes y servicios de alto rendimiento.",
      });
    }
    return list;
  }, [hasAlcalinaExtra, tinacoExtras.length, adicionalesExtras.length]);

  useEffect(() => {
    if (currentSubStepIndex >= subSteps.length && subSteps.length > 0) {
      setCurrentSubStepIndex(0);
    }
  }, [subSteps.length, currentSubStepIndex]);

  const activeStep = subSteps[Math.min(currentSubStepIndex, Math.max(0, subSteps.length - 1))] || {
    id: "adicionales",
    badge: "Personalización",
    navLabel: "Adicionales",
    titlePrefix: "Añade extras",
    titleHighlight: "adicionales",
    subtitle: "Personaliza tu unidad con componentes de alto rendimiento.",
  };

  const isLastSubStep = currentSubStepIndex === subSteps.length - 1;

  const scrollToTopConfigurator = () => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const anchor = document.getElementById("extras-top-anchor");
      if (anchor) {
        const yOffset = -90;
        const targetY = Math.max(0, anchor.getBoundingClientRect().top + window.pageYOffset + yOffset);
        if (window.pageYOffset > targetY + 20) {
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    }
  };

  const handleNextSubStep = () => {
    if (!isLastSubStep) {
      setCurrentSubStepIndex((prev) => prev + 1);
      scrollToTopConfigurator();
    } else {
      if (!buildPayload) return;
      onSelect?.(buildPayload);
      onNext?.();
    }
  };

  const handlePrevSubStep = () => {
    if (currentSubStepIndex > 0) {
      setCurrentSubStepIndex((prev) => prev - 1);
      scrollToTopConfigurator();
    } else {
      onBack?.();
    }
  };

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

  // Notificar al componente padre en vivo cuando cambie la seleccion
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

    let containerClasses = "border-gray-200 hover:border-gray-300 bg-white";
    if (isAlcalina) {
      containerClasses = isSelected
        ? "bg-gradient-to-r from-[#288EB9]/15 via-[#1DB3BA]/10 to-teal-50/60 border-[#168387] shadow-sm ring-1 ring-[#168387]/30"
        : "bg-gradient-to-r from-[#288EB9]/[0.04] via-[#1DB3BA]/[0.02] to-white border-[#1DB3BA]/30 hover:border-[#1DB3BA]/60 hover:bg-[#1DB3BA]/[0.04]";
    } else if (isAltamenteRecomendado) {
      containerClasses = isSelected
        ? "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-50/50 border-amber-400 shadow-sm ring-1 ring-amber-400/30"
        : "bg-gradient-to-r from-amber-500/[0.04] via-orange-500/[0.02] to-white border-amber-200/70 hover:border-amber-300 hover:bg-amber-500/[0.04]";
    } else if (isAviso) {
      containerClasses = isSelected
        ? "bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-purple-50/50 border-violet-400 shadow-sm ring-1 ring-violet-400/30"
        : "bg-gradient-to-r from-violet-600/[0.04] via-indigo-600/[0.02] to-white border-violet-200/70 hover:border-violet-300 hover:bg-violet-600/[0.04]";
    } else if (isOpcional) {
      containerClasses = isSelected
        ? "bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-50/50 border-emerald-400 shadow-sm ring-1 ring-emerald-400/30"
        : "bg-gradient-to-r from-emerald-500/[0.04] via-teal-500/[0.02] to-white border-emerald-200/70 hover:border-emerald-300 hover:bg-emerald-500/[0.04]";
    } else if (isTinaco && isSelected) {
      containerClasses = "border-[#168387] bg-gradient-to-r from-[#168387]/15 via-teal-500/10 to-teal-50/50 shadow-sm ring-1 ring-[#168387]/30";
    } else if (isSelected) {
      containerClasses = "border-[#168387] bg-gradient-to-r from-[#168387]/15 via-[#24d4da]/10 to-teal-50/50 shadow-sm ring-1 ring-[#168387]/30";
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
        {/* Difuminado suave decorativo exclusivo (solo sutil en selección) */}
        {isAlcalina && isSelected && (
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-[#288EB9]/15 to-[#1DB3BA]/15 rounded-full blur-2xl pointer-events-none" />
        )}

        {isAltamenteRecomendado && isSelected && (
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-amber-400/15 to-orange-500/15 rounded-full blur-2xl pointer-events-none" />
        )}

        {isAviso && isSelected && (
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-violet-500/15 to-indigo-600/15 rounded-full blur-2xl pointer-events-none" />
        )}

        {isOpcional && isSelected && (
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-emerald-400/15 to-teal-500/15 rounded-full blur-2xl pointer-events-none" />
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
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#288EB9]/15 to-[#1DB3BA]/20 text-[#168387] border border-[#168387]/30">
                  Recomendado
                </span>
              )}
              {isAltamenteRecomendado && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/20 text-amber-800 border border-amber-400/30">
                  Altamente Recomendado
                </span>
              )}
              {isAviso && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600/15 to-indigo-600/20 text-violet-800 border border-violet-400/30">
                  Indispensable
                </span>
              )}
              {isOpcional && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600/15 to-teal-600/20 text-emerald-800 border border-emerald-400/30">
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
                  ? "text-amber-800"
                  : isAviso
                  ? "text-violet-800"
                  : isOpcional
                  ? "text-emerald-800"
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
                : "accent-[#168387]"
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
    <div className={`w-full pb-24 sm:pb-24 lg:pb-24 ${hasAnyPreview ? "lg:flex lg:items-start lg:gap-12" : "flex justify-center"}`}>
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

      {/* Listado de Extras en Sub-Pasos: Añadimos padding-top en móvil para compensar el FIXED */}
      <div className={`
        ${hasAnyPreview ? "lg:w-[60%] pt-[200px] lg:pt-0" : "w-full max-w-3xl"} 
        flex flex-col font-montserrat not-italic
      `}>
        <div id="extras-top-anchor" className="mb-6">
          {/* Indicador de progreso de Sub-Pasos (Stepper / Tabs interactivos) */}
          {subSteps.length > 1 && (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-4 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto no-scrollbar">
              {subSteps.map((step, idx) => {
                const isActive = currentSubStepIndex === idx;
                const isPast = currentSubStepIndex > idx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setCurrentSubStepIndex(idx);
                      scrollToTopConfigurator();
                    }}
                    className={`flex-1 min-w-[105px] py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl text-center text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-white text-[#168387] shadow-sm font-extrabold ring-1 ring-slate-200"
                        : isPast
                        ? "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black shrink-0 ${
                      isActive
                        ? "bg-[#168387] text-white"
                        : isPast
                        ? "bg-slate-200 text-slate-700"
                        : "bg-slate-200/60 text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="truncate">{step.navLabel}</span>
                  </button>
                );
              })}
            </div>
          )}

          <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-1.5 block">
            {activeStep.badge}
          </span>
          <h2 className="font-montserrat not-italic text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[#031638] mb-2">
            {activeStep.titlePrefix}{" "}
            <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
              {activeStep.titleHighlight}
            </span>
          </h2>
          {activeStep.subtitle ? (
            <p className="text-slate-600 font-montserrat not-italic text-xs sm:text-sm md:text-base font-normal leading-relaxed">
              {activeStep.subtitle}
            </p>
          ) : null}
        </div>

        {/* Contenido dinámico del Sub-Paso actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 mb-4 lg:flex-1"
          >
            {/* FASE A: AGUA ALCALINA (si está presente en el modelo) */}
            {activeStep.id === "agua" && alcalinaExtra && (
              <div className="space-y-2">
                <ul className="space-y-2.5">
                  {renderExtraItem(alcalinaExtra)}
                </ul>

                <div className="pt-0.5 text-center sm:text-left">
                  <p className="text-xs text-slate-500 font-medium">
                    {hasAguaAlcalina
                      ? "Has añadido agua alcalina a tu equipo."
                      : "Si deseas, puedes avanzar sin añadir esta opción."}
                  </p>
                </div>
              </div>
            )}

            {/* FASE B: ALMACENAMIENTO (TINACOS) */}
            {activeStep.id === "almacenamiento" && (
              <div className="space-y-4">
                <ul className="space-y-2.5">
                  {/* Opcion de sin almacenamiento adicional */}
                  <li
                    onClick={() => {
                      setSeleccionados((prev) => {
                        return prev.filter((id) => {
                          const item = extras.find((me) => me.id === id);
                          return !item?.extra?.isTinaco;
                        });
                      });
                    }}
                    className={`list-none relative overflow-hidden border rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-sm text-left ${
                      !selectedTinacoExtraId
                        ? "border-[#168387] bg-gradient-to-r from-[#168387]/15 via-teal-500/10 to-teal-50/50 shadow-sm ring-1 ring-[#168387]/30"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800">
                          Sin almacenamiento adicional
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Ya cuento con tinacos de almacenamiento o no requiero tinacos extras.
                        </p>
                        <p className="text-sm font-bold text-gray-700 mt-1">
                          $0 MXN
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="tinaco-selector"
                        checked={!selectedTinacoExtraId}
                        readOnly
                        className="w-5 h-5 accent-[#168387] shrink-0"
                      />
                    </div>
                  </li>

                  {/* Lista de tinacos disponibles */}
                  {tinacoExtras.map(renderExtraItem)}
                </ul>
              </div>
            )}

            {/* FASE C: EXTRAS ADICIONALES */}
            {activeStep.id === "adicionales" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium text-left">
                  Selecciona los componentes, insumos o servicios que deseas sumar a tu configuración:
                </p>
                <ul className="space-y-2.5">
                  {adicionalesExtras.map(renderExtraItem)}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Soporte para BundleWizard cuando hideFooterActions es true */}
        {hideFooterActions && subSteps.length > 1 && (
          <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrevSubStep}
              disabled={currentSubStepIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Paso anterior
            </button>
            <button
              type="button"
              onClick={handleNextSubStep}
              disabled={isLastSubStep}
              className="px-5 py-2 rounded-xl bg-[#168387] text-white text-xs font-bold hover:bg-[#24d4da] transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLastSubStep ? "Adicionales listos" : `Continuar a ${subSteps[currentSubStepIndex + 1]?.navLabel}`}
            </button>
          </div>
        )}

        {/* Barra de Acciones Fija Inferior (App-like bar fija en móvil y escritorio) */}
        {!hideFooterActions && (
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] py-3 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
              {/* Información rápida de la configuración actual (visible en tablets y escritorio) */}
              <div className="hidden sm:flex items-center gap-2.5 min-w-0 flex-1 pr-4">
                <span className="w-2 h-2 rounded-full bg-[#168387] shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none mb-0.5">
                    Tu configuración en curso:
                  </span>
                  <p className="text-xs font-bold text-slate-800 truncate leading-snug">
                    {currentDisplayString}
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={handlePrevSubStep}
                  className="flex-1 sm:flex-none sm:min-w-[120px] px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition cursor-pointer text-center"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNextSubStep}
                  className="flex-[2] sm:flex-none sm:min-w-[220px] px-6 py-3 rounded-xl bg-[#168387] hover:bg-[#24d4da] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-cyan-900/15 cursor-pointer text-center"
                >
                  {isLastSubStep
                    ? "Confirmar Selección"
                    : `Continuar a ${subSteps[currentSubStepIndex + 1]?.navLabel || "Siguiente"}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
