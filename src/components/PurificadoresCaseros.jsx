import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIA_PURIFICADORES = "PurificadoresCaseros";

const mxn = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(isNaN(n) ? 0 : n);

const normaliza = (v) => (v || "").trim().toLowerCase();

const HERO_BGS_ARRAY = [
  "/img/purificadorescaserosparapagina/bajotarja.jpg",
  "/img/purificadorescaserosparapagina/filtros.png",
  "/img/purificadorescaserosparapagina/instlacion.jpg",
  "/img/purificadorescaserosparapagina/sirviendoagua.jpg",
];

/** ✅ Banner fijo recomendado (corrige tu bug del HERO_BG) */
const HERO_BG = "/img/bannerpurificadores.png";
// ✅ O random:
// const HERO_BG = HERO_BGS_ARRAY[Math.floor(Math.random() * HERO_BGS_ARRAY.length)];

const MODELOS_DEMO = [
  {
    name: "Bajo tarja (RO)",
    subtitle: "Ósmosis inversa",
    img: "/img/purificadorescaserosparapagina/bajotarja.jpg",
    tag: "Top ventas",
  },
  {
    name: "Facil instalación",
    subtitle: "Olvida los garrafones",
    img: "/img/purificadorescaserosparapagina/instlacion.jpg",
    tag: "Fácil instalación",
  },
  {
    name: "Dispensador",
    subtitle: "Punto de uso",
    img: "/img/purificadorescaserosparapagina/sirviendoagua.jpg",
    tag: "Ideal oficina",
  },
  {
    name: "Bajo tarja (Carbón)",
    subtitle: "Sabor + microfiltrado",
    img: "/img/purificadorescaserosparapagina/filtros.png",
    tag: "Equilibrado",
  },
];

