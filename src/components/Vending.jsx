import React, { useEffect, useMemo, useRef, useState } from "react";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const VendingPrecise3D = () => {
  const [rotation, setRotation] = useState({ x: -10, y: -12 });
  const [isDragging, setIsDragging] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);

  const modelRef = useRef(null);
  const rotationRef = useRef({ x: -10, y: -12 });
  const lastRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const inertiaRafRef = useRef(null);
  const frameRafRef = useRef(null);

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
  const sc = 4;
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

  // Callouts optimizados para no ser tapados
  const CALLOUTS = [
    {
      id: "agua",
      title: "Módulo Agua",
      body: "Despacho automático de garrafón.",
      side: "left",
      bubble: { x: 5, y: 45 },
      to: { x: 30, y: 45 },
    },
    {
      id: "monedas",
      title: "Monedero",
      body: "Validación multimoneda.",
      side: "right",
      bubble: { x: 95, y: 15 },
      to: { x: 82, y: 18 },
    },
    {
      id: "pantalla",
      title: "Pantalla Touch",
      body: "Interfaz táctil guiada.",
      side: "right",
      bubble: { x: 105, y: 45 },
      to: { x: 75, y: 38 },
    },
    {
      id: "tapas",
      title: "Dispensador Tapas",
      body: "Entrega automática de tapas.",
      side: "right",
      bubble: { x: 95, y: 80 },
      to: { x: 75, y: 82 },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center font-sans py-4">
      <div className="relative" style={{ width: totalS + 200, maxWidth: "100%" }}>
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
          {/* ✅ UI LAYER (no se captura el pointer) - Visible solo en MD+ */}
          <div className="hidden md:block">
            <button
              type="button"
              data-ui="true"
              onClick={(ev) => {
                ev.stopPropagation();
                setShowCallouts((v) => !v);
              }}
              className="absolute left-0 -top-12 z-[60] rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest
                        bg-white border border-slate-200 text-slate-900 hover:bg-[#168387] hover:text-white hover:border-[#168387] transition-all shadow-sm"
              style={{ pointerEvents: "auto" }}
            >
              {showCallouts ? "Ocultar especificaciones" : "Ver especificaciones"}
            </button>
          </div>

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

          {/* CALLOUTS (Solo visibles en md+) */}
          {showCallouts && (
            <div className="hidden md:block">
              <svg className="absolute inset-0 pointer-events-none z-[40]" viewBox="0 0 100 100" preserveAspectRatio="none">
                {CALLOUTS.map((c) => (
                  <g key={c.id}>
                    <line
                      x1={c.bubble.x}
                      y1={c.bubble.y}
                      x2={c.to.x}
                      y2={c.to.y}
                      stroke="rgba(71,85,105,0.4)"
                      strokeWidth="0.6"
                    />
                    <circle cx={c.to.x} cy={c.to.y} r="1.1" fill="#0ea5e9" />
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
                  <div className="max-w-[220px] rounded-2xl border border-slate-200 bg-white/90 backdrop-blur px-4 py-3 shadow-lg shadow-slate-200/50">
                    <div className="text-[12px] font-bold text-slate-900 leading-tight">{c.title}</div>
                    <div className="text-[11px] text-slate-600 leading-snug mt-1">{c.body}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-slate-500 text-center">
          Arrastra para rotar (mouse o touch). Suelta para ver la inercia.
        </div>
      </div>
    </div>
  );
};

export default VendingPrecise3D;
