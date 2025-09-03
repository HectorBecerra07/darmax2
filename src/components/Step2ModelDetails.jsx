import { useState } from "react";

const TOUCH_UPGRADE_PRICE = 10000;
const BRAND_BLUE = "#5188C9";
const BRAND_TEAL = "#03A4A4";

// Modelos que YA son touch
const TOUCH_MODEL_IDS = new Set([
  "AtlantisTouch",
  "AtlantisMaxTouch",
  "MegalodonTouch",
  "MegalodonMaxTouch",
]);

const caracteristicasPorModelo = {
  Atlantis: [
    "500 garrafones por mes",
    "Filtrado por carbón activado",
    "Sistema UV incluido",
    "Bajo consumo energético",
    "Bomba 3/4 HP en acero inoxidable",
    "Presurizador automático",
    "Filtro de lecho profundo con gravas, arenas sílicas y zeolita (NSF)",
    "Filtro de carbón activado (NSF)",
    "Filtro suavizador con resina catiónica (NSF)",
    "Tanque de salmuera",
    'Portafiltro 10" Slim con cartucho polyspun',
    "Lámpara UV de 16 LPM con balastro en acero inoxidable",
    "Generador de ozono + ventury 3/4",
    "Despachador automático 4 modalidades (1L, 4L, 10L, 20L)",
    "Sensor de flujo, enjuague de garrafón y luz interna",
    "Pantalla con sistema de botones y sensado de litros",
    "Monedero antirrobo con sistema de cambio",
    "Vinil personalizable",
  ],
  AtlantisMax: [
    "800 garrafones por mes",
    "Ósmosis inversa con bomba multietapas especial",
    "Filtro lecho profundo + carbón + suavizador (NSF)",
    '2 portafiltros polyspun (20” y 10” Slim)',
    "UV de 16 LPM + generador de ozono + ventury 3/4",
    "Despachador automático 4 modalidades",
    "Pantalla de botones, sensor de flujo y luz interna",
    "Monedero antirrobo con cambio",
    "Vinil personalizable",
  ],
  AtlantisTouch: [
    "500 garrafones por mes",
    "Sistema completo de purificación + UV + ozono",
    "Gabinete de acero grado alimenticio",
    "Pantalla TOUCH interactiva de 8 pulgadas",
    "Despachador con 4 modalidades (1L, 4L, 10L, 20L)",
    "Sensado de litros, enjuague de garrafón",
    "Sensor de flujo, luz interna, 2 solenoides",
    "Monedero antirrobo con cambio",
    "Dispensador de tapas",
    "Marco en acero inoxidable",
    "Sistema de verificación de fallas",
    "Vinil personalizable contra luz UV",
  ],
  AtlantisMaxTouch: [
    "800 garrafones por mes",
    "Ósmosis inversa de alta producción",
    "Pantalla TOUCH interactiva de 8 pulgadas",
    "Gabinete de acero grado alimenticio",
    "Filtro lecho profundo, carbón activado y suavizador (NSF)",
    "UV 16 LPM + ozono + ventury",
    '2 portafiltros polyspun (20” y 10” Slim)',
    "Despachador automático 4 modalidades",
    "Monedero antirrobo con cambio",
    "Sensado de litros, luz interna, fallas, dispensador de tapas",
    "Vinil UV personalizado",
  ],
  // Purificadoras
  Neptuno: [
    "Bomba de 1/2 hp",
    "Presurizador automático",
    "Filtro de lecho profundo 10x54 (gravas, arenas sílicas, zeolita con certificación NSF)",
    "Filtro de carbón activado 10x54 (certificación NSF)",
    "Filtro suavizador 10x54 con resina catiónica (NSF), válvula manual 5 pasos",
    "Tanque de salmuera",
    'Portafiltro 10” Slim con cartucho polyspun',
    "Lámpara UV de 16 LPM con balastro en acero inoxidable",
    "Ventury de 3/4",
    "Generador de ozono",
    "Tarja de acero inoxidable (2 lavados internos, 2 externos, 2 llenados)",
  ],
  NeptunoAPlus: [
    "Bomba de 1/2 hp",
    "Presurizador automático",
    "Filtro de lecho profundo 10x54 (gravas, arenas sílicas, zeolita con certificación NSF)",
    "Filtro de carbón activado 10x54 (certificación NSF)",
    "Filtro suavizador 10x54 con resina catiónica (NSF), válvula manual 5 pasos",
    "Tanque de salmuera",
    "Filtro alcalino",
    'Portafiltro 10” Slim con cartucho polyspun',
    "Lámpara UV de 16 LPM con balastro en acero inoxidable",
    "Ventury de 3/4",
    "Generador de ozono",
    "Tarja de acero inoxidable (2 lavados internos, 2 externos, 2 llenados)",
  ],
  Vending5: [
    "Para 5 productos de limpieza",
    "Estructura 100% acero inoxidable calibre 18",
    "Vinil con acabado industrial",
    "Mangueras, conexiones, bombas y conectores incluidos",
    "Gabinete de acero inoxidable con llave (protección del dinero)",
    "Pantalla de servicio y botones de servicio",
    "Monedero: acepta monedas de $1, $2, $5 y $10 MXN y da cambio",
    "Registra ventas",
    "Fácil de operar",
    "Pantalla inicial",
    "Sensado de litros",
    "Llenado de 1 litro",
    "Precios de llenado configurables",
    "Luz interna",
    "Asesoría por videollamada para instalación (no incluye instalación)"
  ],
  Vending8: [
    "Para 8 productos de limpieza",
    "Estructura 100% acero inoxidable calibre 18",
    "Vinil con acabado industrial",
    "Mangueras, conexiones, bombas y conectores incluidos",
    "Gabinete de acero inoxidable con llave (protección del dinero)",
    "Pantalla de servicio y botones de servicio",
    "Monedero: acepta monedas de $1, $2, $5 y $10 MXN y da cambio",
    "Registra ventas",
    "Fácil de operar",
    "Pantalla inicial",
    "Sensado de litros",
    "Llenado de 1 litro",
    "Precios de llenado configurables",
    "Luz interna",
    "Asesoría por videollamada para instalación (no incluye instalación)"
  ],
};

