import * as React from 'react';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Breadcrumbs para la navegación por pasos.
 * Muestra el paso actual y los pasos anteriores como enlaces clicables.
 * Los pasos futuros no se renderizan.
 */
export default function Breadcrumbs({ steps, currentStepIndex, onStepClick }) {
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
    <div role="presentation" className="flex items-center w-full overflow-x-auto no-scrollbar scroll-smooth">
      <MuiBreadcrumbs 
        aria-label="breadcrumb"
        separator={<span className="text-slate-300 mx-0.5 text-[7px] sm:text-[10px]">/</span>}
        className="flex-nowrap whitespace-nowrap min-w-max px-0.5"
      >
        {steps.map((step, index) => {
          if (index > currentStepIndex) return null;

          const isLast = index === currentStepIndex;

          if (isLast) {
            return (
              <Typography 
                key={step.label} 
                className="text-[#168387] font-black text-[7px] sm:text-[10px] tracking-[0.05em] sm:tracking-[0.2em] uppercase"
              >
                {step.label}
              </Typography>
            );
          }

          return (
            <Link
              key={step.label}
              underline="none"
              color="inherit"
              href={step.path || "#"}
              onClick={(e) => handleLinkClick(e, step.path, index)}
              className="text-slate-400 hover:text-slate-900 font-black text-[7px] sm:text-[10px] tracking-[0.05em] sm:tracking-[0.2em] uppercase transition-colors"
            >
              {step.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </div>
  );
}

