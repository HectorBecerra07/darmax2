import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { DoorClosed, DoorOpen, Droplets, Lightbulb, Volume2, VolumeX, RotateCcw, Sliders, Info, Eye, ArrowLeft } from "lucide-react";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

class VendingSoundSystem {
  constructor() {
    this.ctx = null;
    this.noiseNode = null;
    this.filterNode = null;
    this.gainNode = null;
    this.isWaterActive = false;
    this.cachedNoiseBuffer = null;
    this.stopTimeout = null;
  }

  ensureContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playDoorLatch(opening = true) {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";

      const freqStart = opening ? 160 : 210;
      const freqEnd = opening ? 90 : 70;

      osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (_) {}
  }

  playLightSwitch(turningOn = true) {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const freq = turningOn ? 1100 : 700;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (_) {}
  }

  startWaterStream() {
    this.ensureContext();
    if (!this.ctx) return;

    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    if (this.isWaterActive) return;

    try {
      if (!this.cachedNoiseBuffer || this.cachedNoiseBuffer.sampleRate !== this.ctx.sampleRate) {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Algoritmo pink noise para simulacion de fluido
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
        this.cachedNoiseBuffer = buffer;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.cachedNoiseBuffer;
      noise.loop = true;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(750, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(2.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.28, this.ctx.currentTime + 0.3);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(0);

      this.noiseNode = noise;
      this.filterNode = bandpass;
      this.gainNode = gain;
      this.isWaterActive = true;
    } catch (_) {}
  }

  stopWaterStream() {
    if (!this.isWaterActive || !this.gainNode || !this.ctx) return;
    try {
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      if (this.stopTimeout) clearTimeout(this.stopTimeout);
      this.stopTimeout = setTimeout(() => {
        if (this.noiseNode) {
          try { this.noiseNode.stop(); } catch (_) {}
          this.noiseNode.disconnect();
        }
        this.isWaterActive = false;
        this.stopTimeout = null;
      }, 280);
    } catch (_) {
      this.isWaterActive = false;
      this.stopTimeout = null;
    }
  }
}

const audioService = new VendingSoundSystem();

// Paleta y texturas de acero inoxidable cepillado para caras y cajas exteriores
// Capa 1: textura microscopica de acero cepillado (repeating-linear-gradient)
const STEEL_GRAIN_H = "repeating-linear-gradient(90deg, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px, rgba(0,0,0,0.016) 1px, rgba(0,0,0,0.016) 2px, transparent 2px, transparent 4px)";
const STEEL_GRAIN_V = "repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px, rgba(0,0,0,0.016) 1px, rgba(0,0,0,0.016) 2px, transparent 2px, transparent 4px)";

// Capa 2: iluminacion y reflejos especulares de chapa de acero doblada
const STEEL_FINISH = {
  back: `${STEEL_GRAIN_H}, linear-gradient(100deg, #D4D3D6 0%, #B9B8BB 18%, #DEDDDF 38%, #AAA9AB 54%, #CAC9CC 74%, #B6B5B8 100%)`,
  top: `${STEEL_GRAIN_H}, linear-gradient(180deg, #F0EFF1 0%, #E2E1E4 35%, #CDCCCF 75%, #BDBBBE 100%)`,
  bottom: `${STEEL_GRAIN_H}, linear-gradient(180deg, #898889 0%, #5D5C5C 55%, #3F3E3F 100%)`,
  left: `${STEEL_GRAIN_V}, linear-gradient(90deg, #D4D3D6 0%, #BDBBBE 35%, #898889 100%)`,
  right: `${STEEL_GRAIN_V}, linear-gradient(90deg, #777678 0%, #ACAAAD 45%, #CAC9CC 100%)`,
  border: "rgba(119, 118, 120, 0.65)",
};

const METAL_TEX_URL = "/img/textures/metal_brushed.png";

const TEX_OVERLAY_STYLE = Object.freeze({
  position: "absolute",
  inset: 0,
  backgroundImage: `url('${METAL_TEX_URL}')`,
  backgroundRepeat: "repeat",
  backgroundSize: "260px 260px",
  backgroundPosition: "center",
  opacity: 0.22,
  mixBlendMode: "soft-light",
  pointerEvents: "none",
});

const makeTexOverlay = () => TEX_OVERLAY_STYLE;

// Callouts estaticos a nivel de modulo para evitar reasignacion continua en memoria
const CALLOUTS = Object.freeze([
  {
    id: "agua",
    title: "Módulo Agua",
    body: "Despacho automático de garrafón.",
    side: "left",
    bubble: { x: 2, y: 45 },
    color: "#0ea5e9",
    colorBg: "rgba(14, 165, 233, 0.25)",
    colorBorder: "#0ea5e9",
    colorPing: "#38bdf8",
  },
  {
    id: "monedas",
    title: "Monedero Anti Robo",
    body: "Validación multimoneda de alta seguridad.",
    side: "right",
    bubble: { x: 97, y: 17 },
    color: "#f59e0b",
    colorBg: "rgba(245, 158, 11, 0.25)",
    colorBorder: "#f59e0b",
    colorPing: "#fbbf24",
  },
  {
    id: "pantalla",
    title: "Pantalla Touch",
    body: "Interfaz táctil guiada.",
    side: "right",
    bubble: { x: 97, y: 51 },
    color: "#3b82f6",
    colorBg: "rgba(59, 130, 246, 0.25)",
    colorBorder: "#3b82f6",
    colorPing: "#60a5fa",
  },
  {
    id: "tapas",
    title: "Dispensador Tapas",
    body: "Entrega automática de tapas.",
    side: "right",
    bubble: { x: 97, y: 91 },
    color: "#10b981",
    colorBg: "rgba(16, 185, 129, 0.25)",
    colorBorder: "#10b981",
    colorPing: "#34d399",
  },
]);

const VendingPrecise3D = ({
  mode: propMode,
  onModeChange: propOnModeChange,
  showCallouts: propShowCallouts,
  onToggleCallouts: propOnToggleCallouts,
}) => {
  const [rotation, setRotation] = useState({ x: -10, y: -12 });
  const [isDragging, setIsDragging] = useState(false);
  const [internalMode, setInternalMode] = useState(null);
  const [activeCalloutId, setActiveCalloutId] = useState(null);
  const mode = propMode !== undefined ? propMode : internalMode;
  const handleModeChange = (newMode) => {
    setInternalMode(newMode);
    setActiveCalloutId(null);
    if (propOnModeChange) propOnModeChange(newMode);
  };
  const handleBack = () => {
    setActiveCalloutId(null);
    if (mode === "detalles") {
      setDoorAngle((prev) => {
        if (prev > 15) {
          if (soundEnabled) audioService.playDoorLatch(false);
          return 0;
        }
        return 0;
      });
    }
    setInternalMode(null);
    if (propOnModeChange) propOnModeChange(null);
  };

  const [internalShowCallouts, setInternalShowCallouts] = useState(true);
  const showCallouts = propShowCallouts !== undefined ? propShowCallouts : internalShowCallouts;
  const toggleCallouts = () => {
    if (propOnToggleCallouts) {
      propOnToggleCallouts();
    } else {
      setInternalShowCallouts((v) => !v);
    }
  };
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // Estados interactivos
  const [doorAngle, setDoorAngle] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [pourCountdown, setPourCountdown] = useState(0);
  const [uvLight, setUvLight] = useState(false);
  const [hasJug, setHasJug] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const pourTimerRef = useRef(null);

  // Abrir la puerta en automatico al mostrar los detalles
  useEffect(() => {
    if (mode === "detalles" && showCallouts) {
      setDoorAngle((prev) => {
        if (prev < 15) {
          if (soundEnabled) audioService.playDoorLatch(true);
          return 88;
        }
        return prev;
      });
    }
  }, [mode, showCallouts, soundEnabled]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const modelRef = useRef(null);
  const calloutsRef = useRef(null);
  const rotationRef = useRef({ x: -10, y: -12 });
  const lastRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const inertiaRafRef = useRef(null);
  const frameRafRef = useRef(null);

  // Escala dinamica
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const sc = isMobile ? (windowWidth < 380 ? 2.15 : 2.35) : isTablet ? 3.15 : windowWidth >= 1280 ? 3.85 : 3.55;

  const totalW = 80.5 * sc;
  const totalH = 80.5 * sc * (1174 / 1123); // Relacion nativa exacta 1123 x 1174

  // Profundidad del chasis del marco frontal soldado a la imagen
  const chassisDepth = Math.round(5.5 * sc); // Aprox 18px a 21px
  const doorThickness = Math.round(1.5 * sc); // Grosor fisico estilizado de la puerta (aprox 5px)

  // Profundidad de los bloques traseros
  const coinDepth = 28 * sc;
  const tapasDepth = 15 * sc;
  const waterDepth = 22 * sc; // Cabina de agua con profundidad compacta y proporcionada
  const waterFloatZ = Math.round(coinDepth + 5 * sc); // Despegado y flotando un poco mas atras de la Caja Electronica / CPU
  const bridgeDepth = chassisDepth + waterFloatZ; // Profundidad de union entre cara frontal y cabina

  // Coordenadas milimetricas exactas del hueco en frontalV.png
  const hole = {
    left: 6.86,
    top: 13.54,
    width: 40.34,
    height: 64.40,
  };
  const holeHeightPx = Math.round(totalH * (hole.height / 100));

  // Coordenadas milimetricas exactas de la puerta en doorV.png
  const door = {
    left: 4.01,
    top: 13.29,
    width: 43.37,
    height: 64.82,
  };

  // Coordenadas de los modulos traseros en porcentaje
  const coinBox = {
    left: 49.5,
    top: 9.5,
    width: 44.0,
    height: 60.5,
    depth: coinDepth,
  };

  const tapasBox = {
    left: 63.0,
    top: 73.0,
    width: 30.5,
    height: 24.0,
    depth: tapasDepth,
  };

  const updateCalloutsVisibility = useCallback(() => {
    if (calloutsRef.current) {
      const absY = Math.abs(rotationRef.current.y);
      const absX = Math.abs(rotationRef.current.x);

      // Desvanecer suavemente si el giro en Y se aleja de la cara frontal (entre 28deg y 50deg)
      let opacity = 1;
      if (absY > 28) {
        opacity = Math.max(0, 1 - (absY - 28) / 22);
      }
      if (absX > 45) {
        opacity = Math.min(opacity, Math.max(0, 1 - (absX - 45) / 20));
      }

      calloutsRef.current.style.opacity = opacity.toFixed(3);
      calloutsRef.current.style.pointerEvents = opacity > 0.25 ? "auto" : "none";

      // Sutil efecto de paralaje 2D que acompana el giro de la maquina
      const parallaxX = (rotationRef.current.y / 45) * 8;
      const parallaxY = (rotationRef.current.x / 45) * 5;
      calloutsRef.current.style.transform = `translate3d(${parallaxX.toFixed(1)}px, ${parallaxY.toFixed(1)}px, 0)`;
    }
  }, []);

  const updateModelTransform = useCallback(() => {
    if (modelRef.current) {
      modelRef.current.style.transform = `rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`;
    }
    updateCalloutsVisibility();
  }, [updateCalloutsVisibility]);

  const setModelRef = useCallback((node) => {
    modelRef.current = node;
    if (node) {
      node.style.transform = `rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`;
    }
  }, []);

  const stopInertia = () => {
    if (inertiaRafRef.current) cancelAnimationFrame(inertiaRafRef.current);
    inertiaRafRef.current = null;
  };

  const startInertia = () => {
    stopInertia();
    if (modelRef.current) {
      modelRef.current.style.transition = "none";
    }
    const friction = 0.95;
    const minSpeed = 0.01;

    const tick = () => {
      rotationRef.current.y += velRef.current.vx;
      rotationRef.current.x = clamp(rotationRef.current.x - velRef.current.vy, -85, 85);

      updateModelTransform();

      velRef.current.vx *= friction;
      velRef.current.vy *= friction;

      if (Math.abs(velRef.current.vx) < minSpeed && Math.abs(velRef.current.vy) < minSpeed) {
        setRotation({ ...rotationRef.current });
        inertiaRafRef.current = null;
        return;
      }
      inertiaRafRef.current = requestAnimationFrame(tick);
    };
    inertiaRafRef.current = requestAnimationFrame(tick);
  };

  const onPointerDown = (e) => {
    if (Boolean(e.target.closest('[data-ui="true"]'))) return;

    stopInertia();
    if (modelRef.current) {
      modelRef.current.style.transition = "none";
    }
    if (calloutsRef.current) {
      calloutsRef.current.style.transition = "none";
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    lastRef.current = { x: e.clientX, y: e.clientY };
    velRef.current = { vx: 0, vy: 0 };
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };

    const s = 0.25;
    rotationRef.current.y += dx * s;
    rotationRef.current.x = clamp(rotationRef.current.x - dy * s, -85, 85);

    velRef.current.vx = velRef.current.vx * 0.7 + dx * s * 0.3;
    velRef.current.vy = velRef.current.vy * 0.7 + dy * s * 0.3;

    if (!frameRafRef.current) {
      frameRafRef.current = requestAnimationFrame(() => {
        updateModelTransform();
        frameRafRef.current = null;
      });
    }
  };

  const endDrag = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (!isDragging) return;
    setIsDragging(false);

    setRotation({ ...rotationRef.current });

    if (Math.abs(velRef.current.vx) > 0.1 || Math.abs(velRef.current.vy) > 0.1) {
      startInertia();
    }
  };

  const toggleDoor = useCallback(() => {
    if (!mode) return;
    setDoorAngle((prev) => {
      const willOpen = prev < 15;
      if (soundEnabled) {
        audioService.playDoorLatch(willOpen);
      }
      return willOpen ? 88 : 0;
    });
  }, [mode, soundEnabled]);

  const stopPouring = useCallback(() => {
    if (pourTimerRef.current) {
      clearInterval(pourTimerRef.current);
      pourTimerRef.current = null;
    }
    setIsPouring(false);
    setPourCountdown(0);
    audioService.stopWaterStream();
  }, []);

  const startPouring = useCallback(() => {
    if (soundEnabled) audioService.startWaterStream();
    setIsPouring(true);
    setPourCountdown(5);

    if (pourTimerRef.current) clearInterval(pourTimerRef.current);

    pourTimerRef.current = setInterval(() => {
      setPourCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(pourTimerRef.current);
          pourTimerRef.current = null;
          setIsPouring(false);
          audioService.stopWaterStream();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [soundEnabled]);

  const togglePouring = useCallback(() => {
    if (isPouring) {
      stopPouring();
    } else {
      startPouring();
    }
  }, [isPouring, startPouring, stopPouring]);

  useEffect(() => {
    return () => {
      if (pourTimerRef.current) clearInterval(pourTimerRef.current);
    };
  }, []);

  const toggleLight = useCallback(() => {
    setUvLight((prev) => {
      const next = !prev;
      if (soundEnabled) audioService.playLightSwitch(next);
      return next;
    });
  }, [soundEnabled]);

  const resetView = (target = { x: -10, y: -12 }) => {
    stopInertia();
    rotationRef.current = { ...target };
    setRotation({ ...target });
    if (modelRef.current) {
      modelRef.current.style.transition = "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      if (calloutsRef.current) {
        calloutsRef.current.style.transition = "opacity 400ms ease, transform 400ms ease";
      }
      updateModelTransform();
      setTimeout(() => {
        if (modelRef.current) {
          modelRef.current.style.transition = "none";
        }
        if (calloutsRef.current) {
          calloutsRef.current.style.transition = "none";
        }
      }, 420);
    }
  };

  useEffect(() => {
    updateCalloutsVisibility();
    return () => {
      stopInertia();
      if (frameRafRef.current) cancelAnimationFrame(frameRafRef.current);
      audioService.stopWaterStream();
    };
  }, [updateCalloutsVisibility]);

  return (
    <div className="relative flex flex-col items-center justify-start font-montserrat not-italic w-full h-full select-none pt-0 sm:pt-1">
      
      {/* BARRA SUPERIOR: SELECTOR MUTANTE UNIFICADO CON ALTURA CONSTANTE */}
      <div
        data-ui="true"
        className="h-9 mb-5 sm:mb-5 md:mb-6 z-30 w-full flex items-center justify-center shrink-0"
      >
        {mode === "controles" ? (
          /* MODO CONTROLES: La barra se convierte en los controles con boton de regreso */
          <div className="flex items-center justify-center flex-nowrap gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-white/95 border border-slate-200 shadow-md shadow-slate-900/5 backdrop-blur text-[10px] sm:text-[11px] font-semibold text-slate-700 max-w-full">
            {/* Boton de regreso */}
            <button
              type="button"
              onClick={handleBack}
              className="p-1 sm:px-2 sm:py-1 flex items-center gap-1 rounded-full text-slate-500 hover:text-[#168387] hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
              title="Regresar al selector"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline text-[10.5px]">Volver</span>
            </button>

            <div className="h-3.5 w-px bg-slate-200" />

            {/* Puerta */}
            <button
              type="button"
              onClick={toggleDoor}
              className={`p-1.5 sm:px-2.5 sm:py-1 flex items-center gap-1 sm:gap-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                doorAngle > 10
                  ? "bg-slate-900 text-white shadow-sm"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              title={doorAngle > 10 ? "Cerrar puerta" : "Abrir puerta"}
            >
              {doorAngle > 10 ? <DoorOpen size={12} /> : <DoorClosed size={12} />}
              <span className="hidden sm:inline">{doorAngle > 10 ? `Puerta (${Math.round(doorAngle)}°)` : "Abrir Puerta"}</span>
            </button>

            {/* Agua */}
            <button
              type="button"
              onClick={togglePouring}
              className={`p-1.5 sm:px-2.5 sm:py-1 flex items-center gap-1 sm:gap-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isPouring
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm animate-pulse"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              title={isPouring ? `Despachando agua (${pourCountdown}s)` : "Simular despacho de agua (5 segundos)"}
            >
              {pourCountdown > 0 ? (
                <>
                  {/* En movil: se reemplaza el icono por el numero del contador */}
                  <span className="sm:hidden w-3 h-3 flex items-center justify-center text-[10.5px] font-black leading-none font-montserrat not-italic">
                    {pourCountdown}
                  </span>
                  {/* En escritorio: icono animado y texto descriptivo con segundos */}
                  <Droplets size={12} className="hidden sm:inline animate-bounce" />
                  <span className="hidden sm:inline">{`Despachando (${pourCountdown}s)`}</span>
                </>
              ) : (
                <>
                  <Droplets size={12} />
                  <span className="hidden sm:inline">Despachar Agua</span>
                </>
              )}
            </button>

            {/* Luz */}
            <button
              type="button"
              onClick={toggleLight}
              className={`p-1.5 sm:px-2.5 sm:py-1 flex items-center gap-1 sm:gap-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                uvLight
                  ? "bg-white text-slate-900 font-bold shadow-[0_0_12px_rgba(255,255,255,0.7)] border border-slate-200"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              title={uvLight ? "Luz encendida (Clic para apagar)" : "Luz apagada (Clic para encender)"}
            >
              <Lightbulb size={12} className={uvLight ? "text-amber-400 drop-shadow animate-pulse" : "text-slate-500"} />
              <span className="hidden sm:inline">{uvLight ? "Luz ON" : "Luz LED"}</span>
            </button>

            {/* Sonido */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (!next && isPouring) {
                  audioService.stopWaterStream();
                } else if (next && isPouring) {
                  audioService.startWaterStream();
                }
              }}
              className={`p-1.5 sm:p-1.5 rounded-full transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-slate-100 text-[#168387]"
                  : "text-slate-400 hover:bg-slate-100"
              }`}
              title={soundEnabled ? "Sonido activado" : "Sonido silenciado"}
            >
              {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            </button>

            {/* Recentrar */}
            <button
              type="button"
              onClick={() => resetView({ x: -10, y: -12 })}
              className="p-1.5 sm:p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              title="Restablecer rotacion frontal"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        ) : mode === "detalles" ? (
          /* MODO DETALLES: La barra se convierte en la barra de detalles con boton de regreso */
          <div className="flex items-center justify-center flex-nowrap gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-white/95 border border-slate-200 shadow-md shadow-slate-900/5 backdrop-blur text-[10px] sm:text-[11px] font-semibold text-slate-700 max-w-full">
            {/* Boton de regreso */}
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-slate-500 hover:text-[#168387] hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
              title="Regresar al selector"
            >
              <ArrowLeft size={13} />
              <span className="text-[10px] sm:text-[11px]">Volver</span>
            </button>

            <div className="h-3.5 w-px bg-slate-200" />

            {/* Alternar visibilidad de especificaciones */}
            <button
              type="button"
              onClick={toggleCallouts}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-700 hover:text-[#168387] hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
              title={showCallouts ? "Ocultar especificaciones" : "Ver especificaciones"}
            >
              <Eye size={12} className={showCallouts ? "text-[#168387]" : "text-slate-400"} />
              <span>{showCallouts ? "Ocultar detalles" : "Ver detalles"}</span>
            </button>
          </div>
        ) : (
          /* MODO NEUTRAL: Switch selector con ninguna opcion preseleccionada */
          <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-xs backdrop-blur text-[10.5px] sm:text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => handleModeChange("controles")}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-700 hover:text-[#168387] hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap"
            >
              <Sliders size={12} className="text-[#168387]" />
              <span>Controles</span>
            </button>
            <div className="h-3.5 w-px bg-slate-200" />
            <button
              type="button"
              onClick={() => handleModeChange("detalles")}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-700 hover:text-[#168387] hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap"
            >
              <Info size={12} className="text-[#168387]" />
              <span>Detalles</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative mx-auto w-full flex items-center justify-center shrink-0">
        <div
          className="relative mx-auto"
          style={{
            width: totalW,
            height: totalH,
            perspective: "2500px",
            touchAction: "none",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {/* Sombra suave y realista en el suelo */}
          <div
            className="absolute left-1/2 -bottom-2.5 sm:-bottom-3.5 w-[150px] sm:w-[210px] h-[14px] sm:h-[18px] -translate-x-1/2 rounded-full bg-slate-900/30 blur-md sm:blur-lg pointer-events-none"
          />

          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
            }}
            ref={setModelRef}
          >
            {/* 1. GABINETE Y PANEL FRONTAL UNIFICADO (Frente en Z=0 soldado con los 4 costados) */}
            <div className="absolute w-full h-full" style={{ transformStyle: "preserve-3d" }}>
              
              {/* Caratula frontal continua en Z = 0 (Totalmente unida al diseno) */}
              <div
                className="absolute w-full h-full z-20 bg-cover bg-no-repeat pointer-events-none select-none"
                style={{
                  transform: "translateZ(0px)",
                  backgroundImage: `url('/img/vending/frontalV.png')`,
                  backgroundSize: "100% 100%",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />

              {/* Balizas 3D en caratula frontal durante modo detalles */}
              {mode === "detalles" && showCallouts && (
                <div
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{ transform: "translateZ(1px)", backfaceVisibility: "hidden" }}
                >
                  {[
                    { id: "agua", left: "27%", top: "45%" },
                    { id: "monedas", left: "57.5%", top: "22%" },
                    { id: "pantalla", left: "81.5%", top: "40%" },
                    { id: "tapas", left: "80.5%", top: "91%" },
                  ].map((pin) => {
                    const c = CALLOUTS.find((item) => item.id === pin.id);
                    const isActive = activeCalloutId === pin.id;
                    const isOtherPinOnMobile = isMobile && Boolean(activeCalloutId) && !isActive;
                    const pinColor = isActive ? c.color : "#168387";
                    const pingColor = isActive ? c.colorPing : "#168387";

                    return (
                      <div
                        key={pin.id}
                        data-ui="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCalloutId((prev) => (prev === pin.id ? null : pin.id));
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-300 hover:scale-125 z-30 ${
                          isOtherPinOnMobile ? "opacity-35" : "opacity-100"
                        }`}
                        style={{ left: pin.left, top: pin.top }}
                        title={c ? c.title : pin.id}
                      >
                        <span className={`relative flex transition-all duration-300 ${isActive ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-2.5 w-2.5 sm:h-3 sm:w-3"}`}>
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ backgroundColor: pingColor }}
                          />
                          <span
                            className="relative inline-flex rounded-full h-full w-full border-2 border-white shadow-md transition-colors duration-300"
                            style={{ backgroundColor: pinColor }}
                          />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Marco / Túnel interior del chasis hacia la cabina (grosor de 20px) */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${hole.left}%`,
                  top: `${hole.top}%`,
                  width: `${hole.width}%`,
                  height: `${hole.height}%`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Costados Laterales de Unión (Paredes Izquierda y Derecha del túnel con caras Interior y Exterior) */}
                <WaterTunnelSidesBridge
                  depth={bridgeDepth}
                  uvLight={uvLight}
                  makeTexOverlay={makeTexOverlay}
                />
                {/* CARA SUPERIOR DE UNIÓN (Techo que conecta cara frontal con cabina, con Orificio de Entrada de Agua) */}
                <WaterInletCeilingBridge
                  depth={bridgeDepth}
                  sc={sc}
                  holeHeightPx={holeHeightPx}
                  uvLight={uvLight}
                  isPouring={isPouring}
                  makeTexOverlay={makeTexOverlay}
                />
                {/* CARA INFERIOR DE UNIÓN (Piso que conecta cara frontal con cabina, con Charola de Desagüe y Orificio Central) */}
                <DrainTrayBridge
                  depth={bridgeDepth}
                  sc={sc}
                  uvLight={uvLight}
                  makeTexOverlay={makeTexOverlay}
                />
              </div>

              {/* 4 COSTADOS DEL CHASIS (Parten exactamente de Z=0 hacia Z=-chassisDepth sin lineas oscuras exteriores) */}
              {/* Costado Izquierdo */}
              <div
                className="absolute h-full left-0 top-0 origin-left overflow-hidden"
                style={{
                  width: `${chassisDepth}px`,
                  transform: "rotateY(90deg)",
                  background: `${STEEL_GRAIN_V}, linear-gradient(90deg, #D4D3D6 0%, #BDBBBE 45%, #898889 100%)`,
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
                  backfaceVisibility: "visible",
                  WebkitBackfaceVisibility: "visible",
                }}
              >
                <div style={makeTexOverlay()} />
              </div>

              {/* Costado Derecho */}
              <div
                className="absolute h-full right-0 top-0 origin-right overflow-hidden"
                style={{
                  width: `${chassisDepth}px`,
                  transform: "rotateY(-90deg)",
                  background: `${STEEL_GRAIN_V}, linear-gradient(90deg, #777678 0%, #ACAAAD 55%, #CAC9CC 100%)`,
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
                  backfaceVisibility: "visible",
                  WebkitBackfaceVisibility: "visible",
                }}
              >
                <div style={makeTexOverlay()} />
              </div>

              {/* Costado Superior (Techo) */}
              <div
                className="absolute w-full left-0 top-0 origin-top overflow-hidden"
                style={{
                  height: `${chassisDepth}px`,
                  transform: "rotateX(-90deg)",
                  background: STEEL_FINISH.top,
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8)",
                  backfaceVisibility: "visible",
                  WebkitBackfaceVisibility: "visible",
                }}
              >
                <div style={makeTexOverlay()} />
              </div>

              {/* Costado Inferior (Piso) */}
              <div
                className="absolute w-full left-0 bottom-0 origin-bottom overflow-hidden"
                style={{
                  height: `${chassisDepth}px`,
                  transform: "rotateX(90deg)",
                  background: STEEL_FINISH.bottom,
                  boxShadow: "inset 0 -2px 6px rgba(0,0,0,0.6)",
                  backfaceVisibility: "visible",
                  WebkitBackfaceVisibility: "visible",
                }}
              >
                <div style={makeTexOverlay()} />
              </div>
            </div>

            {/* 3. PUERTA ABATIBLE SÓLIDA (Volumen 3D dentro del modelo) */}
            <div
              className="absolute z-30 transition-transform duration-500 ease-out"
              data-ui={mode ? "true" : undefined}
              style={{
                left: `${door.left}%`,
                top: `${door.top}%`,
                width: `${door.width}%`,
                height: `${door.height}%`,
                transformStyle: "preserve-3d",
                transformOrigin: "left center", // Las bisagras coinciden exactamente con door.left (4.01%)
                transform: `translateZ(1px) rotateY(-${doorAngle}deg)`,
                cursor: mode ? "pointer" : "inherit",
              }}
              onClick={mode ? toggleDoor : undefined}
              title={
                mode
                  ? doorAngle > 10
                    ? "Haz clic para cerrar la puerta"
                    : "Haz clic para abrir la puerta"
                  : undefined
              }
            >
              {/* Cara Frontal de la Puerta (Exterior a ras del marco frontal) */}
              <div
                className="absolute inset-0"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(0px)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <img
                  src="/img/vending/doorV.png"
                  alt="Puerta Dispensador Darmax"
                  className="w-full h-full object-fill pointer-events-none select-none drop-shadow-md"
                />
              </div>

              {/* Cara Posterior de la Puerta (Interior hacia la cabina) */}
              <div
                className="absolute inset-0 rounded overflow-hidden pointer-events-none"
                style={{
                  transform: `rotateY(180deg) translateZ(${doorThickness}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <img
                  src="/img/vending/doorback.png"
                  alt="Puerta Dispensador Darmax Posterior"
                  className="h-full object-fill pointer-events-none select-none drop-shadow-md"
                  style={{
                    width: "107.5%",
                    maxWidth: "none",
                    marginLeft: "-7.0%",
                  }}
                />
              </div>

              {/* Canto Derecho (perfil de apertura cerrado hacia el interior) */}
              <div
                className="absolute top-0 right-0 h-full pointer-events-none"
                style={{
                  width: `${doorThickness}px`,
                  transformOrigin: "right center",
                  transform: "rotateY(-90deg)",
                  background: "linear-gradient(to right, #475569, #94a3b8 35%, #e2e8f0 65%, #64748b)",
                  boxShadow: "inset 0 0 3px rgba(0,0,0,0.35)",
                }}
              >
                {/* Pestillo metalico de la cerradura */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-200 to-slate-400 rounded-[1px] border border-slate-700 shadow-xs"
                  style={{
                    width: `${Math.max(2, Math.round(doorThickness * 0.45))}px`,
                    height: "22px",
                  }}
                />
              </div>

              {/* Canto Izquierdo (perfil de bisagras cerrado hacia el interior) */}
              <div
                className="absolute top-0 left-0 h-full pointer-events-none"
                style={{
                  width: `${doorThickness}px`,
                  transformOrigin: "left center",
                  transform: "rotateY(90deg)",
                  background: "linear-gradient(to right, #334155, #64748b, #94a3b8)",
                  boxShadow: "inset 0 0 3px rgba(0,0,0,0.4)",
                }}
              />

              {/* Canto Superior (al ras hacia el interior) */}
              <div
                className="absolute top-0 left-0 w-full pointer-events-none"
                style={{
                  height: `${doorThickness}px`,
                  transformOrigin: "top center",
                  transform: "rotateX(-90deg)",
                  background: "linear-gradient(to bottom, #94a3b8, #cbd5e1, #64748b)",
                  boxShadow: "inset 0 0 2px rgba(0,0,0,0.3)",
                }}
              />

              {/* Canto Inferior (al ras hacia el interior) */}
              <div
                className="absolute bottom-0 left-0 w-full pointer-events-none"
                style={{
                  height: `${doorThickness}px`,
                  transformOrigin: "bottom center",
                  transform: "rotateX(90deg)",
                  background: "linear-gradient(to top, #334155, #475569, #64748b)",
                  boxShadow: "inset 0 0 3px rgba(0,0,0,0.4)",
                }}
              />
            </div>

            {/* 4. ESTRUCTURA TRASERA SÓLIDA */}
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                transform: `translateZ(-${chassisDepth}px)`,
              }}
            >
              {/* Placa base del gabinete principal con hueco para la cabina de agua */}
              <div
                className="w-full h-full"
                style={{
                  background: STEEL_FINISH.back,
                  transform: "translateZ(-0.5px)",
                  backfaceVisibility: "visible",
                  WebkitBackfaceVisibility: "visible",
                  clipPath: `polygon(
                    0% 0%, 
                    100% 0%, 
                    100% 100%, 
                    0% 100%, 
                    0% 0%, 
                    ${hole.left}% ${hole.top}%, 
                    ${hole.left}% ${hole.top + hole.height}%, 
                    ${hole.left + hole.width}% ${hole.top + hole.height}%, 
                    ${hole.left + hole.width}% ${hole.top}%, 
                    ${hole.left}% ${hole.top}%
                  )`,
                }}
              >
                <div style={makeTexOverlay()} />
              </div>

              {/* BLOQUE TRASERO 1: MÓDULO CABINA AGUA (Flotando y despegado en 3D un poco más atrás de Caja Electrónica) */}
              <WaterCabinBox
                x={hole.left}
                y={hole.top}
                w={hole.width}
                h={hole.height}
                depth={waterDepth}
                floatZ={waterFloatZ}
                isPouring={isPouring}
                uvLight={uvLight}
                hasJug={hasJug}
                onToggleLight={toggleLight}
                makeTexOverlay={makeTexOverlay}
              />

              {/* BLOQUE TRASERO 2: CAJA ELECTRÓNICA / CPU MONEDERO */}
              <RearSolidBox
                title="CAJA ELECTRÓNICA / CPU"
                x={coinBox.left}
                y={coinBox.top}
                w={coinBox.width}
                h={coinBox.height}
                depth={coinBox.depth}
                theme="amber"
                makeTexOverlay={makeTexOverlay}
              />

              {/* BLOQUE TRASERO 3: DISPENSADOR DE TAPAS */}
              <RearSolidBox
                title="DISPENSADOR TAPAS"
                x={tapasBox.left}
                y={tapasBox.top}
                w={tapasBox.width}
                h={tapasBox.height}
                depth={tapasBox.depth}
                theme="emerald"
                makeTexOverlay={makeTexOverlay}
              />
            </div>
          </div>

          {/* CALLOUTS (Tarjetas informativas que flotan a traves del modelo reactivas al giro 3D) */}
          {mode === "detalles" && showCallouts && (
            <div
              ref={calloutsRef}
              className="absolute inset-0 pointer-events-none z-40"
              style={{ willChange: "opacity, transform" }}
            >
              {CALLOUTS.map((c) => {
                const isActive = activeCalloutId === c.id;
                const isHiddenOnMobile = isMobile && Boolean(activeCalloutId) && !isActive;

                return (
                  <div
                    key={c.id}
                    data-ui="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCalloutId((prev) => (prev === c.id ? null : c.id));
                    }}
                    className={`absolute z-[50] cursor-pointer transition-all duration-300 ${
                      isHiddenOnMobile
                        ? "opacity-0 scale-90 pointer-events-none"
                        : "opacity-100 scale-100 pointer-events-auto"
                    }`}
                    style={{
                      left: isMobile
                        ? (c.side === "left" ? "1%" : "99%")
                        : `${c.bubble.x}%`,
                      top: `${c.bubble.y}%`,
                      transform: isMobile
                        ? (c.side === "left" ? "translate(-78%, -50%)" : "translate(-22%, -50%)")
                        : (c.side === "left" ? "translate(-98%, -50%)" : "translate(-2%, -50%)"),
                    }}
                  >
                    <div
                      className={`w-[118px] sm:w-[145px] rounded-xl border backdrop-blur px-2.5 py-1.5 sm:px-3 sm:py-2 transition-all duration-300 ${
                        isActive
                          ? "scale-105"
                          : "hover:scale-105 shadow-md shadow-slate-900/5 bg-white/95 border-slate-200/90"
                      }`}
                      style={{
                        backgroundColor: isActive ? "rgba(255, 255, 255, 0.98)" : undefined,
                        borderColor: isActive ? c.colorBorder : undefined,
                        boxShadow: isActive
                          ? `0 10px 25px -4px ${c.colorBg}, 0 0 0 1.5px ${c.colorBorder}`
                          : undefined,
                      }}
                    >
                      <div
                        className="text-[9px] sm:text-[10.5px] font-bold leading-tight font-montserrat not-italic sm:whitespace-nowrap transition-colors duration-300"
                        style={{ color: isActive ? c.color : "#0f172a" }}
                      >
                        {c.title}
                      </div>
                      <div className="text-[8px] sm:text-[9.5px] text-slate-500 leading-snug mt-1 font-montserrat not-italic">
                        {c.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para Cubos y Cajas Sólidas con Iluminación Direccional (Volumétrico)
function RearSolidBox({ title, x, y, w, h, depth, theme, makeTexOverlay }) {
  const faceBase = "absolute overflow-hidden";

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 1. CARA TRASERA */}
      <div
        className={`${faceBase} inset-0 border flex flex-col items-center justify-center p-2 text-center shadow-inner`}
        style={{
          transform: `translateZ(-${depth}px) rotateY(180deg)`,
          background: STEEL_FINISH.back,
          borderColor: STEEL_FINISH.border,
          boxShadow: "inset 2px 2px 3px rgba(255, 255, 255, 0.45), inset -2px -2px 4px rgba(0, 0, 0, 0.25), inset 0 0 20px rgba(0,0,0,0.15)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 2. CARA LATERAL IZQUIERDA */}
      <div
        className={`${faceBase} h-full left-0 top-0 origin-left`}
        style={{
          width: `${depth}px`,
          transform: "rotateY(90deg)",
          background: STEEL_FINISH.left,
          boxShadow: "inset 2px 0 3px rgba(255, 255, 255, 0.5), inset -3px 0 5px rgba(0, 0, 0, 0.35)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 3. CARA LATERAL DERECHA */}
      <div
        className={`${faceBase} h-full right-0 top-0 origin-right`}
        style={{
          width: `${depth}px`,
          transform: "rotateY(-90deg)",
          background: STEEL_FINISH.right,
          boxShadow: "inset -2px 0 3px rgba(255, 255, 255, 0.4), inset 3px 0 5px rgba(0, 0, 0, 0.35)",
          borderRight: "1px solid rgba(50, 50, 50, 0.55)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 4. CARA SUPERIOR (TECHO) */}
      <div
        className={`${faceBase} w-full left-0 top-0 origin-top`}
        style={{
          height: `${depth}px`,
          transform: "rotateX(-90deg)",
          background: STEEL_FINISH.top,
          boxShadow: "inset 0 2px 3px rgba(255, 255, 255, 0.85), inset 0 -2px 4px rgba(0, 0, 0, 0.15)",
          borderTop: "1px solid rgba(255, 255, 255, 0.75)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 5. CARA INFERIOR (PISO) */}
      <div
        className={`${faceBase} w-full left-0 bottom-0 origin-bottom`}
        style={{
          height: `${depth}px`,
          transform: "rotateX(90deg)",
          background: STEEL_FINISH.bottom,
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -2px 6px rgba(0, 0, 0, 0.7)",
          borderBottom: "1px solid rgba(50, 50, 50, 0.75)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>
    </div>
  );
}

// Componente para los Costados Laterales de Unión (Paredes Izquierda y Derecha del túnel)
// Cuenta con iluminación reactiva en el interior y tonos de acero industrial a juego con Caja Eléctrica / CPU en el exterior
function WaterTunnelSidesBridge({ depth, uvLight, makeTexOverlay }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
      {/* 1. Cara Lateral Izquierda Interior (Visible desde el interior de la cabina, se ilumina al prender la luz) */}
      <div
        className="absolute h-full left-0 top-0 overflow-hidden transition-all duration-500 ease-out pointer-events-none"
        style={{
          width: `${depth}px`,
          transform: "rotateY(90deg)",
          transformOrigin: "left center",
          background: uvLight
            ? "radial-gradient(ellipse 80% 70% at 95% 15%, rgba(255, 255, 255, 0.22) 0%, transparent 75%), linear-gradient(90deg, #333d4b 0%, #475569 40%, #5c6b7e 85%, #3d4a59 100%)"
            : "linear-gradient(90deg, #1e242c 0%, #28313c 40%, #333d4b 85%, #222932 100%)",
          boxShadow: uvLight
            ? "inset 0 0 15px rgba(255,255,255,0.12), inset 0 0 12px rgba(0,0,0,0.3)"
            : "inset 0 0 15px rgba(0,0,0,0.6)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 2. Cara Lateral Izquierda Exterior (Visible desde el exterior izquierdo, tonos acero cepillado) */}
      <div
        className="absolute h-full left-0 top-0 overflow-hidden pointer-events-none"
        style={{
          width: `${depth}px`,
          transform: `translateZ(-${depth}px) rotateY(-90deg)`,
          transformOrigin: "left center",
          background: `${STEEL_GRAIN_V}, linear-gradient(90deg, #898889 0%, #BDBBBE 65%, #D4D3D6 100%)`,
          boxShadow: "inset 2px 0 3px rgba(255, 255, 255, 0.5), inset -3px 0 5px rgba(0, 0, 0, 0.35)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 3. Cara Lateral Derecha Interior (Visible desde el interior de la cabina, se ilumina al prender la luz) */}
      <div
        className="absolute h-full right-0 top-0 overflow-hidden transition-all duration-500 ease-out pointer-events-none"
        style={{
          width: `${depth}px`,
          transform: "rotateY(-90deg)",
          transformOrigin: "right center",
          background: uvLight
            ? "radial-gradient(ellipse 80% 70% at 5% 15%, rgba(255, 255, 255, 0.22) 0%, transparent 75%), linear-gradient(90deg, #3d4a59 0%, #5c6b7e 15%, #475569 60%, #333d4b 100%)"
            : "linear-gradient(90deg, #222932 0%, #333d4b 15%, #28313c 60%, #1e242c 100%)",
          boxShadow: uvLight
            ? "inset 0 0 15px rgba(255,255,255,0.12), inset 0 0 12px rgba(0,0,0,0.3)"
            : "inset 0 0 15px rgba(0,0,0,0.6)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 4. Cara Lateral Derecha Exterior (Visible desde el exterior derecho, tonos acero cepillado) */}
      <div
        className="absolute h-full right-0 top-0 overflow-hidden pointer-events-none"
        style={{
          width: `${depth}px`,
          transform: `translateZ(-${depth}px) rotateY(90deg)`,
          transformOrigin: "right center",
          background: `${STEEL_GRAIN_V}, linear-gradient(90deg, #CAC9CC 0%, #ACAAAD 55%, #777678 100%)`,
          boxShadow: "inset -2px 0 3px rgba(255, 255, 255, 0.4), inset 3px 0 5px rgba(0, 0, 0, 0.35)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>
    </div>
  );
}

// Componente para la Cara Superior de Unión: Techo que conecta la cara frontal con la cabina
// Cuenta con iluminación reactiva, textura metálica, Orificio Pasante, Boquilla 3D de PVC blanco y Cilindro 3D de Agua
function WaterInletCeilingBridge({ depth, sc = 3.5, holeHeightPx, uvLight, isPouring, makeTexOverlay }) {
  // Radio proporcional para el orificio de entrada de agua (alineado verticalmente con el desagüe inferior)
  const holeRadius = Math.round(1.7 * sc);

  // Parámetros de la boquilla cilíndrica de tubería PVC blanca
  const pvcRadius = Math.max(4, Math.round(holeRadius * 0.85)); // Diámetro aprox 10px a 11px
  const innerLength = Math.round(5.5 * sc); // Longitud que desciende hacia el interior de la cabina (aprox 20px)
  const outerLength = Math.round(2.5 * sc); // Longitud que sobresale hacia el exterior en el techo (aprox 9px)
  const totalLength = innerLength + outerLength;
  const facetWidth = Math.ceil(pvcRadius * 0.88);

  // Parámetros del cilindro 3D de agua cristalina azul con tonos transparentes degradados
  const waterRadius = Math.max(3, Math.round(pvcRadius * 0.72));
  const waterFacetWidth = Math.ceil(waterRadius * 0.9);
  const waterStreamLength = (holeHeightPx || Math.round(54 * sc)) - innerLength;

  const PVC_FACETS = [
    { angle: 0, bg: uvLight ? "linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)" : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)" },
    { angle: 45, bg: uvLight ? "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)" : "linear-gradient(180deg, #f1f5f9 0%, #cbd5e1 50%, #94a3b8 100%)" },
    { angle: 90, bg: uvLight ? "linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)" : "linear-gradient(180deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)" },
    { angle: 135, bg: uvLight ? "linear-gradient(180deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)" : "linear-gradient(180deg, #94a3b8 0%, #64748b 50%, #475569 100%)" },
    { angle: 180, bg: uvLight ? "linear-gradient(180deg, #94a3b8 0%, #64748b 50%, #475569 100%)" : "linear-gradient(180deg, #64748b 0%, #475569 50%, #334155 100%)" },
    { angle: 225, bg: uvLight ? "linear-gradient(180deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)" : "linear-gradient(180deg, #94a3b8 0%, #64748b 50%, #475569 100%)" },
    { angle: 270, bg: uvLight ? "linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)" : "linear-gradient(180deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)" },
    { angle: 315, bg: uvLight ? "linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)" : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)" },
  ];

  const WATER_FACETS = [
    { angle: 0, bg: "linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(186, 230, 253, 0.7) 15%, rgba(56, 189, 248, 0.5) 45%, rgba(14, 165, 233, 0.4) 75%, rgba(56, 189, 248, 0.6) 100%)" },
    { angle: 45, bg: "linear-gradient(180deg, rgba(224, 242, 254, 0.7) 0%, rgba(56, 189, 248, 0.55) 25%, rgba(14, 165, 233, 0.45) 60%, rgba(2, 132, 199, 0.35) 100%)" },
    { angle: 90, bg: "linear-gradient(180deg, rgba(56, 189, 248, 0.65) 0%, rgba(14, 165, 233, 0.55) 30%, rgba(2, 132, 199, 0.45) 70%, rgba(14, 165, 233, 0.5) 100%)" },
    { angle: 135, bg: "linear-gradient(180deg, rgba(14, 165, 233, 0.45) 0%, rgba(3, 105, 161, 0.35) 40%, rgba(7, 89, 133, 0.25) 80%, rgba(14, 165, 233, 0.35) 100%)" },
    { angle: 180, bg: "linear-gradient(180deg, rgba(14, 165, 233, 0.4) 0%, rgba(3, 105, 161, 0.3) 50%, rgba(7, 89, 133, 0.2) 100%)" },
    { angle: 225, bg: "linear-gradient(180deg, rgba(14, 165, 233, 0.45) 0%, rgba(3, 105, 161, 0.35) 40%, rgba(7, 89, 133, 0.25) 80%, rgba(14, 165, 233, 0.35) 100%)" },
    { angle: 270, bg: "linear-gradient(180deg, rgba(56, 189, 248, 0.65) 0%, rgba(14, 165, 233, 0.55) 30%, rgba(2, 132, 199, 0.45) 70%, rgba(14, 165, 233, 0.5) 100%)" },
    { angle: 315, bg: "linear-gradient(180deg, rgba(224, 242, 254, 0.7) 0%, rgba(56, 189, 248, 0.55) 25%, rgba(14, 165, 233, 0.45) 60%, rgba(2, 132, 199, 0.35) 100%)" },
  ];

  return (
    <div className="absolute w-full left-0 top-0" style={{ transformStyle: "preserve-3d" }}>
      {/* 1. Cara inferior visible desde el interior de la cabina (Techo interior que brilla al prender el foco) */}
      <div
        className="absolute w-full left-0 top-0 overflow-hidden transition-all duration-500 ease-out"
        style={{
          height: `${depth}px`,
          transform: "rotateX(-90deg)",
          transformOrigin: "top center",
          background: uvLight
            ? "radial-gradient(ellipse 75% 85% at 50% 50%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.1) 45%, transparent 80%), linear-gradient(180deg, #64748b 0%, #4f5d6f 60%, #374351 100%)"
            : "linear-gradient(180deg, #374151 0%, #28313c 60%, #1a2027 100%)",
          boxShadow: uvLight
            ? "inset 0 -8px 20px rgba(255,255,255,0.22), inset 0 0 10px rgba(0,0,0,0.3)"
            : "inset 0 -4px 10px rgba(0,0,0,0.6)",
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 0.5}px, black 100%)`,
          maskImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 0.5}px, black 100%)`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />

        {/* Boquilla / Aro embellecedor de entrada de agua en el techo interior */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative ${
              uvLight
                ? "border-slate-200 bg-slate-400/20 shadow-[0_0_12px_rgba(255,255,255,0.5),inset_0_1px_2px_rgba(255,255,255,0.6)]"
                : "border-slate-500 bg-slate-700/20 shadow-inner"
            }`}
            title="Orificio para la entrada de agua"
          >
            {/* Aro biselado exterior del orificio */}
            <div
              className={`rounded-full border transition-all duration-500 ${
                uvLight ? "border-slate-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" : "border-slate-600 shadow-inner"
              }`}
              style={{ width: `${holeRadius * 2 + 2}px`, height: `${holeRadius * 2 + 2}px` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Cara superior exterior visible desde arriba del chasis (Tonos acero cepillado con orificio de entrada) */}
      <div
        className="absolute w-full left-0 top-0 overflow-hidden pointer-events-none"
        style={{
          height: `${depth}px`,
          transform: "rotateX(-90deg) rotateY(180deg)",
          transformOrigin: "top center",
          background: STEEL_FINISH.top,
          boxShadow: "inset 0 2px 3px rgba(255,255,255,0.85), inset 0 -2px 4px rgba(0,0,0,0.15)",
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 0.5}px, black 100%)`,
          maskImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 0.5}px, black 100%)`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />

        {/* Brida de entrada de agua exterior en el techo */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
          style={{ width: `${holeRadius * 4.4}px`, height: `${holeRadius * 4.4}px` }}
        >
          {/* Brida exterior de fijación con remaches metálicos */}
          <div className="absolute inset-0 rounded-full border border-[#898889] bg-gradient-to-b from-[#E2E1E4] via-[#CDCCCF] to-[#ACAAAD] shadow-sm flex items-center justify-center">
            {/* 4 Remaches de montaje exterior */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F0EFF1] border border-[#777678] shadow-xs" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F0EFF1] border border-[#777678] shadow-xs" />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#F0EFF1] border border-[#777678] shadow-xs" />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#F0EFF1] border border-[#777678] shadow-xs" />

            {/* Collarín / Conector de tubería */}
            <div
              className="rounded-full border-2 border-[#BDBBBE] shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
              style={{ width: `${holeRadius * 2.8}px`, height: `${holeRadius * 2.8}px` }}
            />
          </div>
        </div>
      </div>

      {/* 3. BOQUILLA CILÍNDRICA 3D DE TUBERÍA PVC BLANCA (Parte interna que desciende y saliendo hacia el exterior) */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: 0,
          transformStyle: "preserve-3d",
          transform: `translate3d(0px, 0px, -${depth * 0.5}px)`,
        }}
      >
        {/* Pasamuros / Cople blanco de fijación en la unión del techo interior */}
        <div
          className="absolute rounded-full border pointer-events-none transition-all duration-500"
          style={{
            width: `${pvcRadius * 2.6}px`,
            height: `${pvcRadius * 2.6}px`,
            left: `-${pvcRadius * 1.3}px`,
            top: `-${pvcRadius * 1.3}px`,
            transform: "rotateX(90deg)",
            background: uvLight ? "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderColor: uvLight ? "#cbd5e1" : "#94a3b8",
            boxShadow: uvLight ? "0 0 6px rgba(255,255,255,0.5)" : "0 1px 3px rgba(0,0,0,0.3)",
            backfaceVisibility: "visible",
            WebkitBackfaceVisibility: "visible",
          }}
        />

        {/* 8 Facetas del cuerpo cilíndrico de PVC blanco */}
        {PVC_FACETS.map((f, i) => (
          <div
            key={i}
            className="absolute transition-all duration-500"
            style={{
              width: `${facetWidth}px`,
              height: `${totalLength}px`,
              left: `-${facetWidth / 2}px`,
              top: `-${outerLength}px`,
              background: f.bg,
              transform: `rotateY(${f.angle}deg) translateZ(${pvcRadius}px)`,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              boxShadow: uvLight ? "inset 0 0 3px rgba(255,255,255,0.8)" : "inset 0 0 2px rgba(0,0,0,0.15)",
            }}
          />
        ))}

        {/* Boca inferior de la boquilla dentro de la cabina (Punta dispensadora) */}
        <div
          className="absolute rounded-full border flex items-center justify-center pointer-events-none transition-all duration-500"
          style={{
            width: `${pvcRadius * 2}px`,
            height: `${pvcRadius * 2}px`,
            left: `-${pvcRadius}px`,
            top: `-${pvcRadius}px`,
            transform: `translateY(${innerLength}px) rotateX(90deg)`,
            background: uvLight ? "#ffffff" : "#f1f5f9",
            borderColor: uvLight ? "#e2e8f0" : "#cbd5e1",
            boxShadow: uvLight ? "0 0 5px rgba(255,255,255,0.7)" : "0 1px 2px rgba(0,0,0,0.25)",
            backfaceVisibility: "visible",
            WebkitBackfaceVisibility: "visible",
          }}
        >
          {/* Orificio hueco interno de salida del agua en la punta */}
          <div
            className="rounded-full bg-[#05090e] shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)]"
            style={{ width: `${pvcRadius * 1.2}px`, height: `${pvcRadius * 1.2}px` }}
          />
        </div>

        {/* Extremo superior del tubo de PVC saliendo en el techo exterior */}
        <div
          className="absolute rounded-full border flex items-center justify-center pointer-events-none"
          style={{
            width: `${pvcRadius * 2}px`,
            height: `${pvcRadius * 2}px`,
            left: `-${pvcRadius}px`,
            top: `-${pvcRadius}px`,
            transform: `translateY(-${outerLength}px) rotateX(-90deg)`,
            background: "#f8fafc",
            borderColor: "#cbd5e1",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            backfaceVisibility: "visible",
            WebkitBackfaceVisibility: "visible",
          }}
        >
          {/* Orificio hueco de la tubería en el extremo exterior */}
          <div
            className="rounded-full bg-slate-600 shadow-inner"
            style={{ width: `${pvcRadius * 1.2}px`, height: `${pvcRadius * 1.2}px` }}
          />
        </div>

        {/* 4. CILINDRO 3D DE AGUA AZUL CRISTALINA CON TONOS TRANSPARENTES DEGRADADOS */}
        {isPouring && (
          <div
            className="absolute left-0 top-0 pointer-events-none"
            style={{
              transform: `translateY(${innerLength}px)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Núcleo interior de brillo líquido */}
            <div
              className="absolute left-0 top-0 pointer-events-none w-[2.5px] -translate-x-1/2 bg-gradient-to-b from-white/95 via-cyan-200/80 to-sky-300/50 blur-[0.4px] animate-pulse z-10"
              style={{ height: `${waterStreamLength}px` }}
            />

            {/* 8 Facetas del cilindro 3D de agua con degradados azules translúcidos */}
            {WATER_FACETS.map((f, i) => (
              <div
                key={i}
                className="absolute top-0 animate-pulse"
                style={{
                  width: `${waterFacetWidth}px`,
                  height: `${waterStreamLength}px`,
                  left: `-${waterFacetWidth / 2}px`,
                  background: f.bg,
                  transform: `rotateY(${f.angle}deg) translateZ(${waterRadius}px)`,
                  backfaceVisibility: "visible",
                  WebkitBackfaceVisibility: "visible",
                  boxShadow: uvLight
                    ? "0 0 6px rgba(56,189,248,0.55), inset 0 0 3px rgba(255,255,255,0.7)"
                    : "0 0 4px rgba(56,189,248,0.35), inset 0 0 2px rgba(255,255,255,0.4)",
                  opacity: uvLight ? 0.95 : 0.85,
                  animationDuration: `${0.75 + (i % 3) * 0.25}s`,
                }}
              />
            ))}

            {/* Anillo de impacto / Ondas de agua en la charola de desagüe inferior */}
            <div
              className="absolute rounded-full border border-cyan-300/80 bg-gradient-to-b from-cyan-400/35 to-blue-500/25 shadow-[0_0_12px_rgba(56,189,248,0.7)] animate-pulse pointer-events-none"
              style={{
                width: `${waterRadius * 5.2}px`,
                height: `${waterRadius * 5.2}px`,
                left: `-${waterRadius * 2.6}px`,
                top: `${waterStreamLength - waterRadius * 2.6}px`,
                transform: "rotateX(90deg)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}


// Componente para la Cara Inferior de Unión: Piso que conecta la cara frontal con la cabina
// Cuenta con iluminación reactiva, textura de acero inoxidable, Charola de Desagüe y Agujero Central Pasante Real
function DrainTrayBridge({ depth, sc = 3.5, uvLight, makeTexOverlay }) {
  // Radio proporcional para el orificio pasante real (diametro aprox 12px en desktop)
  const holeRadius = Math.round(1.7 * sc);
  const ringSize = Math.max(20, Math.round(holeRadius * 2 + 10));

  return (
    <div className="absolute w-full left-0 bottom-0" style={{ transformStyle: "preserve-3d" }}>
      {/* 1. Cara superior visible desde la cabina (Piso interior con charola de desague y orificio central pasante) */}
      <div
        className="absolute w-full left-0 bottom-0 overflow-hidden transition-all duration-500 ease-out"
        style={{
          height: `${depth}px`,
          transform: "rotateX(90deg)",
          transformOrigin: "bottom center",
          background: uvLight
            ? "radial-gradient(ellipse 90% 85% at 50% 20%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 85%), linear-gradient(180deg, #4b5869 0%, #3a4755 50%, #29333e 100%)"
            : "linear-gradient(180deg, #242c36 0%, #1a2028 50%, #13171e 100%)",
          boxShadow: uvLight
            ? "inset 0 0 25px rgba(255,255,255,0.18), inset 0 0 10px rgba(0,0,0,0.4)"
            : "inset 0 0 15px rgba(0,0,0,0.75)",
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 0.5}px, black 100%)`,
          maskImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 0.5}px, black 100%)`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />

        {/* Charola de Desague embutida con parilla simetrica */}
        <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2 pointer-events-none">
          <div
            className={`relative w-[92%] h-[84%] rounded-md flex flex-col items-center justify-between p-1.5 sm:p-2.5 transition-all duration-500 border ${
              uvLight
                ? "border-slate-400/80 bg-gradient-to-b from-[#3b4756] via-[#2f3945] to-[#252e38] shadow-[inset_0_2px_5px_rgba(0,0,0,0.6),0_1px_3px_rgba(255,255,255,0.15)]"
                : "border-slate-700/80 bg-gradient-to-b from-[#1c232b] via-[#151b22] to-[#10141a] shadow-[inset_0_3px_8px_rgba(0,0,0,0.85)]"
            }`}
          >
            {/* Fila Superior de Ranuras */}
            <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2">
              <div
                className={`w-5 sm:w-9 h-1 rounded-full border border-black/50 transition-all duration-500 ${
                  uvLight
                    ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                    : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                }`}
              />
              <div
                className={`w-5 sm:w-9 h-1 rounded-full border border-black/50 transition-all duration-500 ${
                  uvLight
                    ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                    : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                }`}
              />
            </div>

            {/* Fila Central: Ranuras Izquierda + Separador Simetrico + Ranuras Derecha */}
            <div className="w-full flex items-center justify-between px-0.5 sm:px-1">
              {/* Ranuras Izquierdas */}
              <div className="flex flex-col gap-1 items-center flex-1 max-w-[34%]">
                <div
                  className={`w-full max-w-[20px] sm:max-w-[28px] h-1 rounded-full border border-black/50 transition-all duration-500 ${
                    uvLight
                      ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                      : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                  }`}
                />
                <div
                  className={`w-full max-w-[24px] sm:max-w-[32px] h-1 rounded-full border border-black/50 transition-all duration-500 ${
                    uvLight
                      ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                      : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                  }`}
                />
                <div
                  className={`w-full max-w-[20px] sm:max-w-[28px] h-1 rounded-full border border-black/50 transition-all duration-500 ${
                    uvLight
                      ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                      : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                  }`}
                />
              </div>

              {/* Hueco / reserva central simetrica para el aro */}
              <div
                className="shrink-0 pointer-events-none"
                style={{ width: `${ringSize}px` }}
              />

              {/* Ranuras Derechas */}
              <div className="flex flex-col gap-1 items-center flex-1 max-w-[34%]">
                <div
                  className={`w-full max-w-[20px] sm:max-w-[28px] h-1 rounded-full border border-black/50 transition-all duration-500 ${
                    uvLight
                      ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                      : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                  }`}
                />
                <div
                  className={`w-full max-w-[24px] sm:max-w-[32px] h-1 rounded-full border border-black/50 transition-all duration-500 ${
                    uvLight
                      ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                      : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                  }`}
                />
                <div
                  className={`w-full max-w-[20px] sm:max-w-[28px] h-1 rounded-full border border-black/50 transition-all duration-500 ${
                    uvLight
                      ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                      : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                  }`}
                />
              </div>
            </div>

            {/* Fila Inferior de Ranuras */}
            <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2">
              <div
                className={`w-5 sm:w-9 h-1 rounded-full border border-black/50 transition-all duration-500 ${
                  uvLight
                    ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                    : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                }`}
              />
              <div
                className={`w-5 sm:w-9 h-1 rounded-full border border-black/50 transition-all duration-500 ${
                  uvLight
                    ? "bg-[#1e2630] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)]"
                    : "bg-[#0b0e12] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]"
                }`}
              />
            </div>

            {/* Aro Central de Desague: Posicionado exactamente en 50% 50% coincidiendo con la mascara */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center z-10"
              style={{ width: `${ringSize}px`, height: `${ringSize}px` }}
            >
              <div
                className={`w-full h-full rounded-full border-2 flex items-center justify-center transition-all duration-500 relative ${
                  uvLight
                    ? "border-slate-300 bg-slate-500/10 shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                    : "border-slate-600 bg-slate-800/10 shadow-inner"
                }`}
                title="Orificio pasante de salida / Desagüe"
              >
                {/* Aro biselado exterior del orificio */}
                <div
                  className={`rounded-full border transition-all duration-500 ${
                    uvLight ? "border-slate-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" : "border-slate-700 shadow-inner"
                  }`}
                  style={{ width: `${holeRadius * 2 + 2}px`, height: `${holeRadius * 2 + 2}px` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cara inferior exterior visible desde abajo del chasis (Tonos acero cepillado con orificio de salida exterior) */}
      <div
        className="absolute w-full left-0 bottom-0 overflow-hidden pointer-events-none"
        style={{
          height: `${depth}px`,
          transform: "rotateX(90deg) rotateY(180deg)",
          transformOrigin: "bottom center",
          background: STEEL_FINISH.bottom,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 6px rgba(0,0,0,0.7)",
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 0.5}px, black 100%)`,
          maskImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent ${holeRadius}px, black ${holeRadius + 0.5}px, black 100%)`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />

        {/* Orificio / Boquilla de salida exterior de desagüe */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
          style={{ width: `${holeRadius * 4.4}px`, height: `${holeRadius * 4.4}px` }}
        >
          {/* Brida exterior de fijación (Tonos acero cepillado con remaches de montaje) */}
          <div className="absolute inset-0 rounded-full border border-[#5D5C5C] bg-gradient-to-b from-[#ACAAAD] via-[#898889] to-[#5D5C5C] shadow-md flex items-center justify-center">
            {/* 4 Remaches de montaje exterior */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E2E1E4] border border-[#5D5C5C] shadow-xs" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E2E1E4] border border-[#5D5C5C] shadow-xs" />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#E2E1E4] border border-[#5D5C5C] shadow-xs" />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#E2E1E4] border border-[#5D5C5C] shadow-xs" />

            {/* Collarín / Boquilla cilíndrica de salida */}
            <div
              className="rounded-full border-2 border-[#898889] shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]"
              style={{ width: `${holeRadius * 2.8}px`, height: `${holeRadius * 2.8}px` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para la Cabina de Agua 3D (Caja Sólida Externa + Interior Iluminado, Despegada y Flotante)
function WaterCabinBox({ x, y, w, h, depth, floatZ = 0, isPouring, uvLight, hasJug, onToggleLight, makeTexOverlay }) {
  const faceBase = "absolute overflow-hidden";

  return (
    <div
      className="absolute transition-transform duration-500 ease-out"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        transformStyle: "preserve-3d",
        transform: `translateZ(-${floatZ}px)`,
      }}
    >
      {/* 1. CARA TRASERA EXTERIOR (Acero cepillado con acabado industrial) */}
      <div
        className={`${faceBase} inset-0 border flex flex-col items-center justify-center p-2 text-center shadow-inner`}
        style={{
          transform: `translateZ(-${depth}px) rotateY(180deg)`,
          background: STEEL_FINISH.back,
          borderColor: STEEL_FINISH.border,
          boxShadow: "inset 2px 2px 3px rgba(255, 255, 255, 0.45), inset -2px -2px 4px rgba(0, 0, 0, 0.25), inset 0 0 20px rgba(0, 0, 0, 0.15)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 2. CARA LATERAL IZQUIERDA EXTERIOR */}
      <div
        className={`${faceBase} h-full left-0 top-0 origin-left`}
        style={{
          width: `${depth}px`,
          transform: "rotateY(90deg)",
          background: STEEL_FINISH.left,
          boxShadow: "inset 2px 0 3px rgba(255, 255, 255, 0.5), inset -3px 0 5px rgba(0, 0, 0, 0.35)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 3. CARA LATERAL DERECHA EXTERIOR */}
      <div
        className={`${faceBase} h-full right-0 top-0 origin-right`}
        style={{
          width: `${depth}px`,
          transform: "rotateY(-90deg)",
          background: STEEL_FINISH.right,
          boxShadow: "inset -2px 0 3px rgba(255, 255, 255, 0.4), inset 3px 0 5px rgba(0, 0, 0, 0.35)",
          borderRight: "1px solid rgba(50, 50, 50, 0.55)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 4. CARA SUPERIOR EXTERIOR (TECHO) */}
      <div
        className={`${faceBase} w-full left-0 top-0 origin-top`}
        style={{
          height: `${depth}px`,
          transform: "rotateX(-90deg)",
          background: STEEL_FINISH.top,
          boxShadow: "inset 0 2px 3px rgba(255, 255, 255, 0.85), inset 0 -2px 4px rgba(0, 0, 0, 0.15)",
          borderTop: "1px solid rgba(255, 255, 255, 0.75)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 5. CARA INFERIOR EXTERIOR (PISO) */}
      <div
        className={`${faceBase} w-full left-0 bottom-0 origin-bottom`}
        style={{
          height: `${depth}px`,
          transform: "rotateX(90deg)",
          background: STEEL_FINISH.bottom,
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -2px 6px rgba(0, 0, 0, 0.7)",
          borderBottom: "1px solid rgba(50, 50, 50, 0.75)",
          backfaceVisibility: "visible",
          WebkitBackfaceVisibility: "visible",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* 6. PARED TRASERA INTERIOR (Acero gris oscuro satinado con luz blanca difuminada) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-between p-2 overflow-hidden transition-all duration-500 ease-out"
        style={{
          transform: `translateZ(-${depth}px)`,
          background: uvLight
            ? "radial-gradient(ellipse 90% 85% at 50% 2%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.12) 45%, rgba(255, 255, 255, 0.02) 80%, transparent 100%), linear-gradient(180deg, #64748b 0%, #526072 45%, #384452 100%)"
            : "linear-gradient(180deg, #374151 0%, #28313e 50%, #1a2028 100%)",
          boxShadow: isPouring
            ? "inset 0 0 35px rgba(255,255,255,0.35), inset 0 0 15px rgba(0,0,0,0.3)"
            : uvLight
            ? "inset 0 0 30px rgba(255,255,255,0.22), inset 0 0 15px rgba(0,0,0,0.35)"
            : "inset 0 0 25px rgba(0,0,0,0.65)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />

        {/* Foquito LED Superior Delgado */}
        <div className="relative z-10 flex flex-col items-center pt-0.5" data-ui="true">
          {/* Foquito LED interactivo: delgado, mas pequeno y ubicado bien arriba */}
          <div
            data-ui="true"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLight();
            }}
            className={`w-7 h-2 rounded-full border flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer ${
              uvLight
                ? "bg-white border-slate-100 shadow-[0_0_14px_rgba(255,255,255,0.95),0_0_26px_rgba(255,255,255,0.6)] scale-105"
                : "bg-slate-600 border-slate-500 hover:border-slate-400"
            }`}
            title="Clic para encender/apagar luz blanca"
          >
            <div
              className={`w-3.5 h-0.5 rounded-full transition-all duration-300 pointer-events-none ${
                uvLight ? "bg-white shadow-[0_0_6px_#ffffff]" : "bg-slate-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* 7. HAZ DIFUMINADO DE LUZ BLANCA (Abarca ampliamente la cabina con difusión suave) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
        style={{
          transform: `translateZ(-${depth * 0.45}px)`,
          opacity: uvLight ? 0.42 : 0,
          background:
            "radial-gradient(ellipse 85% 90% at 50% 0%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.15) 40%, rgba(255, 255, 255, 0.03) 75%, transparent 100%)",
          filter: "blur(6px)",
          mixBlendMode: "screen",
        }}
      />

      {/* 8. RESPLANDOR AMBIENTAL TENUE Y ENVOLVENTE */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out"
        style={{
          transform: `translateZ(-${depth * 0.65}px)`,
          opacity: uvLight ? 0.30 : 0,
          background: "radial-gradient(ellipse 80% 80% at 50% 20%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.06) 55%, transparent 85%)",
          filter: "blur(10px)",
          mixBlendMode: "screen",
        }}
      />

      {/* 9. PAREDES INTERIORES CON ACERO GRIS Y LUZ BLANCA ENVOLVENTE */}
      {/* Pared Interior Izquierda */}
      <div
        className="absolute h-full left-0 top-0 origin-left transition-all duration-500 pointer-events-none overflow-hidden"
        style={{
          width: `${depth}px`,
          transform: "rotateY(90deg)",
          background: uvLight
            ? "radial-gradient(ellipse 80% 70% at 95% 15%, rgba(255, 255, 255, 0.22) 0%, transparent 75%), linear-gradient(90deg, #333d4b 0%, #475569 40%, #5c6b7e 85%, #3d4a59 100%)"
            : "linear-gradient(90deg, #1e242c 0%, #28313c 40%, #333d4b 85%, #222932 100%)",
          boxShadow: uvLight ? "inset 0 0 15px rgba(255,255,255,0.12), inset 0 0 12px rgba(0,0,0,0.3)" : "inset 0 0 15px rgba(0,0,0,0.6)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* Pared Interior Derecha */}
      <div
        className="absolute h-full right-0 top-0 origin-right transition-all duration-500 pointer-events-none overflow-hidden"
        style={{
          width: `${depth}px`,
          transform: "rotateY(-90deg)",
          background: uvLight
            ? "radial-gradient(ellipse 80% 70% at 5% 15%, rgba(255, 255, 255, 0.22) 0%, transparent 75%), linear-gradient(90deg, #3d4a59 0%, #5c6b7e 15%, #475569 60%, #333d4b 100%)"
            : "linear-gradient(90deg, #222932 0%, #333d4b 15%, #28313c 60%, #1e242c 100%)",
          boxShadow: uvLight ? "inset 0 0 15px rgba(255,255,255,0.12), inset 0 0 12px rgba(0,0,0,0.3)" : "inset 0 0 15px rgba(0,0,0,0.6)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* Techo Interior */}
      <div
        className="absolute w-full left-0 top-0 origin-top transition-all duration-500 pointer-events-none overflow-hidden"
        style={{
          height: `${depth}px`,
          transform: "rotateX(-90deg)",
          background: uvLight
            ? "radial-gradient(ellipse 70% 85% at 50% 100%, rgba(255, 255, 255, 0.32) 0%, transparent 80%), linear-gradient(180deg, #64748b 0%, #4f5d6f 60%, #374351 100%)"
            : "linear-gradient(180deg, #374151 0%, #28313c 60%, #1a2027 100%)",
          boxShadow: uvLight ? "inset 0 -8px 20px rgba(255,255,255,0.22), inset 0 0 10px rgba(0,0,0,0.3)" : "inset 0 -6px 12px rgba(0,0,0,0.6)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>

      {/* Piso Interior */}
      <div
        className="absolute w-full left-0 bottom-0 origin-bottom transition-all duration-500 pointer-events-none overflow-hidden"
        style={{
          height: `${depth}px`,
          transform: "rotateX(90deg)",
          background: uvLight
            ? "radial-gradient(ellipse 75% 75% at 50% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 80%), linear-gradient(180deg, #3d4a59 0%, #526071 60%, #2a3440 100%)"
            : "linear-gradient(180deg, #1c222a 0%, #28313c 60%, #151a20 100%)",
          boxShadow: uvLight ? "inset 0 8px 18px rgba(255,255,255,0.12), inset 0 0 10px rgba(0,0,0,0.3)" : "inset 0 6px 12px rgba(0,0,0,0.6)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div style={makeTexOverlay()} />
      </div>
    </div>
  );
}

export default VendingPrecise3D;
