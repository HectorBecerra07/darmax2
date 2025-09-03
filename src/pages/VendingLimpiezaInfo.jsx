import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

/* ========= Datos ========= */
const HERO_IMG = "/img/vending/5productos.jpg";

const highlights = [
  { icon: "🧴", title: "Hasta 5 productos", desc: "Cloro, detergente, suavizante y más" },
  { icon: "💳", title: "Pago efectivo", desc: "Efectivo," },
  { icon: "🖥️", title: "Botones", desc: "Flujo de compra intuitivo" },
  { icon: "♻️", title: "Eco-friendly", desc: "Recarga y reutiliza envases" },
];

const especificacionesLimpieza = [
  {
    imagen: "/img/limpieza/dispensador.png",
    titulo: "Dispensador automático",
    descripcion: "Dosifica con precisión el volumen elegido por el cliente.",
  },
  {
    imagen: "/img/limpieza/envases.png",
    titulo: "Envases reutilizables",
    descripcion: "Admite PET y botellas reutilizables para reducir residuos.",
  },
  {
    imagen: "/img/limpieza/productos.png",
    titulo: "Portafolio flexible",
    descripcion: "Configura cloro, detergente, suavizante, desinfectante y más.",
  },

  {
    imagen: "/img/limpieza/formaspago.png",
    titulo: "Pagos en efectivo",
    descripcion: "Monedas, proxima mente billetes, tarjeta y códigos QR compatibles.",
  },
];

const pasos = [
  { icon: "📦", title: "Abastecimiento", desc: "Carga de concentrados y calibración de dosificadores." },
  { icon: "🏷️", title: "Precios", desc: "Define precios por litro y combos promocionales." },
  { icon: "🧽", title: "Limpieza", desc: "Rutina de higiene y purga de líneas para operación segura." },
  { icon: "📣", title: "Promoción", desc: "Visibilidad en punto, cupones y recompra." },
];

const faqs = [
  { q: "¿Qué espacio necesita?", a: "Un área compacta con toma eléctrica y, de ser posible, anclaje al piso/pared." },
  { q: "¿Cada cuándo se recarga?", a: "Depende de la demanda. Te damos guías para planear reabastecimiento." },
  { q: "¿Puedo cambiar los productos?", a: "Sí, puedes reconfigurar sabores/limpiadores y precios desde el panel." },
  { q: "¿Incluye garantía y soporte?", a: "Sí, con capacitación, garantía y soporte técnico Darmax." },
];

/* ========= Componente ========= */
export default function VendingLimpiezaInfo() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => containerRef.current?.scrollIntoView({ behavior: "auto" }), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-800 via-pink-700 to-rose-700" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-[11px] uppercase tracking-widest bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full">
              Conoce más
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Vending de <span className="text-[#ccff00]">Productos de Limpieza</span>
            </h1>
            <p className="mt-3 text-white/80">
              Automatiza la venta de detergentes, cloro y suavizantes con pago mixto y pantalla táctil.
              Reduce residuos con recarga y mejora tu margen con insumos a granel.
            </p>

            {/* Highlights */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-2xl bg-white/10 border border-white/20 text-white p-3 backdrop-blur"
                >
                  <div className="text-2xl">{h.icon}</div>
                  <div className="text-sm mt-1 font-semibold">{h.title}</div>
                  <div className="text-[12px] opacity-80">{h.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/configurar-maquina/Vending-Limpieza"
                className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
                style={{ backgroundColor: "#ccff00" }}
              >
                Configurar mi máquina
              </Link>
              <Link
                to="/productos"
                className="px-6 py-3 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition"
              >
                Ver insumos
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <img
              src={HERO_IMG}
              alt="Vending de limpieza Darmax"
              className="w-full max-w-md object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)]"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </motion.div>
        </div>

        {/* Onda inferior */}
        <svg className="relative z-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#fff" d="M0,64 C240,160 960,0 1440,96 L1440,120 L0,120 Z" />
        </svg>
      </section>

      {/* Especificaciones */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Características clave
        </h2>
        <p className="text-slate-600 text-center mt-2">
          Todo lo que necesitas para operar con eficiencia y buena experiencia de usuario.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {especificacionesLimpieza.map((e, i) => (
            <motion.article
              key={e.titulo + i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition overflow-hidden"
            >
              <div className="h-44 bg-white flex items-center justify-center p-4">
                <img
                  src={e.imagen}
                  alt={e.titulo}
                  className="h-full w-full object-contain"
                  onError={(ev) => (ev.currentTarget.style.display = "none")}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">{e.titulo}</h3>
                <p className="text-sm text-slate-600 mt-1">{e.descripcion}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="rounded-3xl bg-gradient-to-tr from-fuchsia-900 via-pink-800 to-rose-800 text-white p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold">¿Cómo funciona el proyecto?</h2>
          <p className="text-white/85 mt-2 max-w-2xl">
            Te acompañamos desde la planeación hasta la operación diaria con rutinas claras.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pasos.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-4"
              >
                <div className="text-3xl">{p.icon}</div>
                <div className="mt-2 font-bold">{p.title}</div>
                <div className="text-sm text-white/80">{p.desc}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-7">
            <Link
              to="/contacto"
              className="inline-flex px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
              style={{ backgroundColor: "#ccff00" }}
            >
              Solicitar asesoría
            </Link>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">En acción</h2>
        <p className="text-slate-600 text-center mt-2">Vitrinas y ejemplos de configuración.</p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[HERO_IMG, "/img/vending/productoslimpieza5.png", "/img/vending/9productos.png", "/img/vending/productoslimpieza8.png"].map(
            (src, i) => (
              <motion.div
                key={src + i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="h-40 md:h-48 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white"
              >
                <img
                  src={src}
                  alt={`Galería ${i}`}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* FAQ + CTAs */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 divide-y rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {faqs.map((f, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer list-none p-5 md:p-6 font-semibold text-slate-900 flex items-center justify-between">
                {f.q}
                <span className="ml-4 text-slate-400 transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="px-5 md:px-6 pb-6 text-slate-600">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/configurar-maquina/Vending-Limpieza"
            className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
            style={{ backgroundColor: "#ccff00" }}
          >
            Configurar mi máquina
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-slate-900 transition"
          >
            Volver
          </button>
        </div>
      </section>
    </div>
  );
}
