// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si hay un hash (ej: #catalogo), intentamos desplazarnos al elemento
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        requestAnimationFrame(() => {
          const yOffset = -80; // Ajuste para el Navbar
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        });
        return;
      }
    }

    // Si no hay hash, scroll al inicio
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
