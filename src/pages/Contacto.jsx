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
      
      <main className="min-h-screen bg-[#fbfbfd] pt-24">
        {/* SECCIÓN HEADER & CALENDARIO (UNIFICADO) */}
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <motion.div 
            {...fadeInUp}
            className="w-full mb-10 flex flex-col md:flex-row justify-between items-end gap-10"
          >
            <div className="max-w-4xl text-left">
              <span className="text-[#24d4da] font-bold tracking-widest text-xs uppercase mb-3 block">
                Atención Personalizada
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
                Agenda una reunión con un <span className="text-[#168387]">asesor experto</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-3xl">
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

        {/* SECCIÓN OTROS MEDIOS (FONDO OSCURO FLUSH CON FOOTER) */}
        <section className="py-24 bg-slate-900 overflow-hidden relative">
          {/* Decoración Parallax Sutil */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:32px_32px]" />
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-white tracking-tight">Otras formas de contactarnos</h2>
              <p className="text-slate-400 mt-4 font-medium uppercase tracking-widest text-xs">Atención inmediata y personalizada</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl hover:bg-white/10 transition-all group flex flex-col items-center text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#168387]/20 flex items-center justify-center text-[#24d4da] mb-6 shadow-inner border border-white/5">
                      <Icon className="w-7 h-7" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3 group-hover:text-white transition-colors">{item.label}</p>
                    <p className="text-xl font-black text-white tracking-tight leading-none">{item.value}</p>
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
