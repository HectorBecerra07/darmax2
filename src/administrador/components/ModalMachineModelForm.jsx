import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const VendingType = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

const ModalMachineModelForm = ({ show, onClose, onSaveSuccess, model }) => {
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    basePrice: 0,
    description: "",
    features: "", // Se manejará como un string, separado por saltos de línea
    supportsTinacos: true,
    isAtlantis: false,
    vendingType: VendingType.NONE,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (model) {
      setFormData({
        slug: model.slug || "",
        name: model.name || "",
        basePrice: model.basePrice || 0,
        description: model.description || "",
        features: Array.isArray(model.features) ? model.features.join("\n") : "",
        supportsTinacos: model.supportsTinacos || false,
        isAtlantis: model.isAtlantis || false,
        vendingType: model.vendingType || VendingType.NONE,
      });
    } else {
      setFormData({
        slug: "",
        name: "",
        basePrice: 0,
        description: "",
        features: "",
        supportsTinacos: true,
        isAtlantis: false,
        vendingType: VendingType.NONE,
      });
    }
    setIsSubmitting(false);
  }, [model, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let toastId;
    try {
      toastId = toast.loading(model ? "Actualizando modelo..." : "Creando modelo...");

      const url = model
        ? `${API_URL}/api/configurador/models/${model.id}`
        : `${API_URL}/api/configurador/models`;
      const method = model ? "PUT" : "POST";

      const dataToSend = {
        ...formData,
        basePrice: parseInt(formData.basePrice) || 0,
        features: formData.features.split("\n").filter(line => line.trim() !== ""), // Convertir string a array
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en el servidor");
      }

      toast.dismiss(toastId);
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      if (toastId) toast.dismiss(toastId);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-[40rem] max-w-full space-y-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {model ? "Editar Modelo de Máquina" : "Nuevo Modelo de Máquina"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre</label>
              <input type="text" name="name" placeholder="Neptuno A-Plus" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
              <input type="text" name="slug" placeholder="NeptunoAPlus" value={formData.slug} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required />
            </div>
             <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Precio Base</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required />
            </div>
             <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Vending</label>
                <select name="vendingType" value={formData.vendingType} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700">
                    <option value={VendingType.NONE}>Ninguno / Purificadora</option>
                    <option value={VendingType.TRADICIONAL}>Tradicional</option>
                    <option value={VendingType.TOUCH}>Touch</option>
                </select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descripción</label>
            <textarea name="description" placeholder="Descripción corta del modelo" value={formData.description} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" rows="2" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Características (una por línea)</label>
            <textarea name="features" placeholder="Característica 1&#10;Característica 2&#10;Característica 3" value={formData.features} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" rows="5" />
          </div>

          <div className="flex justify-between items-center pt-2">
             <div className="flex items-center gap-2">
                <input type="checkbox" id="supportsTinacos" name="supportsTinacos" checked={formData.supportsTinacos} onChange={handleChange} className="h-4 w-4 rounded" />
                <label htmlFor="supportsTinacos" className="text-sm font-medium text-slate-700 dark:text-slate-300">Soporta Tinacos</label>
            </div>
             <div className="flex items-center gap-2">
                <input type="checkbox" id="isAtlantis" name="isAtlantis" checked={formData.isAtlantis} onChange={handleChange} className="h-4 w-4 rounded" />
                <label htmlFor="isAtlantis" className="text-sm font-medium text-slate-700 dark:text-slate-300">Es Atlantis</label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700" disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-4 py-2 disabled:bg-gray-400" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalMachineModelForm;