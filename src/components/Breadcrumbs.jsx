import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

/**
 * Componente Breadcrumbs optimizado para móvil y escritorio.
 * En móvil reduce pasos intermedios para evitar desbordes y permite
 * expandir/deslizar por tacto sin barra de scroll visible.
 */
export default function Breadcrumbs({ steps = [], currentStepIndex = 0, onStepClick }) {
  const navigate = useNavigate();
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    setMobileExpanded(false);
  }, [currentStepIndex]);

  useEffect(() => {
    if (mobileExpanded && mobileNavRef.current) {
      mobileNavRef.current.scrollTo({
        left: mobileNavRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [mobileExpanded]);

  const handleLinkClick = (event, path, index) => {
    event.preventDefault();
    if (path) {
      navigate(path);
    } else if (onStepClick && index !== undefined) {
      onStepClick(index);
    }
  };

  const visibleSteps = steps
    .map((step, index) => ({ ...step, originalIndex: index }))
    .filter((step) => step.originalIndex <= currentStepIndex);

  const shouldCompactMobile = !mobileExpanded && visibleSteps.length > 3;
  const mobileSteps = shouldCompactMobile
    ? [
        visibleSteps[0],
        { label: "…", isEllipsis: true, originalIndex: -1 },
        visibleSteps[visibleSteps.length - 2],
        visibleSteps[visibleSteps.length - 1],
      ]
    : visibleSteps;

  const renderTrail = (items, isMobileCompactView = false) => (
    <ol className="inline-flex items-center gap-1 sm:gap-2 py-1">
      {items.map((step, idx) => {
        const isFirst = idx === 0;
        const isLast = step.originalIndex === currentStepIndex;

        if (step.isEllipsis) {
          return (
            <li key="ellipsis" className="inline-flex items-center shrink-0">
              <ChevronRightIcon
                className="w-3.5 h-3.5 text-slate-400 mx-0.5 shrink-0"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setMobileExpanded(true)}
                aria-label="Mostrar ruta completa"
                className="px-1.5 py-0.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold text-xs tracking-wider cursor-pointer"
              >
                …
              </button>
            </li>
          );
        }

        const showHomeOnlyOnCompact = isMobileCompactView && isFirst && visibleSteps.length > 2;

        return (
          <li key={`${step.label}-${step.originalIndex}`} className="inline-flex items-center shrink-0">
            {!isFirst && (
              <ChevronRightIcon
                className="w-3.5 h-3.5 text-slate-400 mx-0.5 sm:mx-1 shrink-0"
                aria-hidden="true"
              />
            )}

            {isLast ? (
              <span
                className="inline-flex items-center gap-1.5 text-[#007481] font-bold text-[11px] sm:text-[13px] uppercase tracking-wider whitespace-nowrap"
                aria-current="page"
              >
                {isFirst && <HomeIcon className="w-3.5 h-3.5 shrink-0" />}
                {!showHomeOnlyOnCompact && step.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => handleLinkClick(e, step.path, step.originalIndex)}
                aria-label={showHomeOnlyOnCompact ? step.label : undefined}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-[11px] sm:text-[13px] uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer"
              >
                {isFirst && <HomeIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                {!showHomeOnlyOnCompact && step.label}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      {/* Móvil: compacto al paso anterior/actual y deslizable por tacto sin barra de scroll */}
      <nav
        ref={mobileNavRef}
        aria-label="Ruta de navegación"
        className="flex sm:hidden items-center w-full max-w-full overflow-x-auto scrollbar-hide touch-pan-x scroll-smooth"
      >
        {renderTrail(mobileSteps, true)}
      </nav>

      {/* Escritorio/Tablet: ruta completa */}
      <nav
        aria-label="Ruta de navegación"
        className="hidden sm:inline-flex items-center max-w-full overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {renderTrail(visibleSteps, false)}
      </nav>
    </>
  );
}

