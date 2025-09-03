import React, { useState, useMemo } from "react";

const extrasPorMaquina = {
  Neptuno: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
  ],
  NeptunoAPlus: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
  ],

  Atlantis: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
  ],
  AtlantisMax: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
  ],

  AtlantisTouch: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
  ],

  Vending5: [
    { id: "permisos", nombre: "Permisos y Trámites", descripcion: "Requisitos legales incluidos", precio: 3000 },
    { id: "Volantes", nombre: "Volantes publicitarios", descripcion: "Diseño y creación de volantes publicitarios", precio: 1500 },
    { id: "limpieza", nombre: "5 bidones de 20 Litros", descripcion: "5 Productos de limpieza", precio: 3000 },
  ],
  Vending8: [
    { id: "permisos", nombre: "Permisos y Trámites", descripcion: "Requisitos legales incluidos", precio: 3000 },
    { id: "Volantes", nombre: "Volantes publicitarios", descripcion: "Diseño y creación de volantes publicitarios", precio: 1500 },
    { id: "limpieza", nombre: "8 bidones de 20 Litros", descripcion: "8 Productos de limpieza", precio: 3000 },
    { id: "Rack", nombre: "Rack para bidones ", descripcion: "Rack para bidones", precio: 8000 },
  ],
};

/* Imágenes por máquina/capacidad */
const TINACO_IMAGES = {
  default: {
    "tinaco-2500": "/img/tinacos/default-2500.jpg",
    "tinaco-5000": "/img/tinacos/default-5000.jpg",
  },
  Neptuno: {
    "tinaco-2500": "/img/tinacos/neptuno-2500.jpg",
    "tinaco-5000": "/img/tinacos/neptuno-5000.jpg",
  },
  NeptunoAPlus: {
    "tinaco-2500": "/img/tinacos/neptunoaplus-2500.jpg",
    "tinaco-5000": "/img/tinacos/neptunoaplus-5000.jpg",
  },
  Atlantis: {
    "tinaco-2500": "/img/tinacos/atlantis-2500.jpg",
    "tinaco-5000": "/img/tinacos/atlantis-5000.jpg",
  },
  AtlantisMax: {
    "tinaco-2500": "/img/tinacos/atlantismax-2500.jpg",
    "tinaco-5000": "/img/tinacos/atlantismax-5000.jpg",
  },
  AtlantisTouch: {
    "tinaco-2500": "/img/tinacos/atlantistouch-2500.jpg",
    "tinaco-5000": "/img/tinacos/atlantistouch-5000.jpg",
  },
};

const TINACO_IDS = ["tinaco-2500", "tinaco-5000"];

export default function Step3ExtrasConfigurator({ selectedModelId, onSelect, onNext, onBack }) {
  const extras = extrasPorMaquina[selectedModelId] || [];
  const [seleccionados, setSeleccionados] = useState([]);

  const modeloSoportaTinacos = selectedModelId !== "Vending5" && selectedModelId !== "Vending8";

  const selectedTinacoId = useMemo(
    () => seleccionados.find((id) => TINACO_IDS.includes(id)) || null,
    [seleccionados]
  );

  const tinacoImg = useMemo(() => {
    if (!modeloSoportaTinacos || !selectedTinacoId) return null;
    const porMaquina = TINACO_IMAGES[selectedModelId];
    return (porMaquina && porMaquina[selectedTinacoId]) || TINACO_IMAGES.default[selectedTinacoId] || null;
  }, [modeloSoportaTinacos, selectedModelId, selectedTinacoId]);

  const toggleExtra = (id) => {
    const extraSeleccionado = extras.find((e) => e.id === id);
    const esTinaco = extraSeleccionado?.nombre.toLowerCase().includes("tinaco");

    setSeleccionados((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (esTinaco) {
          const sinTinacos = prev.filter((itemId) => {
            const extra = extras.find((e) => e.id === itemId);
            return !extra?.nombre.toLowerCase().includes("tinaco");
          });
          return [...sinTinacos, id];
        }
        return [...prev, id];
      }
    });
  };

  const estaDeshabilitado = (extra) => {
    const hayTinacoSeleccionado = seleccionados.some((id) => {
      const seleccionado = extras.find((e) => e.id === id);
      return seleccionado?.nombre.toLowerCase().includes("tinaco");
    });
    const esTinaco = extra.nombre.toLowerCase().includes("tinaco");
    return hayTinacoSeleccionado && !seleccionados.includes(extra.id) && esTinaco;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Extras Opcionales</h2>

      {/* ✅ Vista previa ARRIBA */}
      {modeloSoportaTinacos && selectedTinacoId && tinacoImg && (
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800">Vista previa del tinaco</h3>
          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-50">
              <img
                src={tinacoImg}
                alt={`Imagen ${selectedTinacoId} para ${selectedModelId}`}
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Sugerencia visual para {selectedModelId} – {selectedTinacoId === "tinaco-2500" ? "2× 2500 L" : "2× 5000 L"}.
            </p>
          </div>
        </div>
      )}

      {/* Lista de extras */}
      <ul className="space-y-4 max-w-3xl mx-auto">
        {extras.map((extra) => (
          <li
            key={extra.id}
            className={`border rounded-lg p-4 cursor-pointer transition ${
              seleccionados.includes(extra.id)
                ? "border-gray-900 bg-gray-50"
                : "border-gray-300 hover:border-gray-500"
            } ${estaDeshabilitado(extra) ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (!estaDeshabilitado(extra)) toggleExtra(extra.id);
            }}
          >
            <div className="flex justify-between items-center gap-4">
              <div className="min-w-0">
                <p className="font-medium text-gray-800 break-words">{extra.nombre}</p>
                <p className="text-gray-500 text-sm">{extra.descripcion}</p>
                <p className="text-sm font-bold text-gray-700">
                  ${extra.precio.toLocaleString()} MXN
                </p>
              </div>
              <input
                type="checkbox"
                checked={seleccionados.includes(extra.id)}
                readOnly
                disabled={estaDeshabilitado(extra)}
                className="w-5 h-5 accent-black shrink-0"
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Botones */}
      <div className="flex flex-col md:flex-row justify-between gap-4 max-w-3xl mx-auto mt-8">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-800 rounded-lg px-6 py-3 hover:bg-gray-400"
        >
          ← Regresar
        </button>

        <button
          onClick={() => {
            const extrasSeleccionados = extras.filter((e) => seleccionados.includes(e.id));
            onSelect(extrasSeleccionados);
            onNext();
          }}
          className="bg-black text-white rounded-lg px-6 py-3 hover:opacity-90"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
