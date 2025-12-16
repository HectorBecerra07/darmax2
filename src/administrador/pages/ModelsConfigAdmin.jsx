import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ModalMachineModelForm from "../components/ModalMachineModelForm";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const API_URL = import.meta.env.VITE_API_URL;

const ModelsConfigAdmin = () => { // Renombrado el componente
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/configurador/models`);
      if (!response.ok) throw new Error("Error al cargar los modelos de máquina");
      const data = await response.json();
      setModels(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData() }, []);

  const handleOpenModelModal = (model = null) => { setEditingModel(model); setIsModelModalOpen(true); };
  const handleCloseModelModal = () => setIsModelModalOpen(false);
  const handleSaveModelSuccess = () => { handleCloseModelModal(); toast.success("Modelo guardado!"); fetchData(); };
  const handleDeleteModel = async (modelId) => {
    if (!window.confirm("¿SEGURO? Se borrará el modelo y TODAS sus asociaciones y extras.")) return;
    const toastId = toast.loading("Eliminando modelo...");
    try {
      const res = await fetch(`${API_URL}/api/configurador/models/${modelId}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).message || "No se pudo eliminar");
      toast.success("Modelo eliminado.", { id: toastId });
      fetchData();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };
  
  // Función para navegar a la página de detalles del modelo
  const handleManageDetails = (slug) => {
    navigate(`/admin/dashboard/configurador/model/${slug}`);
  };

  if (loading) return <div className="p-6 text-slate-800 dark:text-slate-100">Cargando modelos...</div>;

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Modelos de Máquina</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona los modelos base del configurador.
            </p>
          </div>
          <button className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700" onClick={() => handleOpenModelModal()}>+ Crear Modelo</button>
        </div>

        <div className="w-full overflow-auto">
            <table className="w-full min-w-[800px] text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                    <tr>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Slug</th>
                        <th className="px-4 py-2">Tipo</th>
                        <th className="px-4 py-2">Precio Base</th>
                        <th className="px-4 py-2 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {models.map(model => (
                        <tr key={model.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-100">{model.name}</td>
                            <td className="px-4 py-2 font-mono text-xs dark:text-slate-300">{model.slug}</td>
                            <td className="px-4 py-2 dark:text-slate-300">{model.vendingType}</td>
                            <td className="px-4 py-2 dark:text-slate-300">${model.basePrice.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right space-x-3">
                                <button onClick={() => handleOpenModelModal(model)} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Editar</button>
                                <button onClick={() => handleManageDetails(model.slug)} className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">Gestionar Detalles</button>
                                <button onClick={() => handleDeleteModel(model.id)} className="font-semibold text-red-600 dark:text-red-400 hover:underline">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      <ModalMachineModelForm show={isModelModalOpen} onClose={handleCloseModelModal} onSaveSuccess={handleSaveModelSuccess} model={editingModel} />
    </>
  );
};

export default ModelsConfigAdmin;
