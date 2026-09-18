import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function ShatterLogo({ currentSrc, alt = "Logo Darmax", className = "" }) {
  const [displayedSrc, setDisplayedSrc] = useState(currentSrc);
  const [outgoingSrc, setOutgoingSrc] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstMount = useRef(true);

  const isSwitchingToClean = currentSrc && currentSrc.includes("LogoClean");

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      setDisplayedSrc(currentSrc);
      return;
    }

    if (currentSrc !== displayedSrc) {
      setOutgoingSrc(displayedSrc);
      setDisplayedSrc(currentSrc);
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setOutgoingSrc(null);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [currentSrc, displayedSrc]);

  // Color de la linea de barrido segun el modo entrante
  const sweepColor = isSwitchingToClean ? "#7FB32A" : "#288EB9";

  return (
    <div className="relative inline-flex items-center justify-start select-none h-10 md:h-11">
      {/* Logo saliente: se desvanece suavemente con un ligero desenfoque */}
      {isTransitioning && outgoingSrc && (
        <motion.div
          key={`outgoing-${outgoingSrc}`}
          className="absolute inset-0 flex items-center justify-start pointer-events-none z-10"
          initial={{ opacity: 1, filter: "blur(0px)" }}
          animate={{ opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <img
            src={outgoingSrc}
            alt={alt}
            className={`${className} w-auto object-contain block`}
          />
        </motion.div>
      )}

      {/* Sutil linea de barrido / borrado suave */}
      {isTransitioning && (
        <motion.div
          key="sweep-line"
          className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-30"
          initial={{ left: "0%", opacity: 0.85 }}
          animate={{ left: "100%", opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.25, 1, 0.5, 1] }}
          style={{
            backgroundColor: sweepColor,
            boxShadow: `0 0 8px ${sweepColor}`,
          }}
        />
      )}

      {/* Logo entrante: aparece con barrido horizontal y desvanecido suave */}
      <motion.div
        key={`incoming-${displayedSrc}`}
        className="relative flex items-center justify-start z-20"
        initial={
          isTransitioning
            ? { opacity: 0, filter: "blur(4px)", clipPath: "inset(0 100% 0 0)" }
            : false
        }
        animate={{ opacity: 1, filter: "blur(0px)", clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      >
        <img
          src={displayedSrc}
          alt={alt}
          className={`${className} w-auto object-contain block`}
        />
      </motion.div>
    </div>
  );
}
