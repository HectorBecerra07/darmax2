import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ModalAssociateExtra = ({ show, onClose, onSaveSuccess, model, allExtras, modelExtraToEdit }) => {
  const [formData, setFormData] = useState({
    extraId: "",
    priceOverride: "",
    isDefault: false,
    isRequired: false,
    sortOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtra los extras que ya están asociados a este modelo
  const availableExtras = allExtras.filter(
    e => !model?.extras.some(me => me.extraId === e.id)
  );

  useEffect(() => {
    if (modelExtraToEdit) {
        setFormData({
            extraId: modelExtraToEdit.extraId,
            priceOverride: modelExtraToEdit.priceOverride?.toString() || "",
            isDefault: modelExtraToEdit.isDefault || false,
            isRequired: modelExtraToEdit.isRequired || false,
            sortOrder: modelExtraToEdit.sortOrder || 0,
        });
    } else {
        setFormData({
            extraId: "",
            priceOverride: "",
            isDefault: false,
            isRequired: false,
            sortOrder: 0,
        });
    }
    setIsSubmitting(false);
  }, [modelExtraToEdit, show]);

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
    if (!modelExtraToEdit && !formData.extraId) {
        toast.error("Debes seleccionar un extra para asociar.");
        return;
    }
    
    setIsSubmitting(true);
    let toastId;
    try {
      toastId = toast.loading(modelExtraToEdit ? "Actualizando asociación..." : "Asociando extra...");
      
      const url = modelExtraToEdit
        ? `${API_URL}/api/configurador/modelextras/${modelExtraToEdit.id}`
        : `${API_URL}/api/configurador/modelextras`;
      const method = modelExtraToEdit ? "PUT" : "POST";
      
      const body = {
          ...formData,
          modelId: model.id,
          priceOverride: formData.priceOverride ? parseInt(formData.priceOverride) : null,
          sortOrder: parseInt(formData.sortOrder) || 0,
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en el servidor");
      }

      toast.dismiss(toastId);
      onSaveSuccess();

    } catch (error) {
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
          {modelExtraToEdit ? 'Editar Asociación de Extra' : `Asociar Extra a ${model?.name}`}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Selector de Extra (solo para crear) */}
          {!modelExtraToEdit && (
            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Extra a vincular</label>
                <select name="extraId" value={formData.extraId} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required>
                    <option value="">-- Selecciona un extra --</option>
                    {availableExtras.map(extra => (
                        <option key={extra.id} value={extra.id}>{extra.name}</option>
                    ))}
                </select>
            </div>
          )}

          {/* Price Override */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sobrescribir Precio (Opcional)</label>
            <input
              type="number"
              name="priceOverride"
              placeholder="Dejar vacío para usar el precio base del extra"
              value={formData.priceOverride}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700"
            />
          </div>
          
          {/* Sort Order */}
           <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Orden de Aparición</label>
            <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" />
          </div>


          {/* Checkboxes */}
          <div className="flex justify-between items-center pt-2">
             <div className="flex items-center gap-2">
                <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="h-4 w-4 rounded" />
                <label htmlFor="isDefault" className="text-sm font-medium text-slate-700 dark:text-slate-300">Es opción por defecto</label>
            </div>
             <div className="flex items-center gap-2">
                <input type="checkbox" id="isRequired" name="isRequired" checked={formData.isRequired} onChange={handleChange} className="h-4 w-4 rounded" />
                <label htmlFor="isRequired" className="text-sm font-medium text-slate-700 dark:text-slate-300">Es requerido</label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700" disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-4 py-2 disabled:bg-gray-400" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Asociación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAssociateExtra;
