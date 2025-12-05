import { useState } from "react";

// Reemplazar la importación de Prisma con una constante local
const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

// const TOUCH_UPGRADE_PRICE = 10000; // Ya no es necesario, se gestiona como Extra
const BRAND_BLUE = "#5188C9";
const BRAND_TEAL = "#03A4A4";

// const TOUCH_MODEL_IDS = new Set([ ... ]); // Ya no es necesario

// const caracteristicasPorModelo = { ... }; // Ya no es necesario

export default function Step2ModelDetails({ modelo, vendingType, onNext, onBack }) {
  // const [isTouch, setIsTouch] = useState(false); // Ya no es necesario

  const descripcionModelo = modelo?.description || ""; // Ahora viene del modelo
  const precioBase = Number(modelo?.basePrice ?? 0); // Ahora viene del modelo

  // La lógica de "Touch Upgrade" se moverá a extras, así que esto se simplifica
  // const isTouchModel = TOUCH_MODEL_IDS.has(modelo?.id) || /touch/i.test(modelo?.id || "");
  // const allowTouchUpgrade = vendingType === "Tradicional" && !isTouchModel;

  // let touchIncrement = 0; // Ya no es necesario
  // const precioFinal = precioBase + touchIncrement; // Ahora es solo el precio base del modelo
  const caracteristicas = modelo?.features || []; // Ahora viene del modelo

  return (
    <section className="w-full">
      <div className="bg-white/95 border border-gray-100 rounded-2xl shadow-xl p-6 md:p-8">
        {/* Encabezado */}
        <header className="mb-4 md:mb-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              {modelo?.name ?? "—"}
            </h3>

            {modelo?.vendingType && modelo.vendingType !== VendingTypeEnum.NONE && (
              <span
                className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: BRAND_BLUE }}
              >
                {modelo.vendingType}
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
        {caracteristicas.length > 0 && (
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
        )}
        
        {/* Conversión a Touch (ya no aplica aquí, se gestiona como extra en Step3) */}
        {/* {allowTouchUpgrade && ( ... )} */}

        {/* Precio */}
        <div className="mt-6">
          <div className="h-1.5 w-16 rounded-full" style={{ background: BRAND_TEAL }} />
          <p className="mt-3 text-lg md:text-xl font-semibold text-gray-700">
            Precio Base:{" "}
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
              ${precioBase.toLocaleString()} MXN
            </span>
          </p>
          {/* {!!touchIncrement && ( ... )} */}
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
            onClick={() => onNext()} // Ya no pasamos touchIncrement
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
