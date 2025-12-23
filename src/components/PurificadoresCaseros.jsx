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

/** Ajusta estas imágenes si quieres un “banner” con modelos reales */
const HERO_BG =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2400&q=80";

const MODELOS_DEMO = [
  {
    name: "Bajo tarja (RO)",
    subtitle: "Ósmosis inversa",
    img: "https://images.unsplash.com/photo-1581579185169-7b7b7b7b7b7b?auto=format&fit=crop&w=1200&q=80",
    tag: "Top ventas",
  },
  {
    name: "Encimera (UF)",
    subtitle: "Ultrafiltración",
    img: "https://images.unsplash.com/photo-1560840067-ddcaeb7831d2?auto=format&fit=crop&w=1200&q=80",
    tag: "Fácil instalación",
  },
  {
    name: "Dispensador",
    subtitle: "Punto de uso",
    img: "https://images.unsplash.com/photo-1541542684-4bf98d0b2c6a?auto=format&fit=crop&w=1200&q=80",
    tag: "Ideal oficina",
  },
  {
    name: "Bajo tarja (UF+Carbón)",
    subtitle: "Sabor + microfiltrado",
    img: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
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
          (p) =>
            normaliza(p.categoria?.nombre) === normaliza(CATEGORIA_PURIFICADORES)
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
              <span className="h-2 w-2 rounded-full bg-lime-300" />
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
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-lime-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-200"
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

          {/* IMAGEN GRANDE / GRID INTERACTIVO DE MODELOS (debajo del título) */}
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

      {/* SECCIONES INFORMATIVAS */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 pb-24 space-y-20">
        <InfoSection title="¿Por qué comprar un purificador casero?">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              icon="💧"
              title="Mejor sabor y olor"
              description="Reduce cloro y compuestos que afectan el sabor; el agua se siente más fresca al instante."
            />
            <InfoCard
              icon="🛡️"
              title="Reducción de contaminantes"
              description="Los sistemas con carbón, UF o RO disminuyen sedimentos, metales y micro-impurezas (según el modelo)."
            />
            <InfoCard
              icon="💵"
              title="Ahorro a largo plazo"
              description="Evita compras frecuentes de garrafones/botellas; recuperas la inversión en meses."
            />
            <InfoCard
              icon="🌱"
              title="Menos impacto ambiental"
              description="Menos botellas desechables y traslados. Beneficia tu bolsillo y al ambiente."
            />
            <InfoCard
              icon="🏠"
              title="Comodidad en casa"
              description="Agua al momento, para beber y cocinar. Sin cargas ni esperas de repartidor."
            />
            <InfoCard
              icon="✅"
              title="Control y transparencia"
              description="Sabes cuándo cambias filtros y qué tecnología usa tu equipo."
            />
          </div>
        </InfoSection>

        <InfoSection title="¿Dónde colocarlo?">
          <div className="grid md:grid-cols-3 gap-6">
            <PlacementCard
              icon="🧰"
              title="Bajo tarja (debajo del fregadero)"
              bullets={[
                "Queda oculto; grifo dedicado o 3 vías.",
                "Ideal para cocinas con espacio en gabinete.",
                "Opciones RO/UF con o sin bomba.",
              ]}
            />
            <PlacementCard
              icon="🧼"
              title="Sobre encimera"
              bullets={[
                "Instalación rápida al grifo.",
                "Movible; perfecto para rentas.",
                "Carbón activado / UF compactos.",
              ]}
            />
            <PlacementCard
              icon="🚰"
              title="Punto de uso (dispensador/llave)"
              bullets={[
                "Filtra justo donde bebes.",
                "Accesible para niños y adultos mayores.",
                "Compatible con garrafón o red.",
              ]}
            />
          </div>
        </InfoSection>

        <InfoSection title="¿Cómo elegir el modelo adecuado?">
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-slate-700">
            <Checklist>Calidad del agua en tu zona (TDS, dureza, sabor).</Checklist>
            <Checklist>
              Tipo de filtración: Carbón (olor/sabor), UF (micro-impurezas), RO
              (sales/metales), UV (desinfección).
            </Checklist>
            <Checklist>Capacidad/flujo (GPD o L/h) acorde a tu familia.</Checklist>
            <Checklist>Espacio e instalación: bajo tarja vs encimera.</Checklist>
            <Checklist>
              Costos de consumibles y disponibilidad de repuestos.
            </Checklist>
            <Checklist>
              Certificaciones (p. ej., NSF/ANSI 42, 53, 58, 55, 401).
            </Checklist>
            <Checklist>Garantía y soporte técnico local.</Checklist>
          </ul>
        </InfoSection>

        <InfoSection title="Mantenimiento recomendado">
          <div className="grid md:grid-cols-2 gap-4">
            <MaintenanceRow
              etiqueta="Cartuchos de Sedimentos (PP/PE)"
              rango="Cada 3–6 meses"
            />
            <MaintenanceRow
              etiqueta="Filtros de Carbón Activado (GAC/CTO)"
              rango="Cada 6–12 meses"
            />
            <MaintenanceRow
              etiqueta="Membrana de Ósmosis Inversa (RO)"
              rango="Cada 18–36 meses"
            />
            <MaintenanceRow
              etiqueta="Lámpara Ultravioleta (UV)"
              rango="Cada 12 meses (o según horas de uso)"
            />
            <MaintenanceRow
              etiqueta="Post-filtro / Pulidor de sabor"
              rango="Cada 6–12 meses"
            />
          </div>
          <p className="text-sm text-slate-500 mt-6 text-center">
            *Los intervalos varían según consumo y calidad del agua. Revisa el
            caudal, sabor y los recordatorios del equipo.
          </p>
        </InfoSection>

        {/* CALCULADORA */}
        <section aria-labelledby="calc-title" className="scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-8 md:p-12">
            <h3
              id="calc-title"
              className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-center"
            >
              Calculadora de Ahorro Anual
            </h3>
            <p className="mt-3 text-slate-600 text-center max-w-2xl mx-auto">
              Descubre cuánto podrías ahorrar al dejar de comprar garrafones.
              Ajusta los valores para que coincidan con tus gastos actuales.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 items-end">
              <LabeledInput
                label="Garrafones por semana"
                value={garrafonesPorSemana}
                onChange={setGarrafonesPorSemana}
                min={0}
                step={1}
              />
              <LabeledInput
                label="Precio por garrafón (MXN)"
                value={precioGarrafon}
                onChange={setPrecioGarrafon}
                min={0}
                step={1}
              />
              <LabeledInput
                label="Costo anual de filtros (MXN)"
                value={costoFiltrosAnual}
                onChange={setCostoFiltrosAnual}
                min={0}
                step={50}
              />
              <LabeledInput
                label="Costo del equipo (MXN)"
                value={costoEquipo}
                onChange={setCostoEquipo}
                min={0}
                step={100}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Stat label="Gasto mensual en garrafón" value={mxn(gastoMensualGarrafon)} />
              <Stat
                label="Gasto mensual con purificador"
                value={mxn(gastoMensualPurificador)}
                highlight={false}
              />
              <Stat label="Ahorro estimado al mes" value={mxn(ahorroMensual)} />
            </div>

            <div className="mt-6 text-center text-slate-600">
              Ahorro estimado al año:{" "}
              <span className="font-bold text-lg text-green-600">
                {mxn(ahorroAnual)}
              </span>
              {mesesBreakEven ? (
                <>
                  {" "}
                  — Recuperas tu inversión en{" "}
                  <span className="font-semibold text-slate-800">
                    {mesesBreakEven}
                  </span>{" "}
                  meses aprox.
                </>
              ) : (
                <> — Con los valores actuales, no hay un ahorro mensual visible.</>
              )}
              <p className="text-xs text-slate-500 mt-2">
                *Cálculo aproximado para fines ilustrativos.
              </p>
            </div>
          </div>
        </section>

        <InfoSection title="Preguntas frecuentes">
          <div className="space-y-4 max-w-4xl mx-auto">
            <Faq q="¿El purificador elimina el flúor o la cal (sarro)?">
              Para reducir flúor y sales disueltas (dureza/sarro) se recomienda un
              sistema de <b>ósmosis inversa (RO)</b>.
            </Faq>
            <Faq q="¿Puedo instalarlo yo mismo?">
              Muchos equipos sobre-encimera y algunos bajo-tarja incluyen kit y
              manual para auto-instalación. Si se requiere perforar la tarja o la
              presión es baja, considera un técnico.
            </Faq>
            <Faq q="¿Qué pasa si tengo poca presión de agua?">
              Equipos de Ósmosis Inversa (RO) son los más sensibles a la presión.
              Si tienes menos de 40 PSI, considera un modelo con <b>bomba booster</b>{" "}
              integrada para asegurar un buen funcionamiento.
            </Faq>
            <Faq q="¿Cada cuándo se cambian los filtros?">
              Depende del uso y la calidad del agua (ver guía arriba). Una señal
              clara es cuando notas una disminución en el flujo de agua o un
              cambio en el sabor/olor.
            </Faq>
            <Faq q="¿El agua purificada sirve para cocinar?">
              ¡Claro! Mejora el sabor de café, té, sopas y hielos. Además, al usar
              agua con menos minerales, ayudas a prevenir la acumulación de sarro
              en cafeteras y otros electrodomésticos.
            </Faq>
          </div>
        </InfoSection>
      </div>
    </div>
  );
}

/* ===========================
   COMPONENTES UI (NUEVOS)
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
        // Aquí podrías hacer scroll al catálogo o aplicar filtros por tipo
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

      {/* Glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-40 w-64 rounded-full bg-cyan-400/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative p-4 min-h-[170px] flex flex-col justify-end text-left">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-lime-300/90 px-2.5 py-1 text-xs font-bold text-slate-950">
            {modelo.tag}
          </span>
          <span className="text-white/80 text-xs">
            Ver →
          </span>
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

/* ===========================
   PRODUCT CARD (MEJORADA)
   =========================== */

function ProductCard({ item, onAddToCart, carrito = [] }) {
  const precioN = Number(item.precio || 0);

  const itemEnCarrito = carrito.find((i) => i.id === item.id);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
  const stockEfectivo = (item.stock ?? 0) - cantidadEnCarrito;

  const img =
    item.imagen || "https://placehold.co/900x700/e2e8f0/475569?text=Darmax";

  return (
    <article
      className="
        group relative
        rounded-2xl bg-white
        border border-slate-200/70
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70
        overflow-hidden
      "
    >
      {/* Glow on hover */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-72 rounded-full bg-lime-300/25 blur-3xl" />
      </div>

      {/* Imagen */}
      <div className="relative w-full aspect-[4/3] bg-slate-50 flex items-center justify-center">
        <img
          src={img}
          alt={item.nombre}
          loading="lazy"
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
          onError={(e) => (e.currentTarget.style.display = "none")}
        />

        {/* Badge stock */}
        <div className="absolute top-3 left-3">
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold backdrop-blur border",
              stockEfectivo <= 0
                ? "bg-red-500/15 text-red-700 border-red-500/20"
                : "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
            ].join(" ")}
          >
            <span
              className={[
                "h-2 w-2 rounded-full",
                stockEfectivo <= 0 ? "bg-red-500" : "bg-emerald-500",
              ].join(" ")}
            />
            {stockEfectivo <= 0 ? "Agotado" : `${stockEfectivo} disponibles`}
          </span>
        </div>

        {/* Quick actions */}
        <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="inline-flex items-center rounded-xl bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow">
            Hover ✨
          </span>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Cuerpo */}
      <div className="p-4 flex flex-col text-center">
        <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
          {item.nombre}
        </h3>

        {item.descripcion && (
          <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
            {item.descripcion}
          </p>
        )}

        <div className="mt-3 flex items-center justify-center gap-2">
          <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {mxn(precioN)}
          </p>
        </div>

        <button
          onClick={() => onAddToCart(item)}
          disabled={stockEfectivo <= 0}
          className={[
            "mt-4 w-full px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-lime-400/70",
            stockEfectivo <= 0
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-lime-300 text-slate-950 hover:bg-lime-200 hover:-translate-y-0.5 shadow-md shadow-lime-500/15",
          ].join(" ")}
        >
          {stockEfectivo <= 0 ? "Agotado" : "Agregar al carrito"}
        </button>

        {/* Detalles compactos */}
        {(item.pesoKg || item.largoCm || item.anchoCm || item.altoCm) && (
          <div className="mt-4 text-[11px] text-slate-500 text-left w-full border-t border-slate-200 pt-3">
            {item.pesoKg && (
              <div className="leading-snug">
                <strong>Peso:</strong> {item.pesoKg} kg
              </div>
            )}
            {(item.largoCm || item.anchoCm || item.altoCm) && (
              <div className="leading-snug">
                <strong>Dimensiones:</strong>{" "}
                {[item.largoCm, item.anchoCm, item.altoCm]
                  .filter(Boolean)
                  .join(" × ")}{" "}
                cm
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ===========================
   SECCIONES (IGUAL QUE TUYO)
   =========================== */

function InfoSection({ title, children }) {
  return (
    <section>
      <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-10">
        {title}
      </h3>
      {children}
    </section>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="text-4xl mx-auto w-fit mb-3">{icon}</div>
      <h4 className="font-bold text-lg text-slate-900">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{description}</p>
    </div>
  );
}

function PlacementCard({ icon, title, bullets = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">{icon}</div>
        <h4 className="font-bold text-lg text-slate-900">{title}</h4>
      </div>
      <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-1">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function Checklist({ children }) {
  return (
    <li className="flex items-start gap-3">
      <CheckIcon />
      <span>{children}</span>
    </li>
  );
}

const CheckIcon = () => (
  <svg
    className="w-6 h-6 text-[#24d4da] shrink-0 mt-0.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12.75L11.25 15L15 9.75"></path>
    <path
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="currentColor"
    ></path>
  </svg>
);

function MaintenanceRow({ etiqueta, rango }) {
  return (
    <div className="flex items-baseline justify-between rounded-xl border border-slate-200/90 p-4 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <span className="font-semibold text-slate-800">{etiqueta}</span>
      <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
        {rango}
      </span>
    </div>
  );
}

function LabeledInput({ label, value, onChange, min = 0, step = 1 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-800">
        {label}
      </span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="block w-full rounded-lg border-gray-300 bg-gray-50/80 px-4 py-2.5 text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-lime-400 focus:bg-white focus:ring-lime-400 focus:ring-1"
      />
    </label>
  );
}

function Stat({ label, value, highlight = true }) {
  return (
    <div
      className={`rounded-xl p-5 ${
        highlight ? "bg-lime-100/50 border-lime-200" : "bg-slate-100/80 border-slate-200"
      } border`}
    >
      <p className="text-sm text-slate-600 font-medium">{label}</p>
      <p
        className={`text-2xl font-bold mt-1 ${
          highlight ? "text-green-700" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Faq({ q, children }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between p-4">
        <span className="font-semibold text-slate-800">{q}</span>
        <ChevronDownIcon />
      </summary>
      <div className="px-4 pb-4 text-slate-600">{children}</div>
    </details>
  );
}

const ChevronDownIcon = () => (
  <svg
    className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180 text-slate-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

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
