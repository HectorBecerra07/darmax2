import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import HeroBannerSlide from './HeroBannerSlide';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const imagenes = [
  // "/img/IMAGENES PARA WEB DARMAX 29 JUL/CARRUSEL PROMOCIONES 1.png",
  // "/img/IMAGENES PARA WEB DARMAX 29 JUL/carrusel PROMOSIONES 2.png",
  // "/img/PROMOCIONES/PROMOCION1.png",
  // "/img/PROMOCIONES/PROMOCION3.jpg",
];

export default function HeroCarousel({ className }) {
  const hasCarouselImages = imagenes.length > 0;

  // If no images, just render the HeroBannerSlide directly, taking full width
  if (!hasCarouselImages) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        <div className="w-full aspect-video max-h-[600px]">
          <HeroBannerSlide />
        </div>
      </div>
    );
  }

  // If there are images, render the full Swiper carousel
  return (
    <div className={`relative w-full hero-carousel-container overflow-hidden ${className}`}>
      <style>{`
        @media (min-width: 640px) {
          .hero-carousel-container .swiper-slide {
            opacity: 0.4;
            transition: opacity 0.6s ease;
          }
          .hero-carousel-container .swiper-slide-active {
            opacity: 1;
          }
        }
        .hero-carousel-container .swiper-pagination {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 20px; /* Adjust as needed */
        }
        .hero-carousel-container .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .hero-carousel-container .swiper-pagination-bullet-active {
          background-color: #ffffff;
        }
      `}</style>
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        speed={600}
        className="w-full aspect-video max-h-[600px]"
        breakpoints={{
          // mobile
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: false,
          },
          // desktop
          640: {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: true,
          }
        }}
      >
        <SwiperSlide className="w-full sm:w-[75%]">
            <HeroBannerSlide />
        </SwiperSlide>
        {imagenes.map((src, idx) => (
          <SwiperSlide 
            key={idx} 
            className="w-full sm:w-[75%]"
          >
            <img
              src={src}
              alt={`Promoción Darmax ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
