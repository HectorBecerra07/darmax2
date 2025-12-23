import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const videos = [
   "/img/video1.mp4",
   "/img/video2.mp4",
   "/img/video3.mp4",
   "/img/video1.mp4",
];

const imagenes = [
  
];

export default function HeroCarousel({ className }) {
  // If there are videos, render the full Swiper carousel
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
        {videos.map((src, idx) => (
          <SwiperSlide 
            key={idx} 
            className="w-full sm:w-[75%]"
          >
            <video
              src={src}
              alt={`Video de fondo Darmax ${idx + 1}`}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