export default function Step2ModelDetails({ modelo, vendingType, onNext, onBack }) {
  const [isTouch, setIsTouch] = useState(false);

  const descripcionModelo =
    modelo?.descripcion ??
    modelo?.descripción ??
    modelo?.desc ??
    "";

  const precioBase = Number(modelo?.precio ?? 0);

  // ¿El modelo YA es touch?
  const isTouchModel =
    TOUCH_MODEL_IDS.has(modelo?.id) || /touch/i.test(modelo?.id || "");

  // ¿Mostrar checkbox de upgrade?
  const allowTouchUpgrade = vendingType === "Tradicional" && !isTouchModel;

  // Incremento por touch (solo si NO es un modelo touch)
  let touchIncrement = 0;
  if (!isTouchModel) {
    if (vendingType === "Touch") {
      // Eligieron la variante touch de un modelo tradicional
      touchIncrement = TOUCH_UPGRADE_PRICE;
    } else if (allowTouchUpgrade && isTouch) {
      // Tradicional + checkbox activado
      touchIncrement = TOUCH_UPGRADE_PRICE;
    }
  }

  const precioFinal = precioBase + touchIncrement;
  const caracteristicas = caracteristicasPorModelo[modelo?.id] || [];

  return (
    <section className="w-full">
      <div className="bg-white/95 border border-gray-100 rounded-2xl shadow-xl p-6 md:p-8">
        {/* Encabezado */}
        <header className="mb-4 md:mb-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              {modelo?.nombre ?? "—"}
            </h3>

            {vendingType && (
              <span
                className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: BRAND_BLUE }}
              >
                {vendingType}
              </span>
            )}
          </div>

          {descripcionModelo && (
            <p className="mt-1 text-gray-700 italic leading-relaxed break-words">
              {descripcionModelo}
            </p>
          )}
        </header>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5" />

        {/* Lista de características */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-800">
          {caracteristicas.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg
                className="mt-[2px] w-5 h-5 shrink-0"
                viewBox="0 0 20 20"
                fill={BRAND_TEAL}
                aria-hidden="true"
              >
                <path d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3A1 1 0 1 1 6.293 9.293l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0z" />
              </svg>
              <span className="text-sm leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>

        {/* Conversión a Touch (solo si aplica) */}
        {allowTouchUpgrade && (
          <div className="mt-6 flex items-center gap-3">
            <input
              id="touch"
              type="checkbox"
              checked={isTouch}
              onChange={() => setIsTouch((v) => !v)}
              className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="touch" className="text-sm font-medium text-gray-900">
              Convertir a pantalla Touch{" "}
              <span className="text-gray-500">
                (+ ${TOUCH_UPGRADE_PRICE.toLocaleString()} MXN)
              </span>
            </label>
          </div>
        )}

        {/* Precio */}
        <div className="mt-6">
          <div className="h-1.5 w-16 rounded-full" style={{ background: BRAND_TEAL }} />
          <p className="mt-3 text-lg md:text-xl font-semibold text-gray-700">
            Desde{" "}
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
              ${precioFinal.toLocaleString()} MXN
            </span>
          </p>
          {!!touchIncrement && (
            <p className="text-xs text-gray-500 mt-1">
              Incluye conversión a pantalla touch (+ $
              {TOUCH_UPGRADE_PRICE.toLocaleString()}).
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="inline-flex justify-center items-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 active:scale-[0.99] transition"
          >
            ← Regresar
          </button>

          <button
            onClick={() => onNext(touchIncrement)}
            className="inline-flex justify-center items-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg active:scale-[0.99] transition"
            style={{ background: BRAND_BLUE }}
          >
            Siguiente: Personaliza tu equipo →
          </button>
        </div>
      </div>
    </section>
  );
}
