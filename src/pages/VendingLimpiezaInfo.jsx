import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import CardFeatureKey from "../components/CardFeatureKey";

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
      <Helmet>
        <title>Vending de Productos de Limpieza - Darmax</title>
        <meta
          name="description"
          content="Automatiza la venta de detergentes, cloro y suavizantes con pago mixto y pantalla táctil. Reduce residuos con recarga y mejora tu margen con insumos a granel."
        />
      </Helmet>
      
      {/* ===== Header blanco + banner full-bleed ===== */}
      <section className="bg-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-6">
          <h2 className="text-2xl md:text-4xl font-extrabold italic text-slate-900">
            Conoce más
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Mejora tu margen con insumos a granel
          </p>
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2">
          <div className="relative h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden">
            <img
              src={HERO_IMG}
              alt="Vending de limpieza Darmax"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== Bloque de color pegado ===== */}
      <section className="relative -mt-4">
        <div className="bg-gradient-to-tr from-fuchsia-800 via-pink-700 to-rose-700">
          <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-14">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold italic text-white leading-tight">
                Vending de <span className="not-italic text-[#ccff00]">Productos de Limpieza</span>
              </h1>
              <p className="mt-7 max-w-4xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
                Automatiza la venta de detergentes, cloro y suavizantes con pago mixto y pantalla táctil. Reduce residuos con recarga y mejora tu margen con insumos a granel.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="flex flex-col items-center justify-center min-h-[120px] rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-5 text-center text-white"
                >
                  <div className="text-3xl">{h.icon}</div>
                  <div className="text-base font-semibold leading-tight mt-2">{h.title}</div>
                  <div className="text-sm italic text-white/80">{h.desc}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
          
          <svg className="w-full block -mb-px" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,56 C240,0 960,160 1440,56 L1440,140 L0,140 Z" />
          </svg>
        </div>
      </section>

      {/* Especificaciones */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Características clave
        </h2>
        <p className="text-slate-600 text-center mt-2">
          Todo lo que necesitas para operar con eficiencia y buena experiencia de usuario.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {especificacionesLimpieza.map((e, i) => (
            <CardFeatureKey
              key={i}
              imagen={e.imagen}
              titulo={e.titulo}
              descripcion={e.descripcion}
            />
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
          {[HERO_IMG, "/img/vending/productoslimpieza5.png", "/img/vending/9productos.jpeg", "/img/vending/productoslimpieza8.png"].map(
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
