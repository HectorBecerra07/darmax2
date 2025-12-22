import React from 'react';

export default function HeroBannerSlide() {
  // Note: The original button scrolled to a specific section.
  // This functionality would need to be re-wired if required.
  const handleButtonClick = () => {
    const section = document.getElementById('calculadora-negocio');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="w-full h-full text-white flex items-center"
      style={{
        backgroundImage: 'url("/img/banner.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-2 md:gap-2 lg:gap-4 w-full max-w-7xl mx-auto px-4">
        {/* Left Column (Image) */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
          <img
            src="/img/logo_darmaxnav.png"
            alt="Logo Darmax"
            className="w-[100px] sm:w-[150px] md:w-[200px] lg:w-[300px] h-auto object-contain"
          />
        </div>

        {/* Center Column (Text) */}
        <div className="w-full lg:w-1/3 text-center flex flex-col items-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Emprende Tu
            <span style={{ color: "#d4ff00" }}> Negocio</span>
          </h1>
          <p className="hidden sm:block text-xs sm:text-base text-white leading-relaxed my-2">
            Con Darmax, inicia tu emprendimiento con purificadoras de agua,
            máquinas vending y productos de limpieza.
          </p>
          <button
            onClick={handleButtonClick}
            className="
              inline-flex items-center justify-center
              text-black font-semibold
              py-2 px-4 sm:py-2.5 sm:px-6 md:px-8
              rounded-full
              shadow
              transition
              hover:brightness-95
              bg-[#d4ff00]
              text-xs sm:text-sm md:text-base
            "
          >
            CALCULA TUS GANANCIAS
          </button>
        </div>

        {/* Right Column (Empty Spacer) */}
        <div className="hidden lg:block lg:w-1/3"></div>
      </div>
    </div>
  );
}
