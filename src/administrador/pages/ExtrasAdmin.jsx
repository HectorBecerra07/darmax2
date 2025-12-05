import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import ModalExtraForm from "../components/ModalExtraForm";

const API_URL = import.meta.env.VITE_API_URL;

const ExtrasAdmin = () => {
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExtra, setEditingExtra] = useState(null);

  const fetchExtras = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/configurador/extras`);
      if (!res.ok) throw new Error("Error al cargar los extras");
      const data = await res.json();
      setExtras(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExtras();
  }, [fetchExtras]);

  const handleOpenModal = (extra = null) => {
    setEditingExtra(extra);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingExtra(null);
    setIsModalOpen(false);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    toast.success(`Extra ${editingExtra ? 'actualizado' : 'creado'} con éxito!`);
    fetchExtras();
  };

  const handleDelete = async (extraId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este extra?")) return;
    
    const toastId = toast.loading("Eliminando...");
    try {
      const res = await fetch(`${API_URL}/api/configurador/extras/${extraId}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "No se pudo eliminar.");
      }
      toast.success("Extra eliminado.", { id: toastId });
      fetchExtras();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  if (loading) {
    return <div className="p-6">Cargando extras...</div>;
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Biblioteca de Extras</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gestiona todos los extras opcionales para los configuradores.
            </p>
          </div>
          <button
            className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            onClick={() => handleOpenModal()}
          >
            + Crear Nuevo Extra
          </button>
        </div>

        <div className="w-full overflow-auto">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Código</th>
                <th className="px-4 py-2">Precio Base</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {extras.map(extra => (
                <tr key={extra.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-2 font-medium dark:text-slate-100">{extra.name}</td>
                  <td className="px-4 py-2 font-mono text-xs dark:text-slate-300">{extra.code}</td>
                  <td className="px-4 py-2 dark:text-slate-300">${extra.basePrice.toLocaleString()}</td>
                  <td className="px-4 py-2 dark:text-slate-300">{extra.isTinaco ? <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Tinaco</span> : "General"}</td>
                  <td className="px-4 py-2 text-right space-x-3">
                    <button onClick={() => handleOpenModal(extra)} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(extra.id)} className="font-semibold text-red-600 dark:text-red-400 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalExtraForm
        show={isModalOpen}
        onClose={handleCloseModal}
        onSaveSuccess={handleSaveSuccess}
        extra={editingExtra}
      />
    </>
  );
};

export default ExtrasAdmin;
