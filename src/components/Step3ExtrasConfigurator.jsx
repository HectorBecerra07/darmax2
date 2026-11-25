import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import FormattedDescription from "../utils/formatDescription";

const API_URL = import.meta.env.VITE_API_URL;

/** Precarga y decodifica una imagen en memoria manteniendo referencia activa. */
function loadImageWithDecode(url, onReady, onError, cacheMap = null) {
  const existing = cacheMap?.get(url);
  if (existing && existing.complete && existing.naturalWidth > 0) {
    onReady();
    return;
  }
  const img = new Image();
  img.decoding = "async";
  if (cacheMap) cacheMap.set(url, img);
  img.src = url;
  const finish = () => {
    if (typeof img.decode === "function") {
      img.decode().then(onReady).catch(onReady);
    } else {
      onReady();
    }
  };
  if (img.complete && img.naturalWidth > 0) {
    finish();
  } else {
    img.onload = finish;
    if (onError) img.onerror = onError;
  }
}

/** Devuelve escala, origen y altura máxima según la vista de imagen. */
function getImagePresentation(view, alcalinaZoomed, hasSecondary, isCleaning = false) {
  const isFrontCutout = (view === "secondary" && hasSecondary) || isCleaning;
  return {
    scale: alcalinaZoomed ? 1.38 : isFrontCutout ? 1 : 1.14,
    transformOrigin: alcalinaZoomed
      ? "78% 50%"
      : isFrontCutout
      ? "center center"
      : "70% 90%",
    heightClass: isFrontCutout
      ? "max-h-[200px] sm:max-h-[230px] lg:max-h-[380px]"
      : "max-h-[210px] sm:max-h-[250px] lg:max-h-[480px]",
  };
}

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
  const [expandedSelectedIds, setExpandedSelectedIds] = useState([]);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);
  const [activeView, setActiveView] = useState("primary");
  const [committedPrimaryUrl, setCommittedPrimaryUrl] = useState(null);
  const [committedSecondaryUrl, setCommittedSecondaryUrl] = useState(null);
  const [previousPrimary, setPreviousPrimary] = useState(null);
  const [magicSweepKey, setMagicSweepKey] = useState(0);
  const [showSlowLoading, setShowSlowLoading] = useState(false);
  const [isAlcalinaZoomed, setIsAlcalinaZoomed] = useState(false);
  const preloadedImagesRef = useRef(new Map());
  const readyUrlsRef = useRef(new Set());
  const committedPrimaryRef = useRef(null);
  const clearPrevTimerRef = useRef(null);
  const prevPrimarySrcRef = useRef(null);

  useEffect(() => {
    return () => {
      if (clearPrevTimerRef.current) clearTimeout(clearPrevTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchModelDetails = async () => {
      if (!selectedModelId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      if (clearPrevTimerRef.current) clearTimeout(clearPrevTimerRef.current);
      committedPrimaryRef.current = null;
      prevPrimarySrcRef.current = null;
      setCommittedPrimaryUrl(null);
      setCommittedSecondaryUrl(null);
      setPreviousPrimary(null);
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
        setExpandedSelectedIds([]);
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

    if (isMostrador) {
       if (selectedTinacoExtraId && hasAguaAlcalina) {
            image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, true);
            if (!image) image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, false);
            if (image) return image;
       }
       if (hasAguaAlcalina) {
         image = getRelevantImage("MODEL_BASE_ALCALINA", true, null, true);
         if (image) return image;
       }
       if (selectedTinacoExtraId) {
         image = getRelevantImage("TINACO", true, selectedTinacoExtraId, false);
         if (image) return image;
       }
       image = getRelevantImage("MODEL_BASE", true, null, false);
       if (image) return image;

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

    if (selectedTinacoExtraId) {
      if (hasAguaAlcalina) {
        image = getRelevantImage("TINACO_ALCALINA", true, selectedTinacoExtraId, true);
        if (!image) {
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

    const baseImage = getRelevantImage("MODEL_BASE", true, null, false);
    if (baseImage) return baseImage;

    // Respaldo para modelos (como Darmax Clean) que solo tengan SECONDARY o CAROUSEL
    const secondaryFallback = getRelevantImage("SECONDARY", true, null, false, true);
    if (secondaryFallback) return secondaryFallback;

    const carouselFallback = modelData.images?.find((img) => img.context === "CAROUSEL" && img.url);
    if (carouselFallback) return carouselFallback.url;

    const anyImg = modelData.images?.find((img) => img.url);
    return anyImg ? anyImg.url : null;
  }, [modelData, selectedTinacoExtraId, hasAguaAlcalina, getRelevantImage, isMostrador]);

  const secondaryImageSrc = useMemo(() => {
    if (!modelData) return null;
    let image = null;

    if (hasAguaAlcalina) {
      image = getRelevantImage("SECONDARY_ALCALINA", true, null, true, true);
      if (!image) {
        image = getRelevantImage("SECONDARY_ALCALINA", true, null, false, true);
      }
      if (image) {
        if (image === displayImageSrc) return null;
        return image;
      }
    }

    image = getRelevantImage("SECONDARY", true, null, hasAguaAlcalina, true);
    if (!image && hasAguaAlcalina) {
      image = getRelevantImage("SECONDARY", true, null, false, true);
    }

    if (image === displayImageSrc) return null;

    return image;
  }, [modelData, hasAguaAlcalina, getRelevantImage, displayImageSrc]);

  useEffect(() => {
    setActiveView("primary");
  }, [displayImageSrc]);

  const primaryTargetUrl = displayImageSrc ? optimizeCloudinaryUrl(displayImageSrc, 800) : null;
  const secondaryTargetUrl = secondaryImageSrc ? optimizeCloudinaryUrl(secondaryImageSrc, 800) : null;

  // Precargar y retener todas las variantes de imagen del modelo para cambios instantáneos en móvil
  useEffect(() => {
    if (!modelData?.images?.length) return;
    const urls = [
      displayImageSrc,
      secondaryImageSrc,
      ...modelData.images.map((img) => img.url),
    ]
      .filter(Boolean)
      .map((url) => optimizeCloudinaryUrl(url, 800));

    const uniqueUrls = [...new Set(urls)];
    uniqueUrls.forEach((url) => {
      if (readyUrlsRef.current.has(url)) return;
      loadImageWithDecode(
        url,
        () => {
          readyUrlsRef.current.add(url);
        },
        null,
        preloadedImagesRef.current
      );
    });
  }, [modelData, displayImageSrc, secondaryImageSrc]);

  // Cargar y confirmar la imagen principal sin parpadeo ni descarga repetida
  useEffect(() => {
    if (!primaryTargetUrl) return;
    let cancelled = false;

    const commitPrimary = () => {
      if (cancelled) return;
      readyUrlsRef.current.add(primaryTargetUrl);
      const current = committedPrimaryRef.current;

      if (current && current !== primaryTargetUrl) {
        setPreviousPrimary({
          url: current,
          alcalinaZoomed: isAlcalinaZoomed,
        });
        if (clearPrevTimerRef.current) clearTimeout(clearPrevTimerRef.current);
        clearPrevTimerRef.current = setTimeout(() => {
          setPreviousPrimary(null);
        }, 420);
      }

      committedPrimaryRef.current = primaryTargetUrl;
      setCommittedPrimaryUrl(primaryTargetUrl);
    };

    if (readyUrlsRef.current.has(primaryTargetUrl)) {
      commitPrimary();
      return;
    }

    loadImageWithDecode(primaryTargetUrl, commitPrimary, commitPrimary, preloadedImagesRef.current);

    return () => {
      cancelled = true;
    };
  }, [primaryTargetUrl]);

  // Cargar y mantener montada en DOM la imagen adicional para alternar al instante
  useEffect(() => {
    if (!secondaryTargetUrl) {
      setCommittedSecondaryUrl(null);
      return;
    }
    let cancelled = false;

    const commitSecondary = () => {
      if (cancelled) return;
      readyUrlsRef.current.add(secondaryTargetUrl);
      setCommittedSecondaryUrl(secondaryTargetUrl);
    };

    if (readyUrlsRef.current.has(secondaryTargetUrl)) {
      commitSecondary();
      return;
    }

    loadImageWithDecode(secondaryTargetUrl, commitSecondary, commitSecondary, preloadedImagesRef.current);

    return () => {
      cancelled = true;
    };
  }, [secondaryTargetUrl]);

  // Disparar barrido sutil de luz solo cuando cambia la configuración en la vista principal
  useEffect(() => {
    if (!displayImageSrc) return;
    if (prevPrimarySrcRef.current && prevPrimarySrcRef.current !== displayImageSrc) {
      setMagicSweepKey((k) => k + 1);
    }
    prevPrimarySrcRef.current = displayImageSrc;
  }, [displayImageSrc]);

  useEffect(() => {
    if (committedPrimaryRef.current && activeView === "primary") {
      setMagicSweepKey((k) => k + 1);
    }
  }, [isAlcalinaZoomed]);

  const isTargetLoading =
    (activeView === "primary" && Boolean(primaryTargetUrl) && committedPrimaryUrl !== primaryTargetUrl) ||
    (activeView === "secondary" && Boolean(secondaryTargetUrl) && committedSecondaryUrl !== secondaryTargetUrl);

  const hasVisibleImage = Boolean(committedPrimaryUrl || committedSecondaryUrl);

  // Mostrar indicador sutil solo si el cambio tarda más de 180ms
  useEffect(() => {
    if (!isTargetLoading || !hasVisibleImage) {
      setShowSlowLoading(false);
      return;
    }
    const timer = setTimeout(() => setShowSlowLoading(true), 180);
    return () => clearTimeout(timer);
  }, [isTargetLoading, hasVisibleImage]);

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

    // 1. Indispensable (Aviso de funcionamiento)
    if (
      extraCode.includes("aviso") ||
      extraCode.includes("funcionamiento") ||
      extraName.includes("aviso") ||
      extraName.includes("funcionamiento")
    ) {
      return 1;
    }

    // 2. Altamente Recomendado: Toma de pipa
    if (extraCode.includes("pipa") || extraName.includes("pipa")) {
      return 2;
    }

    // 3. Altamente Recomendado: Kit de insumo anual
    if (extraCode.includes("insumo") || extraName.includes("insumo")) {
      return 3;
    }

    // 4. Altamente Recomendado: Automatización de ósmosis
    if (extraCode.includes("automat") || extraName.includes("automat")) {
      return 4;
    }

    // 5. Opcional: Plan de mantenimiento
    if (extraCode.includes("mantenimiento") || extraName.includes("mantenimiento")) {
      return 5;
    }

    // 6. Opcional: Seguro de vending
    if (extraCode.includes("seguro") || extraName.includes("seguro")) {
      return 6;
    }

    return 7;
  };

  const getBadgeInfo = (modelExtra) => {
    const code = (modelExtra.extra?.code || "").toLowerCase();
    const name = (modelExtra.extra?.name || "").toLowerCase();

    if (
      code.includes("aviso") ||
      name.includes("aviso") ||
      code.includes("funcionamiento") ||
      name.includes("funcionamiento")
    ) {
      return {
        text: "INDISPENSABLE",
        badgeClasses: "bg-[#ffbbbb] text-[#972640]",
        cardClasses: "bg-[#fffafa] border-[#ffbbbb]/70 hover:border-[#f59e9e] shadow-2xs",
        selectedCardClasses: "bg-[#fffafa] border-[#e88c8c] ring-1 ring-[#ffbbbb]/50 shadow-xs",
      };
    }
    if (
      code.includes("pipa") ||
      name.includes("pipa") ||
      code.includes("insumo") ||
      name.includes("insumo") ||
      code.includes("automat") ||
      name.includes("automat")
    ) {
      return {
        text: "ALTAMENTE RECOMENDADO",
        badgeClasses: "bg-[#9aedeb] text-[#19715b]",
        cardClasses: "bg-[#effdff] border-[#ccf7fd] hover:border-[#9aedeb] shadow-2xs",
        selectedCardClasses: "bg-[#effdff] border-[#00949f]/70 ring-1 ring-[#00949f]/20 shadow-xs",
      };
    }
    return {
      text: "OPCIONAL",
      badgeClasses: "bg-[#c5d7fc] text-[#662797]",
      cardClasses: "bg-[#f5f8ff] border-[#dbe6fe] hover:border-[#c5d7fc] shadow-2xs",
      selectedCardClasses: "bg-[#f5f8ff] border-[#00949f]/70 ring-1 ring-[#00949f]/20 shadow-xs",
    };
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
        badge: "TIPO DE AGUA",
        navLabel: "Tipo de agua",
        titlePrefix: "Selecciona si deseas agregar",
        titleHighlight: "otro tipo de agua",
        subtitle: "",
      });
    }
    if (tinacoExtras.length > 0) {
      list.push({
        id: "almacenamiento",
        badge: "ALMACENAMIENTO",
        navLabel: "Almacenamiento",
        titlePrefix: "Selecciona tu",
        titleHighlight: "almacenamiento",
        subtitle: "Elige la capacidad de almacenamiento adecuada para tu modelo.",
      });
    }
    if (adicionalesExtras.length > 0 || list.length === 0) {
      list.push({
        id: "adicionales",
        badge: "EXTRAS ADICIONALES",
        navLabel: "Adicionales",
        titlePrefix: "Personaliza tu",
        titleHighlight: "unidad",
        subtitle: "Selecciona los componentes, insumos o servicios que deseas sumar a tu configuración:",
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
    badge: "EXTRAS ADICIONALES",
    navLabel: "Adicionales",
    titlePrefix: "Personaliza tu",
    titleHighlight: "unidad",
    subtitle: "Selecciona los componentes, insumos o servicios que deseas sumar a tu configuración:",
  };

  const isLastSubStep = currentSubStepIndex === subSteps.length - 1;

  const scrollToTopConfigurator = () => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const anchor = document.getElementById("extras-top-anchor");
    if (anchor) {
      const yOffset = -90;
      const targetY = Math.max(0, anchor.getBoundingClientRect().top + window.pageYOffset + yOffset);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const goToSubStep = (newIdx) => {
    setIsAlcalinaZoomed(false);
    if (newIdx === currentSubStepIndex || newIdx < 0 || newIdx >= subSteps.length) return;
    setCurrentSubStepIndex(newIdx);
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
        setExpandedSelectedIds((ids) => ids.filter((id) => id !== modelExtraId));
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

  const toggleSelectedDescription = (e, modelExtraId) => {
    e.stopPropagation();
    setExpandedSelectedIds((prev) =>
      prev.includes(modelExtraId)
        ? prev.filter((id) => id !== modelExtraId)
        : [...prev, modelExtraId]
    );
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

  useEffect(() => {
    if (onChange && buildPayload) onChange(buildPayload);
  }, [onChange, buildPayload]);

  if (loading || !modelData) {
    return (
      <div className="text-center p-8 text-lg text-gray-700">
        Cargando opciones de configuración...
      </div>
    );
  }

  const hasAnyPreview = Boolean(displayImageSrc || secondaryImageSrc);

  return (
    <div className={`w-full max-w-full overflow-x-clip pb-24 sm:pb-24 lg:pb-24 ${hasAnyPreview ? "lg:flex lg:items-start lg:gap-12" : "flex justify-center"}`}>
      {/* Panel de Vista Previa: FIXED sin bordes en Móvil/Tablet (modo app) y STICKY con marco en Desktop */}
      {hasAnyPreview && (
        <div className="
          fixed top-[72px] inset-x-0 z-30 w-full max-w-full bg-white border-b border-slate-200/80 shadow-md
          lg:static lg:w-[42%] lg:sticky lg:top-24 lg:self-start lg:mb-0 lg:bg-transparent lg:border-none lg:shadow-none
        ">
          <div className="flex flex-col lg:gap-2 w-full">
            {/* Chip/Badge superior en Desktop: • Configuración actual */}
            <div className="hidden lg:flex items-center text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-[#00949f] border border-[#ccf7fd] bg-[#effdff] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00949f]" />
                Configuración actual
              </span>
            </div>

            {/* Tarjeta única unificada (sin bordes ni redondeo en móvil; marco redondeado en desktop) */}
            <div className="border-0 rounded-none p-0 bg-white overflow-hidden flex flex-col lg:border-2 lg:border-slate-200/90 lg:rounded-[36px] lg:shadow-sm lg:bg-gradient-to-b lg:from-white lg:via-white lg:to-[#f1f5f9] lg:pt-1.5 lg:px-1.5">
              {/* Área de la Imagen adaptada como marco en desktop y cuadrado completo en móvil */}
              <div
                className={`relative w-full overflow-hidden rounded-none lg:rounded-[28px] flex items-center justify-center ${
                  !hasVisibleImage ? "min-h-[190px] sm:min-h-[220px] lg:min-h-[280px]" : ""
                }`}
              >
                {/* Chip compacto flotante en móvil */}
                <span className="lg:hidden absolute top-2.5 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#00949f] border border-[#ccf7fd] bg-[#effdff]/95 backdrop-blur-sm shadow-2xs pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00949f]" />
                  Configuración actual
                </span>

                <AnimatePresence>
                  {!hasVisibleImage && (
                    <motion.div
                      key="image-skeleton"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 z-20 bg-gradient-to-r from-slate-100 via-slate-200/50 to-slate-100 animate-pulse pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showSlowLoading && (
                    <motion.div
                      key="image-loading-badge"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-2.5 right-3 lg:top-3 lg:left-3 lg:right-auto z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/60 shadow-xs text-[11px] font-semibold text-slate-600 pointer-events-none"
                    >
                      <span className="w-3 h-3 rounded-full border-2 border-[#00949f] border-t-transparent animate-spin" />
                      Cargando vista...
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasVisibleImage && (() => {
                  const showingSecondary =
                    activeView === "secondary" && Boolean(committedSecondaryUrl);
                  const primaryPres = getImagePresentation(
                    "primary",
                    isAlcalinaZoomed,
                    Boolean(secondaryImageSrc),
                    isCleaning
                  );
                  const secondaryPres = getImagePresentation(
                    "secondary",
                    false,
                    Boolean(secondaryImageSrc),
                    isCleaning
                  );
                  const prevPres = previousPrimary
                    ? getImagePresentation(
                        "primary",
                        previousPrimary.alcalinaZoomed,
                        Boolean(secondaryImageSrc),
                        isCleaning
                      )
                    : null;

                  return (
                    <>
                      {/* Imagen principal anterior como respaldo para evitar destello blanco al cambiar extras */}
                      {!showingSecondary && previousPrimary && prevPres && (
                        <motion.img
                          key={`prev-${previousPrimary.url}`}
                          initial={{ opacity: 1, scale: prevPres.scale }}
                          animate={{ opacity: 1, scale: prevPres.scale }}
                          src={previousPrimary.url}
                          alt=""
                          aria-hidden="true"
                          style={{ transformOrigin: prevPres.transformOrigin }}
                          className={`absolute inset-0 w-full h-full object-contain pointer-events-none z-0 ${prevPres.heightClass}`}
                        />
                      )}

                      {/* Capa Principal: permanece montada en DOM para no volver a decodificar en móvil */}
                      {committedPrimaryUrl && (
                        <motion.img
                          key={committedPrimaryUrl}
                          initial={
                            previousPrimary
                              ? { opacity: 0, scale: primaryPres.scale * 1.015 }
                              : false
                          }
                          animate={{
                            opacity: showingSecondary ? 0 : 1,
                            scale: primaryPres.scale,
                          }}
                          transition={{
                            opacity: {
                              duration: showingSecondary ? 0.2 : 0.24,
                              delay: showingSecondary ? 0.05 : 0,
                              ease: "easeOut",
                            },
                            scale: {
                              duration: 0.42,
                              ease: [0.16, 1, 0.3, 1],
                              delay: isAlcalinaZoomed ? 0.06 : 0,
                            },
                          }}
                          style={{
                            transformOrigin: primaryPres.transformOrigin,
                            transition: "transform-origin 0.4s ease",
                          }}
                          src={committedPrimaryUrl}
                          alt={`Imagen de ${modelData.name}`}
                          className={`${
                            showingSecondary
                              ? "absolute inset-0 m-auto z-0 pointer-events-none"
                              : "relative z-10"
                          } w-full h-auto object-contain block ${primaryPres.heightClass}`}
                          loading="eager"
                          decoding="async"
                        />
                      )}

                      {/* Capa Adicional: permanece montada en DOM para alternar al instante sin recargar */}
                      {committedSecondaryUrl && (
                        <motion.img
                          key={committedSecondaryUrl}
                          initial={false}
                          animate={{
                            opacity: showingSecondary ? 1 : 0,
                            scale: secondaryPres.scale,
                          }}
                          transition={{
                            opacity: { duration: 0.22, ease: "easeOut" },
                          }}
                          style={{ transformOrigin: secondaryPres.transformOrigin }}
                          src={committedSecondaryUrl}
                          alt={`Vista adicional de ${modelData.name}`}
                          className={`${
                            showingSecondary
                              ? "relative z-10"
                              : "absolute inset-0 m-auto z-0 pointer-events-none"
                          } w-full h-auto object-contain block ${secondaryPres.heightClass}`}
                          loading="eager"
                          decoding="async"
                        />
                      )}

                      {/* Barrido diagonal sutil de luz al actualizar extras en la escena */}
                      {magicSweepKey > 0 && !showingSecondary && (
                        <motion.div
                          key={`sweep-${magicSweepKey}`}
                          initial={{ x: "-120%", opacity: 0.65 }}
                          animate={{ x: "140%", opacity: 0 }}
                          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 w-1/2 z-[15] pointer-events-none bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12"
                        />
                      )}
                    </>
                  );
                })()}

                {/* Botón switch Principal / Adicional flotante en la esquina inferior derecha */}
                {Boolean(displayImageSrc && secondaryImageSrc) && (
                  <div className="absolute bottom-3 right-3 z-20">
                    <div className="inline-flex items-center p-0 bg-white/70 backdrop-blur-md rounded-full border border-slate-200/40 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveView("primary")}
                        className={`px-3 py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
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
                        className={`px-3 py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
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

              {/* Pie compacto en móvil / cómodo en desktop dentro del mismo contenedor */}
              <div className="flex items-center gap-2.5 lg:gap-3 py-2 px-4 bg-slate-50/90 border-t border-slate-100 lg:bg-transparent lg:border-t-0 lg:pt-3.5 lg:pb-4 lg:px-5">
                <span className="w-0.5 h-7 lg:h-9 rounded-full bg-[#00949f] shrink-0" />
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[10px] lg:text-xs text-slate-400 font-medium leading-none">
                    Modelo seleccionado
                  </span>
                  <h3 className="text-sm lg:text-lg font-extrabold text-slate-900 tracking-tight truncate mt-0.5 lg:mt-1 leading-tight">
                    {modelData?.name}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listado de Extras en Sub-Pasos (Columna derecha, con margen superior en móvil para la vista fija) */}
      <div className={`
        w-full min-w-0
        ${hasAnyPreview ? "lg:w-[58%] pt-[262px] sm:pt-[304px] lg:pt-0" : "max-w-3xl"} 
        flex flex-col font-montserrat not-italic
      `}>
        <div id="extras-top-anchor" className="mb-6 w-full min-w-0">
          {/* Indicador de progreso de Sub-Pasos (Tabs superiores estilo píldora como en PDF) */}
          {subSteps.length > 1 && (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-6 p-0 bg-transparent w-full min-w-0">
              {subSteps.map((step, idx) => {
                const isActive = currentSubStepIndex === idx;
                const isPast = currentSubStepIndex > idx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goToSubStep(idx)}
                    className={`flex-1 min-w-0 py-1.5 sm:py-2 px-2 sm:px-4 rounded-full text-center text-[11px] sm:text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
                      isActive
                        ? "bg-[#cff5f4] text-[#083344] shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[10px] sm:text-[11px] flex items-center justify-center font-black shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#00949f] text-white shadow-xs"
                          : isPast
                          ? "bg-slate-300 text-slate-700"
                          : "bg-slate-200 text-slate-500"
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

          {/* Encabezado del Sub-Paso actual */}
          <div className="text-left mb-5">
            <span className="font-montserrat not-italic text-[#00949f] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-xs sm:text-sm uppercase block mb-1.5">
              {activeStep.badge}
            </span>
            <h2 className="font-montserrat not-italic text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-[#031638] mb-2">
              {activeStep.titlePrefix} {activeStep.titleHighlight}
            </h2>
            {activeStep.subtitle ? (
              <p className="text-slate-600 font-montserrat not-italic text-xs sm:text-sm md:text-base font-normal leading-relaxed">
                {activeStep.subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {/* Contenido dinámico del Sub-Paso actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 mb-4 lg:flex-1 text-left"
          >
            {/* SUB-PASO 1: TIPO DE AGUA (AGUA ALCALINA) */}
            {activeStep.id === "agua" && alcalinaExtra && (
              <div className="space-y-3">
                <div
                  onClick={() => toggleExtra(alcalinaExtra.id)}
                  className="list-none relative overflow-hidden border border-[#ffda71] rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 shadow-xs bg-[#fff8e9] text-left"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      {/* Badge GENERA MÁS INGRESOS */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#ffda71]/55 text-[#2a8e11] shadow-2xs">
                          GENERA MÁS INGRESOS
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
                        {alcalinaExtra.extra?.name}
                      </h3>

                      {alcalinaExtra.extra?.description && (
                        <FormattedDescription
                          text={alcalinaExtra.extra?.description}
                          className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal"
                        />
                      )}

                      <p
                        className="text-xl sm:text-2xl font-semibold tracking-tight mt-3"
                        style={{ color: "#2a8e11" }}
                      >
                        ${(alcalinaExtra.priceOverride ?? alcalinaExtra.extra?.basePrice ?? 0).toLocaleString()} MXN
                      </p>
                    </div>

                    {/* Checkbox toggle en la esquina superior derecha */}
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-1 ${
                        hasAguaAlcalina
                          ? "bg-[#2a8e11] border-[#2a8e11] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {hasAguaAlcalina && (
                        <svg className="w-4 h-4 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-left">
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Si lo deseas puedes avanzar sin añadir esta opción.
                  </p>
                </div>
              </div>
            )}

            {/* SUB-PASO 2: ALMACENAMIENTO (TINACOS) */}
            {activeStep.id === "almacenamiento" && (
              <div className="space-y-3">
                <ul className="space-y-3">
                  {[
                    {
                      key: "no-tinaco",
                      title: "Sin almacenamiento adicional",
                      description:
                        "Ya cuento con tinacos de almacenamiento o no quiero tinacos extras.",
                      priceText: "$0.00 MXN",
                      isSelected: !selectedTinacoExtraId,
                      onSelectOption: () => {
                        setSeleccionados((prev) =>
                          prev.filter((id) => {
                            const item = extras.find((me) => me.id === id);
                            return !item?.extra?.isTinaco;
                          })
                        );
                      },
                    },
                    ...tinacoExtras.map((modelExtra) => {
                      const price = modelExtra.priceOverride ?? modelExtra.extra?.basePrice ?? 0;
                      return {
                        key: modelExtra.id,
                        title: modelExtra.extra?.name,
                        description:
                          modelExtra.extra?.description ||
                          "Grado Alimenticio Translúcido (requisito obligatorio de COFEPRIS).",
                        priceText: `$${price.toLocaleString()} MXN`,
                        isSelected: seleccionados.includes(modelExtra.id),
                        onSelectOption: () => toggleExtra(modelExtra.id),
                      };
                    }),
                  ].map((option) => (
                    <li
                      key={option.key}
                      onClick={option.onSelectOption}
                      className={`list-none relative overflow-hidden border rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 cursor-pointer transition-all duration-200 text-left ${
                        option.isSelected
                          ? "bg-[#effdff] border-[#00949f]/70 ring-1 ring-[#00949f]/20 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#031638] text-base sm:text-[17px] leading-snug">
                            {option.title}
                          </h4>
                          <p className="text-[13px] sm:text-sm text-slate-600 leading-relaxed font-normal mt-1">
                            {option.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-end justify-between shrink-0 self-stretch min-h-[46px]">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors bg-white ${
                              option.isSelected ? "border-[#007481]" : "border-slate-300"
                            }`}
                          >
                            {option.isSelected && (
                              <span className="w-3 h-3 rounded-full bg-[#007481]" />
                            )}
                          </div>

                          <p className="text-sm sm:text-base font-extrabold text-[#0b4e5f] tracking-tight whitespace-nowrap mt-2">
                            {option.priceText}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SUB-PASO 3: EXTRAS ADICIONALES */}
            {activeStep.id === "adicionales" && (
              <div className="space-y-3">
                <ul className="space-y-3">
                  {adicionalesExtras.map((modelExtra) => {
                    const isSelected = seleccionados.includes(modelExtra.id);
                    const isDescriptionOpen = !isSelected || expandedSelectedIds.includes(modelExtra.id);
                    const badge = getBadgeInfo(modelExtra);
                    const price = modelExtra.priceOverride ?? modelExtra.extra?.basePrice ?? 0;

                    return (
                      <li
                        key={modelExtra.id}
                        onClick={() => toggleExtra(modelExtra.id)}
                        className={`list-none relative overflow-hidden border rounded-3xl px-4 py-3.5 sm:px-5 sm:py-4 cursor-pointer transition-all duration-200 text-left ${
                          isSelected ? badge.selectedCardClasses : badge.cardClasses
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            {/* Badge de prioridad */}
                            {badge && (
                              <div className="mb-1.5">
                                <span
                                  className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full inline-block ${badge.badgeClasses}`}
                                >
                                  {badge.text}
                                </span>
                              </div>
                            )}

                            {/* Nombre del extra */}
                            <h4 className="font-bold text-[#031638] text-base sm:text-[17px] leading-snug">
                              {modelExtra.extra?.name}
                            </h4>

                            {/* Descripción colapsable al seleccionar, con opción de abrir/cerrar manualmente */}
                            {modelExtra.extra?.description && (
                              <>
                                <AnimatePresence initial={false}>
                                  {isDescriptionOpen && (
                                    <motion.div
                                      key="extra-desc"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.25, ease: "easeInOut" }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-1.5 text-[13px] sm:text-sm text-slate-600 leading-relaxed font-normal">
                                        <FormattedDescription text={modelExtra.extra?.description} />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {isSelected && (
                                  <button
                                    type="button"
                                    onClick={(e) => toggleSelectedDescription(e, modelExtra.id)}
                                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#007481] hover:text-[#00949f] transition-colors cursor-pointer"
                                  >
                                    <span>
                                      {isDescriptionOpen ? "Ocultar descripción" : "Ver descripción"}
                                    </span>
                                    <svg
                                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        isDescriptionOpen ? "rotate-180" : ""
                                      }`}
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2.2}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                )}
                              </>
                            )}
                          </div>

                          {/* Columna derecha: selector tipo almacenamiento (múltiple) + precio */}
                          <div className="flex flex-col items-end shrink-0 gap-2">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors bg-white ${
                                isSelected ? "border-[#007481]" : "border-slate-300"
                              }`}
                            >
                              {isSelected && (
                                <span className="w-3 h-3 rounded-full bg-[#007481]" />
                              )}
                            </div>

                            <p className="text-sm sm:text-base font-extrabold text-[#0c4f5f] tracking-tight whitespace-nowrap">
                              ${price.toLocaleString()} MXN
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
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
              className="px-5 py-2 rounded-xl bg-[#00949f] text-white text-xs font-bold hover:bg-[#007481] transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLastSubStep ? "Adicionales listos" : `Continuar a ${subSteps[currentSubStepIndex + 1]?.navLabel}`}
            </button>
          </div>
        )}

        {/* Barra de Acciones Fija Inferior con gradiente de marca */}
        {!hideFooterActions && (
          <div className="fixed bottom-0 inset-x-0 z-30 w-full max-w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] py-3 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 sm:gap-4 min-w-0">
              {/* Información rápida de la configuración actual */}
              <div className="hidden sm:flex items-center gap-2.5 min-w-0 flex-1 pr-4">
                <span className="w-2 h-2 rounded-full bg-[#00949f] shrink-0 animate-pulse" />
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
              <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto min-w-0 shrink-0 justify-end">
                <button
                  type="button"
                  onClick={handlePrevSubStep}
                  className="flex-1 sm:flex-none sm:min-w-[120px] px-3 sm:px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition cursor-pointer text-center"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNextSubStep}
                  className={`flex-[2] sm:flex-none sm:min-w-[220px] px-4 sm:px-6 py-3 rounded-xl text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-md cursor-pointer text-center ${
                    isCleaning
                      ? "bg-gradient-to-r from-[#133909] via-[#53c406] to-[#90e119] hover:opacity-95"
                      : "bg-gradient-to-r from-[#022447] via-[#02274b] to-[#01949f] hover:opacity-95"
                  }`}
                >
                  <span className="sm:hidden">Continuar</span>
                  <span className="hidden sm:inline">
                    {isLastSubStep
                      ? "Confirmar Selección"
                      : `Continuar a ${subSteps[currentSubStepIndex + 1]?.navLabel || "Siguiente"}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
