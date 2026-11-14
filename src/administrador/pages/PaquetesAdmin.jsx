import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
  DEFAULT_BUNDLE_PRICES, 
  getBundlePrices, 
  saveBundlePrices 
} from "../../services/bundlePricingService";
import { 
  SparklesIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

export default function PaquetesAdmin() {
  const [prices, setPrices] = useState(DEFAULT_BUNDLE_PRICES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getBundlePrices(true);
        setPrices(data);
      } catch (error) {
        console.error("Error al cargar precios de paquetes:", error);
        toast.error("Error al cargar precios de paquetes.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const handlePriceChange = (bundleKey, aguaKey, limpiezaKey, val) => {
    const numeric = parseInt(val, 10);
    const safeVal = isNaN(numeric) ? 0 : Math.max(0, numeric);

    setPrices((prev) => ({
      ...prev,
      [bundleKey]: {
        ...prev[bundleKey],
        [aguaKey]: {
          ...(prev[bundleKey]?.[aguaKey] || {}),
          [limpiezaKey]: safeVal,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBundlePrices(prices);
      toast.success("Precios de paquetes actualizados correctamente.");
    } catch (error) {
      console.error("Error al guardar precios:", error);
      toast.error(error.message || "Error al guardar precios.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("¿Deseas restablecer los precios a los valores predeterminados?")) {
      setPrices(DEFAULT_BUNDLE_PRICES);
      toast("Valores por defecto cargados. Recuerda guardar cambios.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-montserrat not-italic text-left pb-16">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#168387]">
            Configurador de Combos
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
            Precios de Paquetes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona los precios base con descuento de cada paquete según la combinación de equipos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Restablecer por Defecto
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#168387] hover:bg-[#126b6e] text-white text-xs font-bold uppercase tracking-wider transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                <span>Guardar Precios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. DÚO EMPRENDEDOR TOUCH */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Dúo Emprendedor — Versión Touch
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Touch Atlantis 300 Max + Limpieza 8 Productos
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Duo-Emprendedor"]?.["AtlantisMaxTouch"]?.["Vending8"] ?? 141900}
                onChange={(e) => handlePriceChange("Duo-Emprendedor", "AtlantisMaxTouch", "Vending8", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Touch Atlantis 300 Max + Limpieza 5 Productos
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Duo-Emprendedor"]?.["AtlantisMaxTouch"]?.["Vending5"] ?? 131900}
                onChange={(e) => handlePriceChange("Duo-Emprendedor", "AtlantisMaxTouch", "Vending5", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Touch Atlantis 300 + Limpieza 8 Productos
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Duo-Emprendedor"]?.["AtlantisTouch"]?.["Vending8"] ?? 113900}
                onChange={(e) => handlePriceChange("Duo-Emprendedor", "AtlantisTouch", "Vending8", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Touch Atlantis 300 + Limpieza 5 Productos
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Duo-Emprendedor"]?.["AtlantisTouch"]?.["Vending5"] ?? 103900}
                onChange={(e) => handlePriceChange("Duo-Emprendedor", "AtlantisTouch", "Vending5", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. DÚO EMPRENDEDOR TRADICIONAL */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Dúo Emprendedor — Versión Tradicional
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Tradicional Atlantis 300 Max + Limpieza 8 Productos
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Duo-Emprendedor"]?.["AtlantisMax"]?.["Vending8"] ?? 137900}
                onChange={(e) => handlePriceChange("Duo-Emprendedor", "AtlantisMax", "Vending8", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Tradicional Atlantis 300 Max + Limpieza 5 Productos
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Duo-Emprendedor"]?.["AtlantisMax"]?.["Vending5"] ?? 127900}
                onChange={(e) => handlePriceChange("Duo-Emprendedor", "AtlantisMax", "Vending5", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Tradicional Atlantis 300 + Limpieza 8 Productos
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Duo-Emprendedor"]?.["Atlantis"]?.["Vending8"] ?? 109900}
                onChange={(e) => handlePriceChange("Duo-Emprendedor", "Atlantis", "Vending8", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Tradicional Atlantis 300 + Limpieza 5 Productos
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Duo-Emprendedor"]?.["Atlantis"]?.["Vending5"] ?? 99900}
                onChange={(e) => handlePriceChange("Duo-Emprendedor", "Atlantis", "Vending5", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TRIDENTE */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Paquete Tridente (Vending Agua + Mostrador + Limpieza 5 Productos)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Touch Atlantis 300 Max Touch con Mostrador + Limpieza 5
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Tridente"]?.["AtlantisMaxTouch"]?.["Vending5"] ?? 152900}
                onChange={(e) => handlePriceChange("Tridente", "AtlantisMaxTouch", "Vending5", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Touch Atlantis 300 Touch con Mostrador + Limpieza 5
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Tridente"]?.["AtlantisTouch"]?.["Vending5"] ?? 124900}
                onChange={(e) => handlePriceChange("Tridente", "AtlantisTouch", "Vending5", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Tradicional Atlantis 300 Max con Mostrador + Limpieza 5
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Tridente"]?.["AtlantisMax"]?.["Vending5"] ?? 148900}
                onChange={(e) => handlePriceChange("Tridente", "AtlantisMax", "Vending5", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Tradicional Atlantis 300 con Mostrador + Limpieza 5
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Tridente"]?.["Atlantis"]?.["Vending5"] ?? 120900}
                onChange={(e) => handlePriceChange("Tridente", "Atlantis", "Vending5", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. MEGALODÓN */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Paquete Megalodón (Vending Agua + Mostrador + Limpieza 8 Productos)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Touch Atlantis 300 Max con Mostrador + Limpieza 8
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Megalodon"]?.["AtlantisMaxTouch"]?.["Vending8"] ?? 162900}
                onChange={(e) => handlePriceChange("Megalodon", "AtlantisMaxTouch", "Vending8", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Touch Atlantis 300 con Mostrador + Limpieza 8
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Megalodon"]?.["AtlantisTouch"]?.["Vending8"] ?? 134900}
                onChange={(e) => handlePriceChange("Megalodon", "AtlantisTouch", "Vending8", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Tradicional Atlantis 300 Max con Mostrador + Limpieza 8
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Megalodon"]?.["AtlantisMax"]?.["Vending8"] ?? 158900}
                onChange={(e) => handlePriceChange("Megalodon", "AtlantisMax", "Vending8", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Vending Tradicional Atlantis 300 con Mostrador + Limpieza 8
            </span>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={prices["Megalodon"]?.["Atlantis"]?.["Vending8"] ?? 130900}
                onChange={(e) => handlePriceChange("Megalodon", "Atlantis", "Vending8", e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
