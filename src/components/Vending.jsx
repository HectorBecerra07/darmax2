import React, { useEffect, useMemo, useRef, useState } from "react";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const VendingPrecise3D = () => {
  // ✅ Más frontal al inicio
  const [rotation, setRotation] = useState({ x: -10, y: -12 });

  // ✅ Toggle burbujas
  const [showCallouts, setShowCallouts] = useState(true);

  // =========================
  // DRAG + INERCIA
  // =========================
  const isDraggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const inertiaRafRef = useRef(null);

  const stopInertia = () => {
    if (inertiaRafRef.current) {
      cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  };

  const startInertia = () => {
    stopInertia();

    const friction = 0.92;
    const minSpeed = 0.03;

    const tick = () => {
      const { vx, vy } = velRef.current;

      setRotation((r) => {
        const nextY = r.y + vx;
        const nextX = clamp(r.x - vy, -85, 85);
        return { x: nextX, y: nextY };
      });

      velRef.current.vx *= friction;
      velRef.current.vy *= friction;

      if (Math.abs(velRef.current.vx) < minSpeed && Math.abs(velRef.current.vy) < minSpeed) {
        velRef.current = { vx: 0, vy: 0 };
        inertiaRafRef.current = null;
        return;
      }

      inertiaRafRef.current = requestAnimationFrame(tick);
    };

    inertiaRafRef.current = requestAnimationFrame(tick);
  };

  // ✅ Si el usuario toca UI (botón/burbuja), NO iniciar drag ni capturar pointer
  const isUIElement = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('[data-ui="true"]'));
  };

  const onPointerDown = (e) => {
    if (isUIElement(e.target)) return; // <- clave para que el botón funcione

    e.currentTarget.setPointerCapture?.(e.pointerId);
    isDraggingRef.current = true;
    lastRef.current = { x: e.clientX, y: e.clientY };

    stopInertia();
    velRef.current = { vx: 0, vy: 0 };
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };

    const s = 0.22;

    setRotation((r) => {
      const nextY = r.y + dx * s;
      const nextX = clamp(r.x - dy * s, -85, 85);
      return { x: nextX, y: nextY };
    });

    velRef.current.vx = velRef.current.vx * 0.65 + dx * s * 0.35;
    velRef.current.vy = velRef.current.vy * 0.65 + dy * s * 0.35;
  };

  const endDrag = (e) => {
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}

    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const { vx, vy } = velRef.current;
    if (Math.abs(vx) > 0.2 || Math.abs(vy) > 0.2) startInertia();
  };

  useEffect(() => {
    return () => stopInertia();
  }, []);

  // =========================
  // MODELO
  // =========================
  const sc = 5;
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

  // Callouts
  const CALLOUTS = [
    {
      id: "agua",
      title: "Módulo Agua",
      body: "Área principal para recibir el garrafón y despacho.",
      side: "left",
      bubble: { x: 8, y: 36 },
      to: { x: 30, y: 44 },
    },
    {
      id: "monedas",
      title: "Monedero",
      body: "Inserción y validación de monedas.",
      side: "right",
      bubble: { x: 92, y: 9 },
      to: { x: 84, y: 14 },
    },
    {
      id: "pantalla",
      title: "Pantalla Touch",
      body: "Selección de tipo de agua y flujo guiado.",
      side: "right",
      bubble: { x: 92, y: 30 },
      to: { x: 75, y: 33 },
    },
    {
      id: "tapas",
      title: "Dispensador Tapas",
      body: "Entrega de tapas por marca o tipo.",
      side: "right",
      bubble: { x: 92, y: 72 },
      to: { x: 72, y: 82 },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden font-sans p-10">
      <div className="relative" style={{ width: totalS + 360, maxWidth: "95vw" }}>
        <div
          className="relative mx-auto"
          style={{
            width: totalS,
            height: totalS,
            perspective: "2500px",
            touchAction: "none",
            cursor: isDraggingRef.current ? "grabbing" : "grab",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {/* ✅ UI LAYER (no se captura el pointer) */}
          <button
            type="button"
            data-ui="true"
            onClick={(ev) => {
              ev.stopPropagation();
              setShowCallouts((v) => !v);
            }}
            className="absolute right-3 top-3 z-[60] rounded-full px-3 py-2 text-[11px] font-semibold
                       bg-white/70 backdrop-blur border border-slate-200 text-slate-900 hover:bg-white/90 shadow-sm"
            style={{ pointerEvents: "auto" }}
          >
            {showCallouts ? "Ocultar info" : "Mostrar info"}
          </button>

          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: isDraggingRef.current ? "none" : "transform 50ms linear",
            }}
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

          {/* CALLOUTS */}
          {showCallouts && (
            <>
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
            </>
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
