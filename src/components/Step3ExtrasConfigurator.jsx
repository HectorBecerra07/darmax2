import React, { useState, useEffect, useMemo, useRef } from "react";
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
  const [drainingIndex, setDrainingIndex] = useState(null);
  const [activeView, setActiveView] = useState("primary");
  const [isInitialImageLoaded, setIsInitialImageLoaded] = useState(false);
  const [isAlcalinaZoomed, setIsAlcalinaZoomed] = useState(false);
  const prevSubStepRef = useRef(0);
  const [subStepDirection, setSubStepDirection] = useState(1);
  const drainTimerRef = useRef(null);

  useEffect(() => {
    if (currentSubStepIndex !== prevSubStepRef.current) {
      setSubStepDirection(currentSubStepIndex > prevSubStepRef.current ? 1 : -1);
      prevSubStepRef.current = currentSubStepIndex;
    }
  }, [currentSubStepIndex]);

  useEffect(() => {
    return () => {
      if (drainTimerRef.current) clearTimeout(drainTimerRef.current);
    };
  }, []);

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

  const isCleaning = useMemo(() => {
    if (!modelData) return false;
    const raw = `${modelData.slug || ""} ${modelData.name || ""}`.toLowerCase();
    return raw.includes("clean") || raw.includes("limpieza") || raw.includes("vending5") || raw.includes("vending8");
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

  const goToSubStep = (newIdx) => {
    setIsAlcalinaZoomed(false);
    if (newIdx === currentSubStepIndex || newIdx < 0 || newIdx >= subSteps.length) return;
    const prev = currentSubStepIndex;
    setSubStepDirection(newIdx > currentSubStepIndex ? 1 : -1);
    setDrainingIndex(prev);
    setCurrentSubStepIndex(newIdx);

    if (drainTimerRef.current) clearTimeout(drainTimerRef.current);
    drainTimerRef.current = setTimeout(() => {
      setDrainingIndex(null);
    }, 850);

    scrollToTopConfigurator();
  };

  const handleNextSubStep = () => {
    setIsAlcalinaZoomed(false);
    if (!isLastSubStep) {
      goToSubStep(currentSubStepIndex + 1);
    } else {
      if (!buildPayload) return;
      onSelect?.(buildPayload);
      onNext?.();
    }
  };

  const handlePrevSubStep = () => {
    setIsAlcalinaZoomed(false);
    if (currentSubStepIndex > 0) {
      goToSubStep(currentSubStepIndex - 1);
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

    const extraCode = extraSeleccionado.extra?.code?.toLowerCase() || "";
    const extraName = extraSeleccionado.extra?.name?.toLowerCase() || "";
    const isAlcalinaOption = extraCode === "agua-alcalina" || extraName.includes("alcalina");

    const esTinaco = extraSeleccionado.extra?.isTinaco;

    setSeleccionados((prev) => {
      const willBeSelected = !prev.includes(modelExtraId);

      if (isAlcalinaOption) {
        setIsAlcalinaZoomed(willBeSelected);
      }

      if (!willBeSelected) {
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
        ? "bg-[#fffbed] border-amber-300 shadow-sm ring-1 ring-amber-300/40"
        : "bg-[#fffbed]/40 border-amber-200/70 hover:bg-[#fffbed]/80 hover:border-amber-300";
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
    } else if (isTinaco) {
      containerClasses = isSelected
        ? "bg-[#effdff] border-[#168387] shadow-sm ring-1 ring-[#168387]/40"
        : "bg-[#effdff]/40 border-cyan-200/70 hover:bg-[#effdff]/80 hover:border-cyan-300";
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
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-amber-200/25 to-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
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

        {isTinaco ? (
          <div className="relative z-10 flex flex-col justify-between gap-1.5 text-left">
            {/* Fila superior: Titulo a la izquierda, Marcador a la derecha a la misma altura */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <p className="font-semibold break-words text-gray-800">
                  {modelExtra.extra?.name}
                </p>
              </div>
              <input
                type="radio"
                name="tinaco-selector"
                checked={isSelected}
                readOnly
                disabled={disabled}
                className="w-5 h-5 accent-[#168387] shrink-0 cursor-pointer"
              />
            </div>

            {/* Fila inferior: Descripcion a la izquierda, Precio a la derecha a la altura de la descripcion y mas pequeno */}
            <div className="flex items-center justify-between gap-3 mt-0.5">
              <div className="min-w-0 flex-1">
                {modelExtra.extra?.description ? (
                  <FormattedDescription
                    text={modelExtra.extra?.description}
                    className="text-xs text-slate-500 leading-relaxed"
                  />
                ) : null}
              </div>
              <p className="text-sm sm:text-[15px] font-bold text-gray-800 tracking-tight shrink-0 whitespace-nowrap">
                ${(modelExtra.priceOverride ?? modelExtra.extra?.basePrice ?? 0).toLocaleString()} MXN
              </p>
            </div>
          </div>
        ) : isAlcalina ? (
          /* Opcion Agua Alcalina con su diseno exclusivo */
          <div className="relative z-10 flex justify-between items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold break-words text-[#031638] font-bold">
                  {modelExtra.extra?.name}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100/90 text-[#8f4b10] border border-amber-300/60">
                  Recomendado
                </span>
              </div>
              {modelExtra.extra?.description && (
                <FormattedDescription text={modelExtra.extra?.description} className="mt-1.5 text-xs text-slate-500 leading-relaxed" />
              )}
              <div
                className={`w-full my-2.5 border-t ${
                  isSelected ? "border-amber-200/90" : "border-slate-200/70"
                }`}
              />
              <p className="text-base sm:text-lg font-bold tracking-tight text-[#8f4b10]">
                ${(modelExtra.priceOverride ?? modelExtra.extra?.basePrice ?? 0).toLocaleString()} MXN
              </p>
            </div>
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              disabled={disabled}
              className="w-5 h-5 shrink-0 accent-[#8f4b10]"
            />
          </div>
        ) : (
          /* Extras Adicionales: se contrae la descripcion al seleccionarse para quedar titulo, badge y precio */
          <div className="relative z-10 flex justify-between items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className={`font-semibold break-words ${
                    isAltamenteRecomendado || isAviso || isOpcional ? "text-[#031638] font-bold" : "text-gray-800"
                  }`}
                >
                  {modelExtra.extra?.name}
                </p>
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

              {/* Animacion fluida: al seleccionarse se contrae ocultando la descripcion */}
              <AnimatePresence initial={false}>
                {!isSelected && modelExtra.extra?.description && (
                  <motion.div
                    key="extra-desc"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <FormattedDescription
                      text={modelExtra.extra?.description}
                      className="mt-1.5 text-xs text-slate-500 leading-relaxed"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <p
                className={`text-sm sm:text-base font-bold mt-1 tracking-tight ${
                  isAltamenteRecomendado
                    ? "text-amber-800"
                    : isAviso
                    ? "text-violet-800"
                    : isOpcional
                    ? "text-emerald-800"
                    : "text-gray-800"
                }`}
              >
                ${(modelExtra.priceOverride ?? modelExtra.extra?.basePrice ?? 0).toLocaleString()} MXN
              </p>
            </div>
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              disabled={disabled}
              className={`w-5 h-5 shrink-0 ${
                isAltamenteRecomendado
                  ? "accent-amber-600"
                  : isAviso
                  ? "accent-violet-600"
                  : isOpcional
                  ? "accent-emerald-600"
                  : "accent-[#168387]"
              }`}
            />
          </div>
        )}
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
      {/* Panel de Vista Previa: FIXED en Móvil, STICKY en Desktop al lado izquierdo */}
      {hasAnyPreview && (
        <div className="
          fixed top-[72px] left-0 right-0 z-40 bg-slate-50 border-b border-cyan-500/20 px-4 pt-2 pb-3 shadow-md
          lg:static lg:w-[40%] lg:sticky lg:top-24 lg:self-start lg:bg-transparent lg:border-none lg:p-0 lg:m-0 lg:shadow-none
        ">
          <div className="flex flex-col gap-2 max-w-7xl mx-auto">
            {/* Contenedor de Imagen única (reactiva con switch) */}
            <div className="bg-transparent border-2 border-[#24d4da]/30 rounded-3xl p-2.5 lg:p-3.5 shadow-sm overflow-hidden relative">
              {/* Badge de Configuración de [Modelo] en la parte superior dentro del cuadro (ancho completo y rounded-full) */}
              <div className="w-full mb-2.5">
                <div className={`w-full py-2 sm:py-2 px-4 rounded-full text-white shadow-xs flex items-center justify-center text-center ${
                  isCleaning
                    ? "bg-gradient-to-r from-[#53c406] via-[#5bc809] to-[#90e119]"
                    : "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA]"
                }`}>
                  <span className="text-xs sm:text-sm font-semibold tracking-tight truncate" title={`Configuración de ${modelData?.name || ""}`}>
                    Configuración de {modelData?.name}
                  </span>
                </div>
              </div>

              <div className="h-48 sm:h-56 lg:h-auto lg:aspect-video w-full overflow-hidden rounded-2xl bg-transparent flex items-center justify-center relative">
                {/* Skeleton inicial mientras carga la imagen: carga limpia del cuadro */}
                <AnimatePresence>
                  {!isInitialImageLoaded && (
                    <motion.div
                      key="image-skeleton"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 z-20 bg-gradient-to-r from-slate-100 via-slate-200/50 to-slate-100 animate-pulse rounded-2xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeView === "secondary" && secondaryImageSrc ? secondaryImageSrc : displayImageSrc}
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                      scale: isAlcalinaZoomed ? 1.4 : 1,
                      transformOrigin: isAlcalinaZoomed ? "78% 50%" : "center center",
                    }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{
                      opacity: { duration: 0.28, ease: "easeInOut" },
                      filter: { duration: 0.28, ease: "easeInOut" },
                      scale: {
                        duration: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                        delay: isAlcalinaZoomed ? 0.15 : 0,
                      },
                      transformOrigin: { duration: 0.5 },
                    }}
                    onLoad={() => setIsInitialImageLoaded(true)}
                    src={optimizeCloudinaryUrl(
                      activeView === "secondary" && secondaryImageSrc ? secondaryImageSrc : displayImageSrc,
                      800
                    )}
                    alt={`Imagen de ${modelData.name}`}
                    className="max-h-full w-auto object-contain rounded-xl"
                    loading="lazy"
                    decoding="async"
                  />
                </AnimatePresence>
              </div>

              {/* Boton switch Principal / Adicional abajo de la imagen */}
              {Boolean(displayImageSrc && secondaryImageSrc) && (
                <div className="flex justify-center items-center mt-2 lg:mt-2.5">
                  <div className="inline-flex items-center p-0.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setActiveView("primary")}
                      className={`px-3.5 py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                        activeView === "primary"
                          ? isCleaning
                            ? "bg-gradient-to-r from-[#53c406] via-[#5bc809] to-[#90e119] text-white shadow-xs"
                            : "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Principal
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView("secondary")}
                      className={`px-3.5 py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                        activeView === "secondary"
                          ? isCleaning
                            ? "bg-gradient-to-r from-[#53c406] via-[#5bc809] to-[#90e119] text-white shadow-xs"
                            : "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Adicional
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Listado de Extras en Sub-Pasos: Ajustamos padding-top en movil para la vista previa ampliada */}
      <div className={`
        ${hasAnyPreview ? "lg:w-[60%] pt-[280px] sm:pt-[310px] lg:pt-0" : "w-full max-w-3xl"} 
        flex flex-col font-montserrat not-italic
      `}>
        <div id="extras-top-anchor" className="mb-6">
          {/* Indicador de progreso de Sub-Pasos (Efecto de agua en cada tab: vaciado y llenado fluido de abajo hacia arriba) */}
          {subSteps.length > 1 && (
            <div className="flex items-center gap-1 mb-4 p-0 bg-slate-100/90 rounded-full border-0">
              {subSteps.map((step, idx) => {
                const isActive = currentSubStepIndex === idx;
                const isDraining = drainingIndex === idx;
                const isPast = currentSubStepIndex > idx;

                let waterHeight = 0;
                let isMoving = false;

                if (isActive) {
                  waterHeight = 100;
                  if (drainingIndex !== null) isMoving = true;
                } else if (isDraining) {
                  waterHeight = 0;
                  isMoving = true;
                }

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goToSubStep(idx)}
                    className={`relative flex-1 min-w-[85px] sm:min-w-[100px] py-1.5 px-3 rounded-full text-center text-[11px] sm:text-xs font-bold transition-colors duration-200 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer z-10 border-0 bg-transparent overflow-hidden ${
                      isActive
                        ? isCleaning
                          ? "text-[#14532d] font-black"
                          : "text-[#083344] font-black"
                        : isPast
                        ? "text-slate-600 hover:text-slate-900"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {/* Contenedor de agua individual dentro del tab */}
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none -z-10 border-0">
                      {/* Columna de agua que sube de abajo hacia arriba al activarse o baja al vaciar */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${
                          isCleaning ? "bg-[#dcfce7]" : "bg-[#cff5f4]"
                        }`}
                        style={{
                          height: `${waterHeight}%`,
                          transition: isMoving
                            ? isActive
                              ? "height 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
                              : "height 0.6s cubic-bezier(0.4, 0, 0.6, 1)"
                            : "none",
                        }}
                      >
                        {/* Cresta limpia sin borde visible mientras sube o baja */}
                        {isMoving && (
                          <div
                            className={`absolute -top-2 left-0 right-0 h-4 pointer-events-none ${
                              isCleaning
                                ? "water-wave-crest-cleaning"
                                : "water-wave-crest-clean"
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    <span
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full text-[9px] sm:text-[10px] flex items-center justify-center font-black shrink-0 transition-colors shadow-2xs ${
                        isActive || isPast
                          ? isCleaning
                            ? "bg-[#15803d] text-white"
                            : "bg-[#0e7490] text-white"
                          : "bg-slate-300 text-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate">{step.navLabel}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase">
              {activeStep.badge}
            </span>
            <span className="w-8 sm:w-10 h-0.5 rounded-full shrink-0 bg-[#168387]" />
          </div>
          <h2 className="font-montserrat not-italic text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-[#031638] mb-2">
            {activeStep.titlePrefix} {activeStep.titleHighlight}
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
                        ? "bg-[#effdff] border-[#168387] shadow-sm ring-1 ring-[#168387]/40"
                        : "bg-[#effdff]/40 border-cyan-200/70 hover:bg-[#effdff]/80 hover:border-cyan-300"
                    }`}
                  >
                    <div className="relative z-10 flex flex-col justify-between gap-1.5 text-left">
                      {/* Fila superior: Titulo a la izquierda, Marcador a la derecha a la misma altura */}
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-gray-800">
                          Sin almacenamiento adicional
                        </p>
                        <input
                          type="radio"
                          name="tinaco-selector"
                          checked={!selectedTinacoExtraId}
                          readOnly
                          className="w-5 h-5 accent-[#168387] shrink-0 cursor-pointer"
                        />
                      </div>

                      {/* Fila inferior: Descripcion a la izquierda, Precio a la derecha a la altura de la descripcion y mas pequeno */}
                      <div className="flex items-center justify-between gap-3 mt-0.5">
                        <p className="text-xs text-slate-500 leading-relaxed min-w-0 flex-1">
                          Ya cuento con tinacos de almacenamiento o no requiero tinacos extras.
                        </p>
                        <p className="text-sm sm:text-[15px] font-bold text-gray-800 tracking-tight shrink-0 whitespace-nowrap">
                          $0 MXN
                        </p>
                      </div>
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
