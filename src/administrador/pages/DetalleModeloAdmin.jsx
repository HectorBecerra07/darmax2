import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ModalAssociateExtra from "../components/ModalAssociateExtra";
import ModalImageForm from "../components/ModalImageForm";

const API_URL = import.meta.env.VITE_API_URL;

const DetalleModeloAdmin = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [allExtras, setAllExtras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los modales
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [editingModelExtra, setEditingModelExtra] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Usamos el endpoint para obtener un modelo por ID (que en este caso es el slug)
      const modelRes = await fetch(`${API_URL}/api/configurador/models/${modelId}`);
      if (!modelRes.ok) throw new Error("No se pudo cargar el modelo.");
      const modelData = await modelRes.json();
      setModel(modelData);

      // También necesitamos todos los extras para el modal de asociación
      const extrasRes = await fetch(`${API_URL}/api/configurador/extras`);
      if (!extrasRes.ok) throw new Error("No se pudieron cargar los extras.");
      const extrasData = await extrasRes.json();
      setAllExtras(extrasData);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [modelId]);

  // --- Handlers para modales ---
  const handleOpenAssociateModal = (modelExtra = null) => { setEditingModelExtra(modelExtra); setIsAssociateModalOpen(true); };
  const handleCloseAssociateModal = () => { setEditingModelExtra(null); setIsAssociateModalOpen(false); };
  const handleSaveAssociateSuccess = () => { handleCloseAssociateModal(); toast.success("Asociación guardada!"); fetchData(); };
  const handleDeleteAssociation = async (modelExtraId) => {
    if (!window.confirm("¿Quitar esta asociación?")) return;
    try {
      await fetch(`${API_URL}/api/configurador/modelextras/${modelExtraId}`, { method: "DELETE" });
      toast.success("Asociación eliminada.");
      fetchData();
    } catch (error) { toast.error(error.message); }
  };

  const handleOpenImageModal = (image = null) => { setEditingImage(image); setIsImageModalOpen(true); };
  const handleCloseImageModal = () => { setEditingImage(null); setIsImageModalOpen(false); };
  const handleSaveImageSuccess = () => { handleCloseImageModal(); toast.success("Imagen guardada!"); fetchData(); };
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    try {
      await fetch(`${API_URL}/api/configurador/images/${imageId}`, { method: "DELETE" });
      toast.success("Imagen eliminada.");
      fetchData();
    } catch (error) { toast.error(error.message); }
  };

  if (loading) return <div className="p-6 text-slate-800 dark:text-slate-100">Cargando detalles del modelo...</div>;
  if (!model) return <div className="p-6 text-red-500">Error: Modelo no encontrado.</div>;

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Gestionar: <span className="text-cyan-600">{model.name}</span>
            </h2>
            <Link to="/admin/dashboard/modelos-config" className="text-sm text-cyan-600 hover:underline">
              &larr; Volver a la lista de modelos
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Columna de Extras Asociados */}
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Extras Asociados ({model.extras.length})</h3>
              <button className="text-sm text-cyan-600 font-semibold" onClick={() => handleOpenAssociateModal()}>+ Asociar</button>
            </div>
            <ul className="space-y-2 text-sm">
              {model.extras.map((modelExtra) => (
                <li key={modelExtra.id} className="p-3 bg-white dark:bg-slate-800 rounded-md flex justify-between items-center group">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{modelExtra.extra.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Precio: ${(modelExtra.priceOverride ?? modelExtra.extra.basePrice).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2 text-xs justify-end">
                      {modelExtra.isDefault && <span className="rounded-full bg-green-200 text-green-800 px-2">Default</span>}
                      {modelExtra.isRequired && <span className="rounded-full bg-red-200 text-red-800 px-2">Requerido</span>}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenAssociateModal(modelExtra)} className="text-xs font-semibold">Editar</button>
                      <button onClick={() => handleDeleteAssociation(modelExtra.id)} className="text-xs font-semibold text-red-500">Quitar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Columna de Imágenes */}
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Imágenes ({model.images.length})</h3>
              <button className="text-sm text-cyan-600 font-semibold" onClick={() => handleOpenImageModal()}>+ Añadir</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {model.images.map(img => (
                <div key={img.id} className="group relative border dark:border-slate-600 rounded-lg p-2 text-center bg-white dark:bg-slate-800">
                  <img src={img.url} alt={img.alt} className="h-24 w-full object-contain rounded-md mb-2"/>
                  <p className="text-xs font-mono bg-slate-200 dark:bg-slate-600 rounded px-1 truncate">{img.context}</p>
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <button onClick={() => handleOpenImageModal(img)} className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">Editar</button>
                    <button onClick={() => handleDeleteImage(img.id)} className="text-white text-xs font-semibold bg-red-600/80 px-2 py-1 rounded">Borrar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ModalAssociateExtra show={isAssociateModalOpen} onClose={handleCloseAssociateModal} onSaveSuccess={handleSaveAssociateSuccess} model={model} allExtras={allExtras} modelExtraToEdit={editingModelExtra} />
      <ModalImageForm show={isImageModalOpen} onClose={handleCloseImageModal} onSaveSuccess={handleSaveImageSuccess} model={model} allExtras={allExtras} imageToEdit={editingImage} />
    </>
  );
};

export default DetalleModeloAdmin;
