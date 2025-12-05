import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ModalExtraForm = ({ show, onClose, onSaveSuccess, extra }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    basePrice: "",
    isTinaco: false,
    tinacoKey: "",
    tinacoCapacityLiters: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (extra) {
      setFormData({
        code: extra.code || "",
        name: extra.name || "",
        description: extra.description || "",
        basePrice: extra.basePrice?.toString() || "",
        isTinaco: extra.isTinaco || false,
        tinacoKey: extra.tinacoKey || "",
        tinacoCapacityLiters: extra.tinacoCapacityLiters?.toString() || "",
      });
    } else {
      // Reset form for new extra
      setFormData({
        code: "",
        name: "",
        description: "",
        basePrice: "",
        isTinaco: false,
        tinacoKey: "",
        tinacoCapacityLiters: "",
      });
    }
    setIsSubmitting(false);
  }, [extra, show]);

  if (!show) return null;
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let toastId;
    try {
      toastId = toast.loading(extra ? "Actualizando..." : "Creando...");

      const url = extra ? `${API_URL}/api/configurador/extras/${extra.id}` : `${API_URL}/api/configurador/extras`;
      const method = extra ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            basePrice: parseInt(formData.basePrice) || 0,
            tinacoCapacityLiters: formData.tinacoCapacityLiters ? parseInt(formData.tinacoCapacityLiters) : null,
        }),
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
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-[32rem] max-w-full space-y-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{extra ? "Editar Extra" : "Nuevo Extra"}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Code */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Código (Slug)</label>
            <input type="text" name="code" placeholder="ej. agua-alcalina" value={formData.code} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required />
          </div>

          {/* Name */}
          <div>
             <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre</label>
            <input type="text" name="name" placeholder="Agua Alcalina" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required />
          </div>

          {/* Description */}
          <div>
             <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descripción</label>
            <textarea name="description" placeholder="Sistema de producción de agua alcalina" value={formData.description} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" rows="2" />
          </div>

          {/* Base Price */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Precio Base</label>
            <input type="number" name="basePrice" placeholder="12000" value={formData.basePrice} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required />
          </div>

          {/* Is Tinaco Checkbox */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isTinaco" name="isTinaco" checked={formData.isTinaco} onChange={handleChange} className="h-4 w-4 rounded" />
            <label htmlFor="isTinaco" className="text-sm font-medium text-slate-700 dark:text-slate-300">Es un Tinaco</label>
          </div>
          
          {/* Tinaco-specific fields */}
          {formData.isTinaco && (
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-md dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Tinaco Key</label>
                    <input type="text" name="tinacoKey" placeholder="Opcional" value={formData.tinacoKey} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" />
                </div>
                 <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Capacidad (L)</label>
                    <input type="number" name="tinacoCapacityLiters" placeholder="1100" value={formData.tinacoCapacityLiters} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" />
                </div>
            </div>
          )}

          {/* Action Buttons */}
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

export default ModalExtraForm;