export default function PurificadoresCaseros() {
  const navigate = useNavigate();
  const { agregarProducto, carrito } = useCarrito();

  const [purificadores, setPurificadores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculadora de ahorro
  const [garrafonesPorSemana, setGarrafonesPorSemana] = useState(3);
  const [precioGarrafon, setPrecioGarrafon] = useState(55);
  const [costoFiltrosAnual, setCostoFiltrosAnual] = useState(1500);
  const [costoEquipo, setCostoEquipo] = useState(3500);

  useEffect(() => {
    const fetchPurificadores = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/productos`);
        if (!res.ok) throw new Error("No se pudieron cargar los productos.");

        const productosGuardados = await res.json();

        let filtrados = productosGuardados.filter(
          (p) => normaliza(p.categoria?.nombre) === normaliza(CATEGORIA_PURIFICADORES)
        );

        if (filtrados.length === 0) {
          filtrados = productosGuardados.filter((p) =>
            normaliza(p.categoria?.nombre).includes("purificador")
          );
        }
        setPurificadores(filtrados);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurificadores();
  }, []);

  const handleAgregar = (producto) => {
    const itemEnCarrito = carrito.find((i) => i.id === producto.id);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const stockEfectivo = (producto.stock ?? 0) - cantidadEnCarrito;

    if (stockEfectivo <= 0) {
      toast.error("No hay más stock disponible para este producto.");
      return;
    }

    agregarProducto(producto, 1);
    toast.success(`${producto.nombre} añadido al carrito.`);
  };

  const {
    gastoMensualGarrafon,
    gastoAnualGarrafon,
    gastoMensualPurificador,
    ahorroMensual,
    ahorroAnual,
    mesesBreakEven,
  } = useMemo(() => {
    const mensualGarrafon = garrafonesPorSemana * precioGarrafon * 4.33;
    const anualGarrafon = mensualGarrafon * 12;
    const mensualPurificador = costoFiltrosAnual / 12;
    const ahorroM = Math.max(mensualGarrafon - mensualPurificador, 0);
    const ahorroA = Math.max(anualGarrafon - costoFiltrosAnual, 0);
    const me = ahorroM > 0 ? Math.ceil(costoEquipo / ahorroM) : null;

    return {
      gastoMensualGarrafon: mensualGarrafon,
      gastoAnualGarrafon: anualGarrafon,
      gastoMensualPurificador: mensualPurificador,
      ahorroMensual: ahorroM,
      ahorroAnual: ahorroA,
      mesesBreakEven: me,
    };
  }, [garrafonesPorSemana, precioGarrafon, costoFiltrosAnual, costoEquipo]);

  return (
    <div className="bg-slate-50">
      {/* HERO / HEADER */}
      <section className="relative overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Purificadores"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/55 to-slate-50" />

          {/* Glow decorativo */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[42rem] rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-lime-300/20 blur-3xl" />
        </div>

        <div className="relative px-4 md:px-10 pt-14 pb-14 max-w-screen-2xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/90 text-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#24d4da]" />
              Envío rápido • Instalación disponible • Soporte
            </span>

            <h2 className="mt-6 text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Purificadores para tu Hogar
            </h2>
            <p className="mt-4 text-white/80 text-lg md:text-xl">
              Agua pura y deliciosa directo del grifo. Ahorra dinero, cuida tu
              salud y el planeta.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() =>
                  document
                    .getElementById("catalogo")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#24d4da] px-7 py-3 font-bold text-slate-950 shadow-lg shadow-lime-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-200"
              >
                Ver modelos
                <ArrowRight />
              </button>

              <button
                onClick={() => navigate("/videos")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
              >
                Centro de videos
                <PlayIcon />
              </button>
            </div>
          </div>

          {/* GRID DE MODELOS */}
          <div className="mt-12">
            <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-white font-extrabold text-xl md:text-2xl">
                    Modelos y configuraciones
                  </h3>
                  <p className="text-white/70 text-sm md:text-base">
                    Explora por tipo de instalación: bajo tarja, encimera y punto
                    de uso.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill>RO</Pill>
                  <Pill>UF</Pill>
                  <Pill>Carbón</Pill>
                  <Pill>UV</Pill>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MODELOS_DEMO.map((m, idx) => (
                  <ModeloCard key={idx} modelo={m} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section
        id="catalogo"
        className="px-4 md:px-10 pt-10 pb-16 max-w-screen-2xl mx-auto"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Catálogo de Purificadores
              </h3>
              <p className="text-slate-600 mt-1">
                Cards con compra rápida, stock y animaciones suaves.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Tip: pasa el mouse para ver efectos ✨
              </span>
            </div>
          </div>

          {loading ? (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : purificadores.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-slate-500 text-lg">
                No hay purificadores disponibles en este momento.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {purificadores.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAgregar}
                  carrito={carrito}
                />
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <button
              onClick={() => navigate("/videos")}
              className="group bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-950"
            >
              Ver todos los videos{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ====== REDISEÑO LANDING (Desde WHY hasta FAQ) ====== */}
      <section className="relative bg-slate-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[26rem] w-[46rem] rounded-full bg-[#24d4da]/15 blur-3xl" />
          <div className="absolute top-[35%] -left-24 h-[26rem] w-[26rem] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute bottom-[-12%] -right-28 h-[28rem] w-[28rem] rounded-full bg-lime-300/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-10 py-24 space-y-20">
          {/* WHY BUY */}
          <section>
            <SectionHeader
              kicker="Beneficios reales"
              title="¿Por qué comprar un purificador casero?"
              subtitle="Ahorra, mejora el sabor del agua y elimina la dependencia de garrafones con una solución limpia y práctica."
            />

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon="💧"
                title="Mejor sabor y olor"
                description="Reduce cloro y compuestos que alteran el sabor. Agua más fresca desde el primer día."
              />
              <FeatureCard
                icon="🛡️"
                title="Reducción de contaminantes"
                description="Tecnologías como Carbón, UF o RO ayudan a disminuir sedimentos y micro-impurezas (según modelo)."
              />
              <FeatureCard
                icon="💵"
                title="Ahorro real"
                description="Dejas de comprar garrafones y recuperas la inversión con el tiempo."
              />
              <FeatureCard
                icon="🌱"
                title="Menos impacto ambiental"
                description="Menos plástico, menos transporte y menos residuos."
              />
              <FeatureCard
                icon="🏠"
                title="Comodidad inmediata"
                description="Agua al momento para beber y cocinar. Sin cargar garrafones."
              />
              <FeatureCard
                icon="✅"
                title="Control total"
                description="Tú decides cuándo cambias filtros y el tipo de filtración."
              />
            </div>

            <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-between rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <div className="text-left">
                <p className="text-white font-extrabold text-lg">
                  ¿Quieres ver instalación y mantenimiento?
                </p>
                <p className="text-white/70 text-sm">
                  Revisa el Centro de Videos: instalación, tips y cuidado por
                  modelo.
                </p>
              </div>
              <button
                onClick={() => navigate("/videos")}
                className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-extrabold hover:bg-slate-100 transition"
              >
                Ir al Centro de Videos →
              </button>
            </div>
          </section>

          {/* PLACEMENT */}
          <section>
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <SectionHeader
                  align="left"
                  kicker="Instalación"
                  title="¿Dónde colocarlo?"
                  subtitle="Elige según tu espacio y tipo de uso. Te damos una guía rápida para decidir."
                />
              </div>

              <div className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
                  <div className="absolute inset-0">
                    <img
                      src="/img/purificadorescaserosparapagina/sirviendoagua.jpg"
                      alt="Instalación"
                      className="h-full w-full object-cover opacity-80"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-slate-950/10" />
                  </div>
                  <div className="relative p-7 md:p-10">
                    <p className="text-white font-extrabold text-2xl md:text-3xl leading-tight">
                      Agua purificada donde la necesitas.
                    </p>
                    <p className="mt-2 text-white/70 max-w-xl">
                      Bajo tarja para cocina limpia, encimera si rentas o punto
                      de uso para máxima comodidad.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Tag>RO</Tag>
                      <Tag>UF</Tag>
                      <Tag>Carbón</Tag>
                      <Tag>UV</Tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <PlacementCardPro
                icon="🧰"
                title="Bajo tarja"
                bullets={[
                  "Oculto; grifo dedicado o 3 vías.",
                  "Ideal si tienes espacio en gabinete.",
                  "RO/UF disponibles; con o sin bomba.",
                ]}
              />
              <PlacementCardPro
                icon="🧼"
                title="Sobre encimera"
                bullets={[
                  "Instalación rápida al grifo.",
                  "Movible; perfecto para rentas.",
                  "Carbón activado / UF compactos.",
                ]}
              />
              <PlacementCardPro
                icon="🚰"
                title="Punto de uso"
                bullets={[
                  "Filtra justo donde bebes.",
                  "Accesible para niños y adultos mayores.",
                  "Compatible con garrafón o red.",
                ]}
              />
            </div>
          </section>

          {/* HOW TO CHOOSE */}
          <section>
            <SectionHeader
              kicker="Guía rápida"
              title="¿Cómo elegir el modelo adecuado?"
              subtitle="En 60 segundos: revisa tu agua, tu espacio y el tipo de filtración que necesitas."
            />

            <div className="mt-10 grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5 text-white/80">
                  <ChecklistPro>
                    Calidad del agua en tu zona (TDS, dureza, sabor).
                  </ChecklistPro>
                  <ChecklistPro>
                    Tipo de filtración: Carbón, UF, RO, UV.
                  </ChecklistPro>
                  <ChecklistPro>
                    Capacidad/flujo (GPD o L/h) acorde a tu familia.
                  </ChecklistPro>
                  <ChecklistPro>
                    Espacio e instalación: bajo tarja vs encimera.
                  </ChecklistPro>
                  <ChecklistPro>Costos de consumibles y repuestos.</ChecklistPro>
                  <ChecklistPro>
                    Certificaciones (NSF/ANSI cuando aplique).
                  </ChecklistPro>
                  <ChecklistPro>Garantía y soporte técnico local.</ChecklistPro>
                </ul>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur p-6 md:p-8">
                  <p className="text-white font-extrabold text-xl">Tip Darmax</p>
                  <p className="mt-2 text-white/70">
                    Si en tu zona hay mucha dureza/sarro o sabor fuerte,
                    normalmente conviene RO + postfiltro. Si quieres algo simple
                    y rápido, carbón/UF es excelente para mejorar sabor y
                    sedimentos.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <MiniStat label="Mejor para sarro" value="RO" />
                    <MiniStat label="Mejor sabor" value="Carbón" />
                    <MiniStat label="Microfiltrado" value="UF" />
                    <MiniStat label="Desinfección" value="UV" />
                  </div>

                  <button
                    onClick={() =>
                      document
                        .getElementById("catalogo")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="mt-6 w-full bg-[#24d4da] text-slate-950 px-6 py-3 rounded-2xl font-extrabold hover:bg-lime-200 transition"
                  >
                    Ver catálogo ahora →
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* MAINTENANCE */}
          <section>
            <SectionHeader
              kicker="Cuidado del equipo"
              title="Mantenimiento recomendado"
              subtitle="Un buen mantenimiento asegura sabor, flujo y vida útil del sistema."
            />

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
              <div className="grid md:grid-cols-2">
                <MaintenanceRowPro
                  etiqueta="Cartuchos de Sedimentos (PP/PE)"
                  rango="Cada 3–6 meses"
                />
                <MaintenanceRowPro
                  etiqueta="Filtros de Carbón Activado (GAC/CTO)"
                  rango="Cada 6–12 meses"
                />
                <MaintenanceRowPro
                  etiqueta="Membrana de Ósmosis Inversa (RO)"
                  rango="Cada 18–36 meses"
                />
                <MaintenanceRowPro
                  etiqueta="Lámpara Ultravioleta (UV)"
                  rango="Cada 12 meses"
                />
                <MaintenanceRowPro
                  etiqueta="Post-filtro / Pulidor de sabor"
                  rango="Cada 6–12 meses"
                />
                <MaintenanceRowPro
                  etiqueta="Sanitización general"
                  rango="Recomendado anual"
                />
              </div>

              <p className="px-6 pb-6 text-xs text-white/55">
                *Los intervalos varían por consumo y calidad del agua. Si baja
                el flujo o cambia el sabor, revisa filtros.
              </p>
            </div>
          </section>

          {/* CALCULADORA */}
          <section aria-labelledby="calc-title" className="scroll-mt-20">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 md:p-12">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[42rem] rounded-full bg-[#24d4da]/15 blur-3xl" />

              <div className="relative">
                <h3
                  id="calc-title"
                  className="text-3xl md:text-4xl font-extrabold tracking-tight text-center text-white"
                >
                  Calculadora de Ahorro Anual
                </h3>
                <p className="mt-3 text-white/70 text-center max-w-2xl mx-auto">
                  Ajusta los valores y calcula tu ahorro aproximado dejando los
                  garrafones.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 items-end">
                  <LabeledInputDark
                    label="Garrafones por semana"
                    value={garrafonesPorSemana}
                    onChange={setGarrafonesPorSemana}
                    min={0}
                    step={1}
                  />
                  <LabeledInputDark
                    label="Precio por garrafón (MXN)"
                    value={precioGarrafon}
                    onChange={setPrecioGarrafon}
                    min={0}
                    step={1}
                  />
                  <LabeledInputDark
                    label="Costo anual de filtros (MXN)"
                    value={costoFiltrosAnual}
                    onChange={setCostoFiltrosAnual}
                    min={0}
                    step={50}
                  />
                  <LabeledInputDark
                    label="Costo del equipo (MXN)"
                    value={costoEquipo}
                    onChange={setCostoEquipo}
                    min={0}
                    step={100}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <StatDark
                    label="Gasto mensual en garrafón"
                    value={mxn(gastoMensualGarrafon)}
                  />
                  <StatDark
                    label="Gasto mensual con purificador"
                    value={mxn(gastoMensualPurificador)}
                    muted
                  />
                  <StatDark
                    label="Ahorro estimado al mes"
                    value={mxn(ahorroMensual)}
                  />
                </div>

                <div className="mt-7 text-center text-white/75">
                  Ahorro estimado al año:{" "}
                  <span className="font-extrabold text-lg text-lime-200">
                    {mxn(ahorroAnual)}
                  </span>
                  {mesesBreakEven ? (
                    <>
                      {" "}
                      — Recuperas tu inversión en{" "}
                      <span className="font-semibold text-white">
                        {mesesBreakEven}
                      </span>{" "}
                      meses aprox.
                    </>
                  ) : (
                    <> — Con los valores actuales, no hay un ahorro mensual visible.</>
                  )}
                  <p className="text-xs text-white/50 mt-2">
                    *Cálculo aproximado para fines ilustrativos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <SectionHeader
              kicker="Soporte"
              title="Preguntas frecuentes"
              subtitle="Respuestas rápidas a las dudas más comunes antes de comprar."
            />

            <div className="mt-10 max-w-4xl mx-auto space-y-4">
              <FaqDark q="¿El purificador elimina el flúor o la cal (sarro)?">
                Para reducir flúor y sales disueltas (dureza/sarro) se recomienda
                un sistema de <b>ósmosis inversa (RO)</b>.
              </FaqDark>

              <FaqDark q="¿Puedo instalarlo yo mismo?">
                Muchos equipos sobre-encimera y algunos bajo-tarja incluyen kit y
                manual. Si se requiere perforar la tarja o la presión es baja,
                considera un técnico.
              </FaqDark>

              <FaqDark q="¿Qué pasa si tengo poca presión de agua?">
                Equipos RO son sensibles a la presión. Si tienes menos de 40 PSI,
                considera un modelo con <b>bomba booster</b>.
              </FaqDark>

              <FaqDark q="¿Cada cuándo se cambian los filtros?">
                Depende del uso y calidad del agua. Señal clara: baja el flujo o
                cambia el sabor/olor.
              </FaqDark>

              <FaqDark q="¿El agua purificada sirve para cocinar?">
                ¡Claro! Mejora café, té, sopas y hielos y ayuda a prevenir sarro
                en aparatos.
              </FaqDark>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => navigate("/contacto")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-7 py-3 font-extrabold text-white hover:bg-white/15 transition"
              >
                ¿Aún tienes dudas? Contáctanos →
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

/* ===========================
   COMPONENTES UI (HERO + CATÁLOGO)
   =========================== */

function ModeloCard({ modelo }) {
  return (
    <button
      type="button"
      className="
        group relative overflow-hidden rounded-2xl
        border border-white/10 bg-white/5
        transition-all duration-500
        hover:-translate-y-1 hover:bg-white/10
        focus:outline-none focus:ring-2 focus:ring-lime-300/70
      "
      onClick={() => {
        document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <div className="absolute inset-0">
        <img
          src={modelo.img}
          alt={modelo.name}
          className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/10" />
      </div>

      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-40 w-64 rounded-full bg-cyan-400/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative p-4 min-h-[170px] flex flex-col justify-end text-left">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-lime-300/90 px-2.5 py-1 text-xs font-bold text-slate-950">
            {modelo.tag}
          </span>
          <span className="text-white/80 text-xs">Ver →</span>
        </div>

        <h4 className="mt-2 text-white font-extrabold leading-tight">
          {modelo.name}
        </h4>
        <p className="text-white/75 text-sm">{modelo.subtitle}</p>
      </div>
    </button>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
      {children}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded" />
        <div className="h-3 w-full bg-slate-100 animate-pulse rounded" />
        <div className="h-8 w-1/2 bg-slate-100 animate-pulse rounded" />
        <div className="h-9 w-full bg-slate-100 animate-pulse rounded" />
      </div>
    </div>
  );
}

/* ✅ ProductCard rediseñada (Estilo Productos.jsx) */
function ProductCard({ item, onAddToCart, carrito = [] }) {
  const p = item; // Alias para reutilizar código
  const precioN = Number(p.precio || 0);
  const priceFormatted = precioN.toFixed(2);

  const itemEnCarrito = carrito.find((i) => i.id === p.id);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
  const stockEfectivo = (p.stock ?? 0) - cantidadEnCarrito;

  return (
    <article
      className="
        group cursor-pointer
        rounded-2xl overflow-hidden
        bg-white border border-slate-200
        hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/5
        transition-all duration-300
        flex flex-col h-full
      "
    >
      {/* Sección Imagen */}
      <div className="relative w-full aspect-[4/3] bg-white p-4 overflow-hidden border-b border-slate-50">
        {/* Background sutil en hover */}
        <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge Stock */}
        <span
          className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-sm ${
            stockEfectivo <= 0
              ? "bg-slate-100/90 text-slate-500 border-slate-200"
              : stockEfectivo <= 5
              ? "bg-red-50/90 text-red-600 border-red-100"
              : "bg-emerald-50/90 text-emerald-600 border-emerald-100"
          }`}
        >
          {stockEfectivo <= 0
            ? "Agotado"
            : stockEfectivo <= 5
            ? `¡Quedan ${stockEfectivo}!`
            : "Disponible"}
        </span>

        {/* Imagen */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={p.imagen || "https://via.placeholder.com/400x300"}
            alt={p.nombre}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/400x300";
            }}
          />
        </div>
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="flex flex-col flex-1">
        <div className="p-5 pb-0 flex-1">
          {/* Categoría pequeña (si existe) */}
          {p.categoria?.nombre && (
            <div className="mb-2 text-center">
              <span className="inline-block text-[10px] font-bold text-[#007377] uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-100/50">
                {p.categoria.nombre}
              </span>
            </div>
          )}
          
          {/* Título */}
          <h3 className="text-[15px] font-bold text-slate-800 text-center leading-snug line-clamp-2 group-hover:text-[#007377] transition-colors">
            {p.nombre}
          </h3>
        </div>

        {/* Footer: Precio + Botón (Tamaño Fijo) */}
        <div className="p-5 mt-auto">
          <div className="flex flex-col items-center">
            {/* Contenedor del Precio */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                Precio
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-slate-900 leading-none">
                  ${priceFormatted}
                </span>
                <span className="text-[10px] font-bold text-slate-400">MXN</span>
              </div>
            </div>

            {/* Espacio reservado para el Botón (Sin movimiento) */}
            <div className="w-full h-14 mt-2 flex items-center justify-center">
              <div className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => onAddToCart(p)}
                  disabled={stockEfectivo <= 0}
                  className={`
                    w-full h-10 rounded-xl flex items-center justify-center gap-2
                    text-sm font-bold transition-all duration-300
                    ${
                      stockEfectivo <= 0
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100"
                        : "border-2 border-[#24d4da] text-[#24d4da] bg-transparent hover:bg-[#24d4da] hover:text-white shadow-sm hover:shadow-md"
                    }
                  `}
                  title="Agregar al carrito"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M1 1.75A.75.75 0 011.75 1h1.628a.75.75 0 01.73.593l.35 2.513h12.91a.75.75 0 01.748.879l-1.08 6.5a.75.75 0 01-.74.627H7.03a.75.75 0 01-.748-.65l-.356-3.027-.373-2.672H1.75a.75.75 0 01-.75-.75zM6.625 15.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ===========================
   COMPONENTES NUEVOS (LANDING DARK)
   =========================== */

function SectionHeader({ kicker, title, subtitle, align = "center" }) {
  const alignCls = align === "left" ? "text-left" : "text-center";
  return (
    <div className={alignCls}>
      {kicker ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-extrabold text-white/80 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-[#24d4da]" />
          {kicker}
        </p>
      ) : null}

      <h3 className="mt-5 text-3xl md:text-4xl font-extrabold text-white tracking-tight">
        {title}
      </h3>

      {subtitle ? (
        <p className="mt-3 text-white/70 max-w-3xl mx-auto">{subtitle}</p>
      ) : null}
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#24d4da]/10 blur-2xl" />
      <div className="text-4xl">{icon}</div>
      <h4 className="mt-3 text-lg font-extrabold text-white">{title}</h4>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{description}</p>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
      {children}
    </span>
  );
}

function PlacementCardPro({ icon, title, bullets }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <h4 className="text-lg font-extrabold text-white">{title}</h4>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-white/70">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#24d4da]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChecklistPro({ children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#24d4da]/15 border border-[#24d4da]/20">
        <svg className="h-4 w-4 text-[#24d4da]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold text-white/60">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-white">{value}</p>
    </div>
  );
}

function MaintenanceRowPro({ etiqueta, rango }) {
  return (
    <div className="flex items-center justify-between gap-4 p-6 border-b border-white/10">
      <div className="min-w-0">
        <p className="font-semibold text-white">{etiqueta}</p>
        <p className="text-xs text-white/55 mt-1">Recomendación general</p>
      </div>
      <span className="shrink-0 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-bold text-white/80">
        {rango}
      </span>
    </div>
  );
}

function LabeledInputDark({ label, value, onChange, min = 0, step = 1 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-white">
        {label}
      </span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white shadow-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-[#24d4da]/30"
      />
    </label>
  );
}

function StatDark({ label, value, muted = false }) {
  return (
    <div
      className={[
        "rounded-3xl p-6 border",
        muted ? "border-white/10 bg-white/5" : "border-[#24d4da]/20 bg-[#24d4da]/10",
      ].join(" ")}
    >
      <p className="text-sm text-white/70 font-semibold">{label}</p>
      <p className={muted ? "text-2xl font-extrabold mt-2 text-white" : "text-2xl font-extrabold mt-2 text-lime-200"}>
        {value}
      </p>
    </div>
  );
}

function FaqDark({ q, children }) {
  return (
    <details className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
      <summary className="flex cursor-pointer items-center justify-between p-5">
        <span className="font-extrabold text-white">{q}</span>
        <svg
          className="h-5 w-5 text-white/60 transition duration-300 group-open:-rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-5 pb-5 text-white/75 leading-relaxed">{children}</div>
    </details>
  );
}

/* Icons */
function ArrowRight() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7-11-7z" />
    </svg>
  );
}
