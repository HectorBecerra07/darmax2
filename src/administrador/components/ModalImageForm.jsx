import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const imageContextOptions = [
  "MODEL_BASE",
  "MODEL_BASE_ALCALINA",
  "TINACO",
  "TINACO_ALCALINA",
  "SECONDARY",
  "SECONDARY_ALCALINA",
];

const ModalImageForm = ({ show, onClose, onSaveSuccess, model, allExtras, imageToEdit }) => {
  const [formData, setFormData] = useState({
    url: "",
    alt: "",
    context: "MODEL_BASE",
    priority: 0,
    tinacoExtraId: "",
    onlyWhenAlcalina: false,
    isSecondary: false,
    secondaryVariantKey: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tinacoExtras = allExtras.filter(e => e.isTinaco);

  useEffect(() => {
    if (imageToEdit) {
      setFormData({
        url: imageToEdit.url || "",
        alt: imageToEdit.alt || "",
        context: imageToEdit.context || "MODEL_BASE",
        priority: imageToEdit.priority || 0,
        tinacoExtraId: imageToEdit.tinacoExtraId || "",
        onlyWhenAlcalina: imageToEdit.onlyWhenAlcalina || false,
        isSecondary: imageToEdit.isSecondary || false,
        secondaryVariantKey: imageToEdit.secondaryVariantKey || ""
      });
    } else {
      setFormData({
        url: "",
        alt: "",
        context: "MODEL_BASE",
        priority: 0,
        tinacoExtraId: "",
        onlyWhenAlcalina: false,
        isSecondary: false,
        secondaryVariantKey: ""
      });
    }
    setIsSubmitting(false);
  }, [imageToEdit, show]);

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
    if (!formData.url || !formData.alt || !formData.context) {
        toast.error("URL, Texto Alternativo y Contexto son requeridos.");
        return;
    }
    
    setIsSubmitting(true);
    let toastId;
    try {
      toastId = toast.loading(imageToEdit ? "Actualizando imagen..." : "Guardando imagen...");
      
      const url = imageToEdit
        ? `${API_URL}/api/configurador/images/${imageToEdit.id}`
        : `${API_URL}/api/configurador/images`;
      const method = imageToEdit ? "PUT" : "POST";
      
      const body = {
          ...formData,
          modelId: model.id,
          priority: parseInt(formData.priority) || 0,
          tinacoExtraId: formData.tinacoExtraId === "" ? null : formData.tinacoExtraId,
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
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-[40rem] max-w-full space-y-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {imageToEdit ? 'Editar Imagen de Configuración' : `Nueva Imagen para ${model?.name}`}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL de la Imagen</label>
            <input type="url" name="url" placeholder="https://..." value={formData.url} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Texto Alternativo (Alt)</label>
            <input type="text" name="alt" placeholder="Descripción de la imagen" value={formData.alt} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contexto</label>
                <select name="context" value={formData.context} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" required>
                    {imageContextOptions.map(ctx => <option key={ctx} value={ctx}>{ctx}</option>)}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Prioridad</label>
                <input type="number" name="priority" value={formData.priority} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" />
            </div>
          </div>
          
           <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vincular a Tinaco (Opcional)</label>
                <select name="tinacoExtraId" value={formData.tinacoExtraId} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700">
                    <option value="">-- Ninguno --</option>
                    {tinacoExtras.map(extra => (
                        <option key={extra.id} value={extra.id}>{extra.name}</option>
                    ))}
                </select>
            </div>
          
            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Clave de Variante Secundaria (Opcional)</label>
                <input type="text" name="secondaryVariantKey" placeholder="ej. 4-botones" value={formData.secondaryVariantKey} onChange={handleChange} className="w-full border rounded p-2 mt-1 bg-white dark:bg-slate-800 dark:border-slate-700" />
          </div>

          <div className="flex justify-between items-center pt-2 text-sm">
             <div className="flex items-center gap-2">
                <input type="checkbox" id="onlyWhenAlcalina" name="onlyWhenAlcalina" checked={formData.onlyWhenAlcalina} onChange={handleChange} className="h-4 w-4 rounded" />
                <label htmlFor="onlyWhenAlcalina">Solo con Agua Alcalina</label>
            </div>
             <div className="flex items-center gap-2">
                <input type="checkbox" id="isSecondary" name="isSecondary" checked={formData.isSecondary} onChange={handleChange} className="h-4 w-4 rounded" />
                <label htmlFor="isSecondary">Es Imagen Secundaria</label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700" disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-4 py-2 disabled:bg-gray-400" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Imagen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalImageForm;
