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

  // Calculadora de ahorro
  const [garrafonesPorSemana, setGarrafonesPorSemana] = useState(3);
  const [precioGarrafon, setPrecioGarrafon] = useState(55);
  const [costoFiltrosAnual, setCostoFiltrosAnual] = useState(1500);
  const [costoEquipo, setCostoEquipo] = useState(3500);

  useEffect(() => {
    const fetchPurificadores = async () => {
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
    <section className="px-4 md:px-16 pt-28 pb-16 min-h-screen bg-white text-gray-800">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-black">
        Purificadores Caseros
      </h2>

      {purificadores.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay purificadores disponibles en este momento.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {purificadores.map((item) => {
            const precioN = Number(item.precio || 0);
            return (
              <article
                key={item.id}
                className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 flex flex-col items-center text-center transition hover:scale-[1.02]"
              >
                <img
                  src={item.imagen || "/placeholder.jpg"}
                  alt={item.nombre}
                  className="w-full h-48 object-cover rounded-2xl mb-4 shadow-sm"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold text-black mb-2">
                  {item.nombre}
                </h3>
                {item.descripcion && (
                  <p className="text-sm text-gray-700 mb-3">{item.descripcion}</p>
                )}
                <p className="text-lg font-bold text-green-600 mb-4">
                  {mxn(precioN)}
                </p>
                <button
                  onClick={() => handleAgregar(item)}
                  className="mb-2 px-6 py-2 rounded-xl font-semibold bg-[#ccff00] text-black hover:brightness-90 transition"
                >
                  Agregar al carrito
                </button>
                <button
                  onClick={() => navigate(`/videos/${item.id}`)}
                  className="text-blue-700 hover:underline text-sm font-medium"
                >
                  Ver video y detalles
                </button>
                {(item.pesoKg || item.largoCm) && (
                  <div className="mt-4 text-xs text-gray-600">
                    {item.pesoKg ? <div>Peso: {item.pesoKg} kg</div> : null}
                    {(item.largoCm || item.anchoCm || item.altoCm) && (
                      <div>
                        Dimensiones:{" "}
                        {[item.largoCm, item.anchoCm, item.altoCm]
                          .filter((v) => v != null && v !== "")
                          .join(" × ")}{" "}
                        cm
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-16 text-center">
        <button
          onClick={() => navigate("/videos")}
          className="bg-[#ccff00] hover:brightness-90 text-black px-8 py-3 rounded-xl font-semibold shadow-lg"
        >
          Ver todos los videos
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-20 space-y-14">
        <section aria-labelledby="beneficios-title">
          <h3 id="beneficios-title" className="text-2xl md:text-3xl font-bold mb-6">
            ¿Por qué comprar un purificador casero?
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard icon="💧" title="Mejor sabor y olor">
              Reduce cloro y compuestos que afectan el sabor; el agua se siente más fresca al instante.
            </InfoCard>
            <InfoCard icon="🛡️" title="Reducción de contaminantes">
              Los sistemas con carbón, UF o RO disminuyen sedimentos, metales y micro-impurezas (según el modelo).
            </InfoCard>
            <InfoCard icon="💵" title="Ahorro">
              Evita compras frecuentes de garrafones/botellas; recuperas la inversión en meses.
            </InfoCard>
            <InfoCard icon="🌱" title="Menos plástico">
              Menos botellas desechables y traslados. Beneficia tu bolsillo y al ambiente.
            </InfoCard>
            <InfoCard icon="🏠" title="Comodidad en casa">
              Agua al momento, para beber y cocinar. Sin cargas ni esperas de repartidor.
            </InfoCard>
            <InfoCard icon="✅" title="Control y transparencia">
              Sabes cuándo cambias filtros y qué tecnología usa tu equipo.
            </InfoCard>
          </div>
        </section>

        <section aria-labelledby="colocacion-title">
          <h3 id="colocacion-title" className="text-2xl md:text-3xl font-bold mb-6">
            ¿Dónde colocarlo?
          </h3>
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
        </section>

        <section aria-labelledby="elegir-title">
          <h3 id="elegir-title" className="text-2xl md:text-3xl font-bold mb-6">
            ¿Cómo elegir el modelo adecuado?
          </h3>
          <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
            <Checklist>Calidad del agua en tu zona (TDS, dureza, sabor).</Checklist>
            <Checklist>
              Tipo de filtración: Carbón (olor/sabor), UF (micro-impurezas), RO (sales/metales), UV (desinfección).
            </Checklist>
            <Checklist>Capacidad/flujo (GPD o L/h) acorde a tu familia.</Checklist>
            <Checklist>Espacio e instalación: bajo tarja vs encimera.</Checklist>
            <Checklist>Costos de consumibles y disponibilidad de repuestos.</Checklist>
            <Checklist>Certificaciones (p. ej., NSF/ANSI 42, 53, 58, 55, 401 según aplique).</Checklist>
            <Checklist>Garantía y soporte técnico local.</Checklist>
          </ul>
        </section>

        <section aria-labelledby="mantenimiento-title">
          <h3 id="mantenimiento-title" className="text-2xl md:text-3xl font-bold mb-6">
            Mantenimiento recomendado
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <MaintenanceRow etiqueta="Sedimentos (PP/PE)" rango="cada 3–6 meses" />
            <MaintenanceRow etiqueta="Carbón activado" rango="cada 6–12 meses" />
            <MaintenanceRow etiqueta="Membrana RO" rango="cada 18–36 meses" />
            <MaintenanceRow etiqueta="Lámpara UV" rango="cada 12 meses" />
            <MaintenanceRow etiqueta="Post-carbón / pulidor" rango="cada 6–12 meses" />
            <p className="text-sm text-gray-600 md:col-span-2">
              *Los intervalos varían según consumo y calidad del agua. Revisa caudal, sabor y recordatorios del equipo.
            </p>
          </div>
        </section>

        <section aria-labelledby="calc-title" className="rounded-2xl border p-6">
          <h3 id="calc-title" className="text-2xl md:text-3xl font-bold mb-4">
            Calculadora de ahorro
          </h3>
          <div className="grid md:grid-cols-4 gap-4 items-end">
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

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Stat label="Gasto mensual en garrafón" value={mxn(gastoMensualGarrafon)} />
            <Stat label="Gasto mensual con purificador" value={mxn(gastoMensualPurificador)} />
            <Stat label="Ahorro estimado al mes" value={mxn(ahorroMensual)} />
          </div>

          <div className="mt-4 text-sm text-gray-700">
            Ahorro estimado al año: <span className="font-semibold">{mxn(ahorroAnual)}</span>
            {mesesBreakEven ? (
              <> — Punto de equilibrio en <span className="font-semibold">{mesesBreakEven}</span> meses aprox.</>
            ) : (
              <> — Con los valores actuales no hay ahorro mensual.</>
            )}
            <p className="text-xs text-gray-500 mt-1">
              *Cálculo aproximado. Ajusta los valores a tus hábitos para un resultado más realista.
            </p>
          </div>
        </section>

        <section aria-labelledby="faq-title">
          <h3 id="faq-title" className="text-2xl md:text-3xl font-bold mb-6">
            Preguntas frecuentes
          </h3>
          <div className="space-y-3">
            <Faq q="¿El purificador elimina el flúor o la cal (sarro)?">
              Para reducir flúor y sales disueltas/dureza se recomienda <b>ósmosis inversa (RO)</b> u otros medios específicos.
            </Faq>
            <Faq q="¿Puedo instalarlo yo mismo?">
              Muchos equipos incluyen kit y manual; en bajo tarja suele ser sencillo. Si hay baja presión o perforación de tarja, considera técnico.
            </Faq>
            <Faq q="¿Qué pasa si tengo poca presión de agua?">
              Equipos RO pueden requerir <b>bomba booster</b> si la presión es baja (p. ej., &lt; 30 psi) para buen caudal y rechazo adecuado.
            </Faq>
            <Faq q="¿Cada cuándo cambio los filtros?">
              Depende del uso y del agua; guía típica arriba. Si notas menor flujo o cambio de sabor/olor, adelanta el reemplazo.
            </Faq>
            <Faq q="¿Sirve para cocinar?">
              Sí: mejora sabor en café, té, sopas y hielo; además evita incrustaciones en electrodomésticos según el modelo.
            </Faq>
          </div>
        </section>

        <div className="text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-[#ccff00] hover:brightness-90 text-black px-8 py-3 rounded-xl font-semibold shadow-lg"
          >
            Ver modelos disponibles
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, children }) {
  return (
    <div className="rounded-2xl border p-5 bg-white">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h4 className="font-semibold text-black">{title}</h4>
          <p className="text-sm text-gray-700 mt-1">{children}</p>
        </div>
      </div>
    </div>
  );
}

function PlacementCard({ icon, title, bullets = [] }) {
  return (
    <div className="rounded-2xl border p-5 bg-white">
      <div className="flex items-start gap-3 mb-2">
        <div className="text-2xl">{icon}</div>
        <h4 className="font-semibold text-black">{title}</h4>
      </div>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function Checklist({ children }) {
  return (
    <li className="flex items-start gap-2">
      <span className="select-none mt-0.5">✔️</span>
      <span>{children}</span>
    </li>
  );
}

function MaintenanceRow({ etiqueta, rango }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4 bg-gray-50">
      <span className="font-medium text-gray-900">{etiqueta}</span>
      <span className="text-sm text-gray-700">{rango}</span>
    </div>
  );
}

function LabeledInput({ label, value, onChange, min = 0, step = 1 }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[#ccff00]"
      />
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border p-4 bg-white">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold text-black mt-1">{value}</p>
    </div>
  );
}

function Faq({ q, children }) {
  return (
    <details className="rounded-xl border p-4 bg-white">
      <summary className="cursor-pointer font-medium text-black">{q}</summary>
      <div className="mt-2 text-sm text-gray-700">{children}</div>
    </details>
  );
}
