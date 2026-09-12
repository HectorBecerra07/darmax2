import { useEffect } from "react";

let activeInstances = 0;
let cleanUpFn = null;

/**
 * Hook para suavizar y hacer un poco más pausado el scroll de rueda de ratón (wheel).
 * Reduce la velocidad de avance agresiva de cada tick en ~25% y amortigua el movimiento
 * con interpolación fluida (requestAnimationFrame), sin afectar el scroll táctil móvil.
 *
 * @param {Object} options
 * @param {number} options.speed - Multiplicador de avance por tick (0.75 = ~25% mas pausado)
 * @param {number} options.damping - Factor de amortiguacion/lerp (0.09 = transicion suave)
 * @param {boolean} options.enabled - Si el efecto esta activo
 */
export function usePacedScroll({ speed = 0.75, damping = 0.09, enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    // No interferir en dispositivos exclusivamente tactiles
    if (window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      return;
    }

    activeInstances++;

    if (activeInstances === 1) {
      let targetY = window.scrollY;
      let currentY = window.scrollY;
      let rafId = null;
      let isWheeling = false;
      let wheelTimeout = null;

      const isScrollableElement = (el) => {
        let current = el;
        while (current && current !== document.body && current !== document.documentElement) {
          const style = window.getComputedStyle(current);
          const overflowY = style.overflowY;
          const hasScroll = (overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight;
          if (hasScroll) return true;
          current = current.parentElement;
        }
        return false;
      };

      const updateScroll = () => {
        const diff = targetY - currentY;
        if (Math.abs(diff) < 0.5) {
          currentY = targetY;
          window.scrollTo({ top: currentY, behavior: "instant" });
          rafId = null;
          return;
        }

        currentY += diff * damping;
        window.scrollTo({ top: currentY, behavior: "instant" });
        rafId = requestAnimationFrame(updateScroll);
      };

      const onWheel = (e) => {
        // Permitir zoom con Ctrl + rueda o scroll dentro de modales y contenedores secundarios
        if (e.ctrlKey || isScrollableElement(e.target)) return;

        e.preventDefault();

        let delta = e.deltaY;
        if (e.deltaMode === 1) delta *= 20; // Modo lineas (Firefox)
        else if (e.deltaMode === 2) delta *= window.innerHeight; // Modo paginas

        // Reduccion controlada de velocidad para hacerlo mas pausado
        delta *= speed;

        const maxScroll = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        );

        targetY = Math.max(0, Math.min(maxScroll, targetY + delta));

        isWheeling = true;
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          isWheeling = false;
        }, 200);

        if (!rafId) {
          currentY = window.scrollY;
          rafId = requestAnimationFrame(updateScroll);
        }
      };

      const onNativeScroll = () => {
        // Si el usuario hace scroll mediante barra lateral, teclas de navegacion o hash
        if (!isWheeling && !rafId) {
          targetY = window.scrollY;
          currentY = window.scrollY;
        }
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("scroll", onNativeScroll, { passive: true });

      cleanUpFn = () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("scroll", onNativeScroll);
        if (rafId) cancelAnimationFrame(rafId);
        clearTimeout(wheelTimeout);
      };
    }

    return () => {
      activeInstances--;
      if (activeInstances <= 0) {
        activeInstances = 0;
        if (cleanUpFn) {
          cleanUpFn();
          cleanUpFn = null;
        }
      }
    };
  }, [speed, damping, enabled]);
}

export default usePacedScroll;
