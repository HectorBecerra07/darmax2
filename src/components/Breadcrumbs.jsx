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

  /**
   * Maneja el clic en un enlace de breadcrumb.
   * Navega a la ruta especificada o llama a onStepClick para cambiar el paso del asistente.
   */
  const handleLinkClick = (event, path, index) => {
    event.preventDefault();
    if (path) {
      navigate(path);
    } else if (onStepClick && index !== undefined) {
      onStepClick(index);
    }
  };

  return (
    <div role="presentation">
      <MuiBreadcrumbs aria-label="breadcrumb">
        {steps.map((step, index) => {
          // No renderizar pasos futuros
          if (index > currentStepIndex) {
            return null;
          }

          const isLast = index === currentStepIndex;

          if (isLast) {
            // El último paso (actual) se muestra como texto sin enlace y en negrita
            return (
              <Typography key={step.label} color="text.primary" fontWeight="bold">
                {step.label}
              </Typography>
            );
          }

          // Los pasos anteriores se muestran como enlaces clicables y en negrita
          return (
            <Link
              key={step.label}
              underline="hover"
              color="inherit"
              href={step.path || "#"}
              onClick={(e) => handleLinkClick(e, step.path, index)}
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              {step.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </div>
  );
}

