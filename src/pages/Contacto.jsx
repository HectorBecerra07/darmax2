import React from "react";
import { motion } from "framer-motion";
import Calendar from "../components/Calendar";
import SEO from "../components/SEO";
import { 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from "@heroicons/react/24/outline";

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function Contacto() {
  return (
    <>
      <SEO 
        title="Contacto | Agenda tu Asesoría"
        description="Ponte en contacto con los expertos de Darmax. Agenda una reunión personalizada para iniciar tu negocio de agua purificada."
      />
      
      <main className="min-h-screen bg-[#fbfbfd] pt-24 font-montserrat not-italic">
        {/* SECCIÓN HEADER & CALENDARIO (UNIFICADO) */}
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <motion.div 
            {...fadeInUp}
            className="w-full mb-10 flex flex-col md:flex-row justify-between items-end gap-10"
          >
            <div className="max-w-4xl text-left">
              <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block">
                Atención Personalizada
              </span>
              <h1 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-3 sm:mb-4 text-[#031638]">
                Agenda una reunión con un{" "}
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                  asesor experto
                </span>
              </h1>
              <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-3xl">
                ¿Tienes dudas sobre cómo iniciar? Selecciona el horario que mejor te convenga y recibe una asesoría gratuita.
              </p>
            </div>
          </motion.div>

          {/* Calendario como SECCIÓN ABIERTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full min-h-[600px] relative z-10"
          >
            <div className="w-full flex justify-center">
              <Calendar />
            </div>
          </motion.div>
        </section>

        {/* SECCIÓN OTROS MEDIOS (FONDO TURQUESA PREMIUM) */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] overflow-hidden relative shadow-[inset_0_20px_50px_rgba(0,0,0,0.05)]">
          {/* Decoración Parallax Sutil */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:32px_32px]" />
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <span className="font-montserrat not-italic text-cyan-200 font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-2 block">
                Canales Directos
              </span>
              <h2 className="font-montserrat not-italic text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Otras formas de contactarnos
              </h2>
              <p className="text-cyan-50/90 font-montserrat not-italic text-sm sm:text-base font-normal leading-relaxed max-w-xl mx-auto mt-3">
                Atención inmediata y personalizada
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { label: "WhatsApp", value: "+52 55 1965 5369", link: "https://wa.me/525519655369", icon: ChatBubbleLeftRightIcon },
                { label: "Correo Electrónico", value: "contacto@darmaxagua.mx", link: "mailto:contacto@darmaxagua.mx", icon: EnvelopeIcon },
                { label: "Ubicación Principal", value: "Bosques de Aragón, Nezahualcóyotl", link: "https://maps.google.com/?q=Blvd.+de+los+Continentes+85,+Bosques+de+Aragón,+57170+Cdad.+Nezahualcóyotl,+Méx.", icon: MapPinIcon }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={idx}
                    href={item.link}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="p-8 sm:p-10 bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl backdrop-blur-xl hover:bg-white/20 transition-all group flex flex-col items-center text-center shadow-lg"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#168387] flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <p className="font-montserrat not-italic text-[10px] sm:text-xs font-bold uppercase text-cyan-100/70 tracking-[0.2em] mb-2 transition-colors">{item.label}</p>
                    <p className="font-montserrat not-italic text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">{item.value}</p>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
