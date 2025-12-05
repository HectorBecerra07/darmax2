import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ModalMachineModelForm = ({ show, onClose, onSaveSuccess, model }) => {
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    supportsTinacos: true,
    isAtlantis: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (model) {
      setFormData({
        slug: model.slug || "",
        name: model.name || "",
        supportsTinacos: model.supportsTinacos || false,
        isAtlantis: model.isAtlantis || false,
      });
    } else {
      setFormData({
        slug: "",
        name: "",
        supportsTinacos: true,
        isAtlantis: false,
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-[32rem] max-w-full space-y-4 shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {model ? "Editar Modelo de Máquina" : "Nuevo Modelo de Máquina"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Neptuno A-Plus"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
            <input
              type="text"
              name="slug"
              placeholder="NeptunoAPlus"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700"
              required
            />
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
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-4 py-2 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalMachineModelForm;
