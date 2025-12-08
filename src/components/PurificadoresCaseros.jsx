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

export default function PurificadoresCaseros() {
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();
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
      <section className="px-4 md:px-10 pt-10 pb-16 max-w-screen-2xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                Purificadores para tu Hogar
            </h2>
            <p className="mt-4 text-slate-600 text-lg md:text-xl">
                Agua pura y deliciosa directamente de tu grifo. Ahorra dinero, cuida tu salud y el planeta.
            </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-lime-400"></div>
            <p className="mt-6 text-lg text-slate-600 font-medium">Cargando purificadores...</p>
          </div>
        ) : purificadores.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-500 text-lg">
              No hay purificadores disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto">
            {purificadores.map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={handleAgregar} onNavigate={navigate} />
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <button
            onClick={() => navigate("/videos")}
            className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors"
          >
            Ver todos los videos
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pb-24 space-y-20">
        <InfoSection title="¿Por qué comprar un purificador casero?">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard icon="💧" title="Mejor sabor y olor" description="Reduce cloro y compuestos que afectan el sabor; el agua se siente más fresca al instante." />
            <InfoCard icon="🛡️" title="Reducción de contaminantes" description="Los sistemas con carbón, UF o RO disminuyen sedimentos, metales y micro-impurezas (según el modelo)." />
            <InfoCard icon="💵" title="Ahorro a largo plazo" description="Evita compras frecuentes de garrafones/botellas; recuperas la inversión en meses." />
            <InfoCard icon="🌱" title="Menos impacto ambiental" description="Menos botellas desechables y traslados. Beneficia tu bolsillo y al ambiente." />
            <InfoCard icon="🏠" title="Comodidad en casa" description="Agua al momento, para beber y cocinar. Sin cargas ni esperas de repartidor." />
            <InfoCard icon="✅" title="Control y transparencia" description="Sabes cuándo cambias filtros y qué tecnología usa tu equipo." />
          </div>
        </InfoSection>

        <InfoSection title="¿Dónde colocarlo?">
          <div className="grid md:grid-cols-3 gap-6">
            <PlacementCard icon="🧰" title="Bajo tarja (debajo del fregadero)" bullets={["Queda oculto; grifo dedicado o 3 vías.", "Ideal para cocinas con espacio en gabinete.", "Opciones RO/UF con o sin bomba."]} />
            <PlacementCard icon="🧼" title="Sobre encimera" bullets={["Instalación rápida al grifo.", "Movible; perfecto para rentas.", "Carbón activado / UF compactos."]} />
            <PlacementCard icon="🚰" title="Punto de uso (dispensador/llave)" bullets={["Filtra justo donde bebes.", "Accesible para niños y adultos mayores.", "Compatible con garrafón o red."]} />
          </div>
        </InfoSection>

        <InfoSection title="¿Cómo elegir el modelo adecuado?">
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-slate-700">
            <Checklist>Calidad del agua en tu zona (TDS, dureza, sabor).</Checklist>
            <Checklist>Tipo de filtración: Carbón (olor/sabor), UF (micro-impurezas), RO (sales/metales), UV (desinfección).</Checklist>
            <Checklist>Capacidad/flujo (GPD o L/h) acorde a tu familia.</Checklist>
            <Checklist>Espacio e instalación: bajo tarja vs encimera.</Checklist>
            <Checklist>Costos de consumibles y disponibilidad de repuestos.</Checklist>
            <Checklist>Certificaciones (p. ej., NSF/ANSI 42, 53, 58, 55, 401).</Checklist>
            <Checklist>Garantía y soporte técnico local.</Checklist>
          </ul>
        </InfoSection>

        <InfoSection title="Mantenimiento recomendado">
            <div className="grid md:grid-cols-2 gap-4">
                <MaintenanceRow etiqueta="Cartuchos de Sedimentos (PP/PE)" rango="Cada 3–6 meses" />
                <MaintenanceRow etiqueta="Filtros de Carbón Activado (GAC/CTO)" rango="Cada 6–12 meses" />
                <MaintenanceRow etiqueta="Membrana de Ósmosis Inversa (RO)" rango="Cada 18–36 meses" />
                <MaintenanceRow etiqueta="Lámpara Ultravioleta (UV)" rango="Cada 12 meses (o según horas de uso)" />
                <MaintenanceRow etiqueta="Post-filtro / Pulidor de sabor" rango="Cada 6–12 meses" />
            </div>
            <p className="text-sm text-slate-500 mt-6 text-center">
              *Los intervalos varían según consumo y calidad del agua. Revisa el caudal, sabor y los recordatorios del equipo.
            </p>
        </InfoSection>

        <section aria-labelledby="calc-title" className="scroll-mt-20">
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-8 md:p-12">
                <h3 id="calc-title" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-center">Calculadora de Ahorro Anual</h3>
                <p className="mt-3 text-slate-600 text-center max-w-2xl mx-auto">Descubre cuánto podrías ahorrar al dejar de comprar garrafones. Ajusta los valores para que coincidan con tus gastos actuales.</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 items-end">
                    <LabeledInput label="Garrafones por semana" value={garrafonesPorSemana} onChange={setGarrafonesPorSemana} min={0} step={1} />
                    <LabeledInput label="Precio por garrafón (MXN)" value={precioGarrafon} onChange={setPrecioGarrafon} min={0} step={1} />
                    <LabeledInput label="Costo anual de filtros (MXN)" value={costoFiltrosAnual} onChange={setCostoFiltrosAnual} min={0} step={50} />
                    <LabeledInput label="Costo del equipo (MXN)" value={costoEquipo} onChange={setCostoEquipo} min={0} step={100} />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <Stat label="Gasto mensual en garrafón" value={mxn(gastoMensualGarrafon)} />
                    <Stat label="Gasto mensual con purificador" value={mxn(gastoMensualPurificador)} highlight={false} />
                    <Stat label="Ahorro estimado al mes" value={mxn(ahorroMensual)} />
                </div>

                <div className="mt-6 text-center text-slate-600">
                    Ahorro estimado al año: <span className="font-bold text-lg text-green-600">{mxn(ahorroAnual)}</span>
                    {mesesBreakEven ? (
                    <> — Recuperas tu inversión en <span className="font-semibold text-slate-800">{mesesBreakEven}</span> meses aprox.</>
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
            <Faq q="¿El purificador elimina el flúor o la cal (sarro)?">Para reducir flúor y sales disueltas (dureza/sarro) se recomienda un sistema de <b>ósmosis inversa (RO)</b>.</Faq>
            <Faq q="¿Puedo instalarlo yo mismo?">Muchos equipos sobre-encimera y algunos bajo-tarja incluyen kit y manual para auto-instalación. Si se requiere perforar la tarja o la presión es baja, considera un técnico.</Faq>
            <Faq q="¿Qué pasa si tengo poca presión de agua?">Equipos de Ósmosis Inversa (RO) son los más sensibles a la presión. Si tienes menos de 40 PSI, considera un modelo con <b>bomba booster</b> integrada para asegurar un buen funcionamiento.</Faq>
            <Faq q="¿Cada cuándo se cambian los filtros?">Depende del uso y la calidad del agua (ver guía arriba). Una señal clara es cuando notas una disminución en el flujo de agua o un cambio en el sabor/olor.</Faq>
            <Faq q="¿El agua purificada sirve para cocinar?">¡Claro! Mejora el sabor de café, té, sopas y hielos. Además, al usar agua con menos minerales, ayudas a prevenir la acumulación de sarro en cafeteras y otros electrodomésticos.</Faq>
          </div>
        </InfoSection>
      </div>
    </div>
  );
}

function ProductCard({ item, onAddToCart, onNavigate }) {
    const precioN = Number(item.precio || 0);
    return (
        <article className="group bg-white rounded-2xl shadow-lg flex flex-col text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
            <div className="relative">
                <img src={item.imagen || "https://placehold.co/400x300/e2e8f0/475569?text=Darmax"} alt={item.nombre} className="w-full h-56 object-cover rounded-t-2xl" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-slate-800">{item.nombre}</h3>
                {item.descripcion && <p className="text-sm text-slate-600 mt-2 flex-grow">{item.descripcion}</p>}
                
                <p className="text-4xl font-extrabold text-slate-900 my-4">{mxn(precioN)}</p>
                
                <div className="mt-auto space-y-3">
                    <button onClick={() => onAddToCart(item)} className="w-full px-6 py-3 rounded-lg font-bold bg-lime-300 text-black hover:bg-lime-400 transition-colors shadow-lg shadow-lime-500/10 hover:shadow-lime-500/20">
                        Agregar al carrito
                    </button>
                    <button onClick={() => onNavigate(`/videos/${item.id}`)} className="w-full px-6 py-2 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                        Ver Video
                    </button>
                </div>

                {(item.pesoKg || item.largoCm) && (
                    <div className="mt-5 text-xs text-slate-500 text-left w-full border-t border-slate-200 pt-4">
                        {item.pesoKg && <div><strong>Peso:</strong> {item.pesoKg} kg</div>}
                        {(item.largoCm || item.anchoCm || item.altoCm) && (
                        <div><strong>Dimensiones:</strong> {[item.largoCm, item.anchoCm, item.altoCm].filter(Boolean).join(" × ")} cm</div>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

function InfoSection({ title, children }) {
    return (
        <section>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-10">{title}</h3>
            {children}
        </section>
    );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm">
      <div className="text-4xl mx-auto w-fit mb-3">{icon}</div>
      <h4 className="font-bold text-lg text-slate-900">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{description}</p>
    </div>
  );
}

function PlacementCard({ icon, title, bullets = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">{icon}</div>
        <h4 className="font-bold text-lg text-slate-900">{title}</h4>
      </div>
      <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-1">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
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
    <svg className="w-6 h-6 text-[#24d4da] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12.75L11.25 15L15 9.75"></path>
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor"></path>
    </svg>
);

function MaintenanceRow({ etiqueta, rango }) {
    return (
      <div className="flex items-baseline justify-between rounded-xl border border-slate-200/90 p-4 bg-white shadow-sm">
        <span className="font-semibold text-slate-800">{etiqueta}</span>
        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{rango}</span>
      </div>
    );
}
  
function LabeledInput({ label, value, onChange, min = 0, step = 1 }) {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</span>
        <input type="number" min={min} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full rounded-lg border-gray-300 bg-gray-50/80 px-4 py-2.5 text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-lime-400 focus:bg-white focus:ring-lime-400 focus:ring-1" />
      </label>
    );
}

function Stat({ label, value, highlight = true }) {
    return (
      <div className={`rounded-xl p-5 ${highlight ? 'bg-lime-100/50 border-lime-200' : 'bg-slate-100/80 border-slate-200'} border`}>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-green-700' : 'text-slate-800'}`}>{value}</p>
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
        <div className="px-4 pb-4 text-slate-600">
          {children}
        </div>
      </details>
    );
}

const ChevronDownIcon = () => (
    <svg className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
);
