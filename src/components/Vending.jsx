import React, { useEffect, useMemo, useRef, useState } from "react";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const VendingPrecise3D = ({ showCallouts: propShowCallouts }) => {
  const [rotation, setRotation] = useState({ x: -10, y: -12 });
  const [isDragging, setIsDragging] = useState(false);
  const [internalShowCallouts, setInternalShowCallouts] = useState(true);
  const showCallouts = propShowCallouts !== undefined ? propShowCallouts : internalShowCallouts;
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const modelRef = useRef(null);
  const rotationRef = useRef({ x: -10, y: -12 });
  const lastRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const inertiaRafRef = useRef(null);
  const frameRafRef = useRef(null);

  // Determinar escala dinamica equilibrada para que quepa con sus tarjetas dentro del recuadro
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const sc = isMobile ? 2.0 : isTablet ? 2.45 : 2.65;
  
  const totalS = 80.5 * sc;
  const fThick = 2 * sc;

  const waterW = 32 * sc;
  const waterH = 60 * sc;
  const waterD = 31.5 * sc - fThick;

  const coinW = 37.5 * sc;
  const coinH = 45.5 * sc;
  const coinD = 28 * sc - fThick;

  const tapasW = 20.5 * sc;
  const tapasH = 26.5 * sc;
  const tapasD = 15 * sc - fThick;

  const gap = 3 * sc;
  const totalBlocksW = waterW + gap + coinW;
  const startX = (totalS - totalBlocksW) / 2;

  const updateModelTransform = () => {
    if (modelRef.current) {
      modelRef.current.style.transform = `rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`;
    }
  };

  const stopInertia = () => {
    if (inertiaRafRef.current) cancelAnimationFrame(inertiaRafRef.current);
    inertiaRafRef.current = null;
  };

  const startInertia = () => {
    stopInertia();
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

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    lastRef.current = { x: e.clientX, y: e.clientY };
    stopInertia();
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
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    if (!isDragging) return;
    setIsDragging(false);
    
    // Sincronizar estado final con React
    setRotation({ ...rotationRef.current });

    if (Math.abs(velRef.current.vx) > 0.1 || Math.abs(velRef.current.vy) > 0.1) {
      startInertia();
    }
  };

  useEffect(() => {
    return () => {
      stopInertia();
      if (frameRafRef.current) cancelAnimationFrame(frameRafRef.current);
    };
  }, []);

  // =========================
  // MODELO
  // =========================
  const zFix = 0.35;

  const METAL_TEX_URL = "/img/textures/metal_brushed.png";

  const baseMetal = useMemo(
    () => ({
      backgroundImage: `
        linear-gradient(180deg,
          #c9ced4 0%,
          #b4bac1 35%,
          #d6dbe0 55%,
          #aeb4bb 100%
        )
      `,
      border: "1px solid rgba(0,0,0,0.22)",
      boxShadow: "none",
      backfaceVisibility: "visible",
      WebkitBackfaceVisibility: "visible",
      willChange: "transform",
    }),
    []
  );

  const makeTexOverlay = (deg) => ({
    position: "absolute",
    inset: 0,
    backgroundImage: `url('${METAL_TEX_URL}')`,
    backgroundRepeat: "repeat",
    backgroundSize: "260px 260px",
    backgroundPosition: "center",
    opacity: 0.28,
    mixBlendMode: "soft-light",
    transform: `rotate(${deg}deg)`,
    transformOrigin: "center",
    pointerEvents: "none",
  });

  const frameMetal = useMemo(
    () => ({
      backgroundImage: `
        linear-gradient(180deg,
          #e7edf2 0%,
          #c4ccd4 25%,
          #e3e9ef 55%,
          #b7c0c9 100%
        )
      `,
      border: "1px solid rgba(0,0,0,0.20)",
      boxShadow: "none",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      willChange: "transform",
    }),
    []
  );

  const cabinFaceBase = "absolute overflow-hidden";
  const metalFrameBase = "absolute overflow-hidden";

  const faceBack = (depth) => ({ transform: `translateZ(-${depth - zFix}px)`, ...baseMetal });
  const faceLeft = (depth) => ({ width: depth, transform: `rotateY(90deg) translateZ(${zFix}px)`, ...baseMetal });
  const faceRight = (depth) => ({ width: depth, transform: `rotateY(-90deg) translateZ(${zFix}px)`, ...baseMetal });
  const faceTop = (depth) => ({ height: depth, transform: `rotateX(-90deg) translateZ(${zFix}px)`, ...baseMetal });
  const faceBottom = (depth) => ({ height: depth, transform: `rotateX(90deg) translateZ(${zFix}px)`, ...baseMetal });

  const Face = ({ className = "", style = {}, texDeg = 0 }) => (
    <div className={`${cabinFaceBase} ${className}`} style={style}>
      <div style={makeTexOverlay(texDeg)} />
    </div>
  );

  const TEX_FB = 0;
  const TEX_LR = 90;
  const TEX_TB = 0;

  // Callouts optimizados para mantenerse contenidos y no desbordar
  const CALLOUTS = [
    {
      id: "agua",
      title: "Módulo Agua",
      body: "Despacho automático de garrafón.",
      side: "left",
      bubble: { x: -2, y: 44 },
      to: { x: 30, y: 44 },
    },
    {
      id: "monedas",
      title: "Monedero",
      body: "Validación multimoneda.",
      side: "right",
      bubble: { x: 102, y: 16 },
      to: { x: 78, y: 16 },
    },
    {
      id: "pantalla",
      title: "Pantalla Touch",
      body: "Interfaz táctil guiada.",
      side: "right",
      bubble: { x: 102, y: 48 },
      to: { x: 76, y: 48 },
    },
    {
      id: "tapas",
      title: "Dispensador Tapas",
      body: "Entrega automática de tapas.",
      side: "right",
      bubble: { x: 102, y: 80 },
      to: { x: 76, y: 80 },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center font-montserrat not-italic w-full h-full">
      <div className="relative mx-auto w-full flex items-center justify-center">
        <div
          className="relative mx-auto"
          style={{
            width: totalS,
            height: totalS,
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

          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: isDragging ? "none" : "transform 50ms linear",
            }}
            ref={modelRef}
          >
            {/* PANEL FRONTAL */}
            <div className="absolute w-full h-full" style={{ transformStyle: "preserve-3d" }}>
              <div
                className="absolute w-full h-full z-20 bg-cover bg-no-repeat"
                style={{
                  transform: `translateZ(${fThick / 2}px)`,
                  backgroundImage: `url('/img/vending/vendingmodelcss.png')`,
                  backgroundSize: "100% 100%",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
              <div
                className="absolute w-full h-full"
                style={{
                  transform: `translateZ(-${fThick / 2}px) rotateY(180deg)`,
                  ...frameMetal,
                }}
              />

              <div className={`${metalFrameBase} h-full left-0 origin-left`} style={{ width: fThick, transform: "rotateY(90deg)", ...frameMetal }} />
              <div className={`${metalFrameBase} h-full right-0 origin-right`} style={{ width: fThick, transform: "rotateY(-90deg)", ...frameMetal }} />
              <div className={`${metalFrameBase} w-full top-0 origin-top`} style={{ height: fThick, transform: "rotateX(-90deg)", ...frameMetal }} />
              <div className={`${metalFrameBase} w-full bottom-0 origin-bottom`} style={{ height: fThick, transform: "rotateX(90deg)", ...frameMetal }} />
            </div>

            {/* ESTRUCTURA TRASERA */}
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                transformStyle: "preserve-3d",
                transform: `translateZ(-${fThick / 2}px)`,
              }}
            >
              <Face
                className="w-full h-full"
                style={{
                  ...baseMetal,
                  transform: `translateZ(-${zFix}px)`,
                }}
                texDeg={TEX_FB}
              />

              {/* BLOQUE AGUA */}
              <div className="absolute top-[35px]" style={{ left: startX, width: waterW, height: waterH, transformStyle: "preserve-3d" }}>
                <Face className="w-full h-full" style={faceBack(waterD)} texDeg={TEX_FB} />
                <Face className="h-full left-0 origin-left" style={faceLeft(waterD)} texDeg={TEX_LR} />
                <Face className="h-full right-0 origin-right" style={faceRight(waterD)} texDeg={TEX_LR} />
                <Face className="w-full top-0 origin-top" style={faceTop(waterD)} texDeg={TEX_TB} />
                <Face className="w-full bottom-0 origin-bottom" style={faceBottom(waterD)} texDeg={TEX_TB} />
              </div>

              {/* BLOQUE MONEDAS */}
              <div className="absolute top-[20px]" style={{ left: startX + waterW + gap, width: coinW, height: coinH, transformStyle: "preserve-3d" }}>
                <Face className="w-full h-full" style={faceBack(coinD)} texDeg={TEX_FB} />
                <Face className="h-full right-0 origin-right" style={faceRight(coinD)} texDeg={TEX_LR} />
                <Face className="h-full left-0 origin-left" style={faceLeft(coinD)} texDeg={TEX_LR} />
                <Face className="w-full top-0 origin-top" style={faceTop(coinD)} texDeg={TEX_TB} />
                <Face className="w-full bottom-0 origin-bottom" style={faceBottom(coinD)} texDeg={TEX_TB} />
              </div>

              {/* BLOQUE TAPAS */}
              <div
                className="absolute bottom-[10px]"
                style={{
                  left: startX + waterW + gap + (coinW - tapasW) / 2,
                  width: tapasW,
                  height: tapasH,
                  transformStyle: "preserve-3d",
                }}
              >
                <Face className="w-full h-full" style={faceBack(tapasD)} texDeg={TEX_FB} />
                <Face className="h-full right-0 origin-right" style={faceRight(tapasD)} texDeg={TEX_LR} />
                <Face className="h-full left-0 origin-left" style={faceLeft(tapasD)} texDeg={TEX_LR} />
                <Face className="w-full top-0 origin-top" style={faceTop(tapasD)} texDeg={TEX_TB} />
                <Face className="w-full bottom-0 origin-bottom" style={faceBottom(tapasD)} texDeg={TEX_TB} />
              </div>
            </div>
          </div>

          {/* CALLOUTS (Solo visibles en tablet/escritorio) */}
          {showCallouts && !isMobile && (
            <div className="block">
              <svg className="absolute inset-0 pointer-events-none z-[40]" viewBox="0 0 100 100" preserveAspectRatio="none">
                {CALLOUTS.map((c) => (
                  <g key={c.id}>
                    <line
                      x1={c.bubble.x}
                      y1={c.bubble.y}
                      x2={c.to.x}
                      y2={c.to.y}
                      stroke="rgba(22,131,135,0.45)"
                      strokeWidth="0.8"
                      strokeDasharray="2 1.5"
                    />
                    <circle cx={c.to.x} cy={c.to.y} r="1.4" fill="#168387" />
                    <circle cx={c.bubble.x} cy={c.bubble.y} r="1.1" fill="#168387" />
                  </g>
                ))}
              </svg>

              {CALLOUTS.map((c) => (
                <div
                  key={c.id}
                  data-ui="true"
                  className="absolute z-[50]"
                  style={{
                    left: `${c.bubble.x}%`,
                    top: `${c.bubble.y}%`,
                    transform: c.side === "left" ? "translate(-100%, -50%)" : "translate(0%, -50%)",
                    pointerEvents: "auto",
                  }}
                >
                  <div className="w-[124px] sm:w-[132px] rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur px-2.5 py-1.5 shadow-md shadow-slate-900/5 transition-transform hover:scale-105">
                    <div className="text-[11px] font-bold text-slate-900 leading-tight font-montserrat not-italic whitespace-nowrap">{c.title}</div>
                    <div className="text-[9.5px] text-slate-500 leading-snug mt-0.5 font-montserrat not-italic">{c.body}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendingPrecise3D;
