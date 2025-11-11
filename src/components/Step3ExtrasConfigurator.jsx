import React, { useState, useMemo } from "react";

const extrasPorMaquina = {
  Neptuno: [
    { id: "tinaco-2500", nombre: "1 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 5500 },
    { id: "tinaco-5000", nombre: "1 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
    { id: "Seguro-Anual", nombre: "Seguro Anual", descripcion: "Plan de seguro anual", precio: 5800 },
  ],
  NeptunoAPlus: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
    { id: "Seguro-Anual", nombre: "Seguro Anual", descripcion: "Plan de seguro anual", precio: 5800 },
  ],

  Atlantis: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
    { id: "Seguro-Anual", nombre: "Seguro Anual", descripcion: "Plan de seguro anual", precio: 5800 },
  ],
  AtlantisMax: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
    { id: "Seguro-Anual", nombre: "Seguro Anual", descripcion: "Plan de seguro anual", precio: 5800 },
  ],

  AtlantisTouch: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
    { id: "Seguro-Anual", nombre: "Seguro Anual", descripcion: "Plan de seguro anual", precio: 5800 },
  ],
  AtlantisMaxTouch: [
    { id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },
    { id: "tinaco-5000", nombre: "2 Tinacos 5000L", descripcion: "Para almacenamiento", precio: 21000 },
    { id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },
    { id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", descripcion: "Requisitos legales y tramites", precio: 3500 },
    { id: "Kit", nombre: "Insumos anuales", descripcion: "Kit de insumos anuales", precio: 4500 },
    { id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },
    { id: "Seguro-Anual", nombre: "Seguro Anual", descripcion: "Plan de seguro anual", precio: 5800 },
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
    "tinaco-2500": "/img/TINACOS/0035.png",
    "tinaco-5000": "/img/TINACOS/0036.png",
  },
  Neptuno: {
    "tinaco-2500": "/img/TINACOS/0035.png",
    "tinaco-5000": "/img/TINACOS/0036.png",
  },
  NeptunoAPlus: {
    "tinaco-2500": "/img/TINACOS/0026.png",
    "tinaco-5000": "/img/TINACOS/0028.png",
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

/*
 * TINACO_ALCALINA_IMAGES: Define las rutas de las imágenes para los tinacos
 * cuando se selecciona el extra de "Agua alcalina".
 * NOTA: Estas son rutas de marcador de posición y deben ser reemplazadas por imágenes reales.
 */
const TINACO_ALCALINA_IMAGES = {
  default: {
    "tinaco-2500": "/img/TINACOS/alcalina/207.png", // Placeholder: Reemplazar con imagen real de tinaco-2500 con agua alcalina
    "tinaco-5000": "/img/TINACOS/0036-alcalina.png", // Placeholder: Reemplazar con imagen real de tinaco-5000 con agua alcalina
  },
  Neptuno: {
    "tinaco-2500": "/img/TINACOS/alcalina/231.png",
    "tinaco-5000": "/img/TINACOS/alcalina/232.png",
  },
  NeptunoAPlus: {
    "tinaco-2500": "/img/TINACOS/alcalina/221.png",
    "tinaco-5000": "/img/TINACOS/alcalina/223.png",
  },
  Atlantis: {
    "tinaco-2500": "/img/tinacos/atlantis-2500-alcalina.jpg",
    "tinaco-5000": "/img/tinacos/atlantis-5000-alcalina.jpg",
  },
  AtlantisMax: {
    "tinaco-2500": "/img/tinacos/atlantismax-2500-alcalina.jpg",
    "tinaco-5000": "/img/tinacos/atlantismax-5000-alcalina.jpg",
  },
  AtlantisTouch: {
    "tinaco-2500": "/img/tinacos/atlantistouch-2500-alcalina.jpg",
    "tinaco-5000": "/img/tinacos/atlantistouch-5000-alcalina.jpg",
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

  /*
   * tinacoImg: Calcula la ruta de la imagen del tinaco a mostrar.
   * Si el extra "agua-alcalina" está seleccionado, usa las imágenes de TINACO_ALCALINA_IMAGES.
   * De lo contrario, usa las imágenes estándar de TINACO_IMAGES.
   */
  const tinacoImg = useMemo(() => {
    if (!modeloSoportaTinacos || !selectedTinacoId) return null;

    const hasAguaAlcalina = seleccionados.includes("agua-alcalina");

    let imageSource = TINACO_IMAGES;
    if (hasAguaAlcalina) {
      imageSource = TINACO_ALCALINA_IMAGES;
    }

    const porMaquina = imageSource[selectedModelId];
    return (porMaquina && porMaquina[selectedTinacoId]) || imageSource.default[selectedTinacoId] || null;
  }, [modeloSoportaTinacos, selectedModelId, selectedTinacoId, seleccionados]);

  /*
   * displayString: Genera el texto de sugerencia visual para el tinaco.
   * Incluye el nombre del tinaco seleccionado y los nombres de otros extras seleccionados,
   * unidos por "+".
   */
  const displayString = useMemo(() => {
    if (!selectedTinacoId) return "";

    const selectedTinacoExtra = extras.find((extra) => extra.id === selectedTinacoId);
    const tinacoNombre = selectedTinacoExtra ? selectedTinacoExtra.nombre : "";

    const otherSelectedExtras = seleccionados.filter(
      (id) => id !== selectedTinacoId
    );

    const otherExtrasNames = otherSelectedExtras
      .map((id) => extras.find((extra) => extra.id === id)?.nombre)
      .filter(Boolean);

    let result = tinacoNombre;
    if (otherExtrasNames.length > 0) {
      result += " + " + otherExtrasNames.join(" + ");
    }
    return result;
  }, [selectedTinacoId, seleccionados, extras]);

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
            {/* Muestra la sugerencia visual del tinaco y los extras seleccionados */}
            <p className="text-xs text-gray-500 mt-2">
              Sugerencia visual para {selectedModelId} – {displayString}.
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
