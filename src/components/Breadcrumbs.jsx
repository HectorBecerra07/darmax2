import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

/**
 * Componente Breadcrumbs optimizado para móvil y escritorio.
 * Muestra el camino de navegación en una cápsula moderna,
 * con soporte táctil, espaciado equilibrado y alta legibilidad.
 */
export default function Breadcrumbs({ steps = [], currentStepIndex = 0, onStepClick }) {
  const navigate = useNavigate();

  const handleLinkClick = (event, path, index) => {
    event.preventDefault();
    if (path) {
      navigate(path);
    } else if (onStepClick && index !== undefined) {
      onStepClick(index);
    }
  };

  return (
    <nav 
      aria-label="Ruta de navegación" 
      className="inline-flex items-center max-w-full overflow-x-auto no-scrollbar scroll-smooth"
    >
      <ol className="inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs">
        {steps.map((step, index) => {
          if (index > currentStepIndex) return null;

          const isLast = index === currentStepIndex;
          const isFirst = index === 0;

          return (
            <li key={step.label} className="inline-flex items-center">
              {!isFirst && (
                <ChevronRightIcon 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 mx-0.5 sm:mx-1 shrink-0" 
                  aria-hidden="true" 
                />
              )}

              {isLast ? (
                <span 
                  className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-[#168387]/10 text-[#168387] font-black text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap"
                  aria-current="page"
                >
                  {isFirst && <HomeIcon className="w-3.5 h-3.5 shrink-0" />}
                  {step.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, step.path, index)}
                  className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer"
                >
                  {isFirst && <HomeIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  {step.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

