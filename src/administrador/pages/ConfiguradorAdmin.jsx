import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ModalExtraForm from "../components/ModalExtraForm";
import ModalMachineModelForm from "../components/ModalMachineModelForm";
import ModalAssociateExtra from "../components/ModalAssociateExtra";
import ModalImageForm from "../components/ModalImageForm";

const API_URL = import.meta.env.VITE_API_URL;

const ConfiguradorAdmin = () => {
  const [models, setModels] = useState([]);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [editingExtra, setEditingExtra] = useState(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [editingModelExtra, setEditingModelExtra] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);

  const fetchData = async () => {
    try {
      const [modelsRes, extrasRes] = await Promise.all([
        fetch(`${API_URL}/api/configurador/models`),
        fetch(`${API_URL}/api/configurador/extras`),
      ]);
      if (!modelsRes.ok || !extrasRes.ok) throw new Error("Error al cargar datos");
      
      const modelsData = await modelsRes.json();
      const extrasData = await extrasRes.json();
      
      setModels(modelsData);
      setExtras(extrasData);
      
      if (selectedModel) {
        const refreshedModel = modelsData.find(m => m.id === selectedModel.id);
        setSelectedModel(refreshedModel || null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData() }, []);

  const handleOpenExtraModal = (extra = null) => { setEditingExtra(extra); setIsExtraModalOpen(true); };
  const handleCloseExtraModal = () => setIsExtraModalOpen(false);
  const handleSaveExtraSuccess = () => { handleCloseExtraModal(); toast.success("Extra guardado!"); fetchData(); };
  const handleDeleteExtra = async (extraId) => {
    if (!window.confirm("¿Seguro?")) return;
    try {
      await fetch(`${API_URL}/api/configurador/extras/${extraId}`, { method: "DELETE" });
      toast.success("Extra eliminado.");
      fetchData();
    } catch (error) { toast.error(error.message) }
  };

  const handleOpenModelModal = (model = null) => { setEditingModel(model); setIsModelModalOpen(true); };
  const handleCloseModelModal = () => setIsModelModalOpen(false);
  const handleSaveModelSuccess = () => { handleCloseModelModal(); toast.success("Modelo guardado!"); fetchData(); };
  const handleDeleteModel = async (modelId) => {
    if (!window.confirm("¿SEGURO? Se borrará el modelo y sus asociaciones.")) return;
    try {
      await fetch(`${API_URL}/api/configurador/models/${modelId}`, { method: "DELETE" });
      toast.success("Modelo eliminado.");
      if (selectedModel?.id === modelId) setSelectedModel(null);
      fetchData();
    } catch (error) { toast.error(error.message) }
  };
  
  const handleOpenAssociateModal = (modelExtra = null) => { setEditingModelExtra(modelExtra); setIsAssociateModalOpen(true); };
  const handleCloseAssociateModal = () => { setEditingModelExtra(null); setIsAssociateModalOpen(false); };
  const handleSaveAssociateSuccess = () => { handleCloseAssociateModal(); toast.success("Asociación guardada!"); fetchData(); };
  const handleDeleteAssociation = async (modelExtraId) => {
    if (!window.confirm("¿Quitar esta asociación?")) return;
    try {
        await fetch(`${API_URL}/api/configurador/modelextras/${modelExtraId}`, { method: "DELETE" });
        toast.success("Asociación eliminada.");
        fetchData();
    } catch (error) { toast.error(error.message) }
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
    } catch (error) { toast.error(error.message) }
  };

  if (loading) return <div className="p-6 text-slate-800 dark:text-slate-100">Cargando...</div>;

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-8">
        <div className="pb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gestión del Configurador</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Administra los modelos, extras e imágenes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Modelos ({models.length})</h3>
              <button className="text-sm text-cyan-600 font-semibold" onClick={() => handleOpenModelModal()}>+ Modelo</button>
            </div>
            <ul className="space-y-2">
              {models.map((model) => (
                <li key={model.id} className={`p-3 rounded-lg transition group relative ${selectedModel?.id === model.id ? "bg-cyan-500 text-white" : "bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100"}`}>
                  <div className="flex justify-between items-center">
                    <span onClick={() => setSelectedModel(model)} className="font-medium cursor-pointer flex-grow pr-16">{model.name}</span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModelModal(model)} className="text-xs font-semibold">Editar</button>
                      <button onClick={() => handleDeleteModel(model.id)} className="text-xs font-semibold text-red-500">Borrar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            {selectedModel ? (
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Detalles de "{selectedModel.name}"</h3>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Extras Asociados ({selectedModel.extras.length})</h4>
                    <button className="text-sm text-cyan-600 font-semibold" onClick={() => handleOpenAssociateModal()}>+ Asociar</button>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {selectedModel.extras.map((modelExtra) => (
                      <li key={modelExtra.id} className="p-2 bg-white dark:bg-slate-800 rounded-md flex justify-between items-center group">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100">{modelExtra.extra.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Precio: ${(modelExtra.priceOverride ?? modelExtra.extra.basePrice).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
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
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Imágenes ({selectedModel.images.length})</h4>
                    <button className="text-sm text-cyan-600 font-semibold" onClick={() => handleOpenImageModal()}>+ Añadir</button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedModel.images.map(img => (
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
            ) : <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-700/50 p-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"><p className="text-slate-500 dark:text-slate-400">Selecciona un modelo.</p></div>}
          </div>
        </div>

        <div className="border-t dark:border-slate-700 pt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Biblioteca de Extras ({extras.length})</h3>
                 <button className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700" onClick={() => handleOpenExtraModal()}>+ Crear Extra</button>
            </div>
             <div className="w-full overflow-auto">
                <table className="w-full min-w-[600px] text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                        <tr>
                            <th className="px-4 py-2">Nombre</th><th className="px-4 py-2">Código</th><th className="px-4 py-2">Precio Base</th><th className="px-4 py-2">Tipo</th><th className="px-4 py-2 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {extras.map(extra => (
                            <tr key={extra.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-100">{extra.name}</td>
                                <td className="px-4 py-2 font-mono text-xs text-slate-300">{extra.code}</td>
                                <td className="px-4 py-2 text-slate-700 dark:text-slate-300">${extra.basePrice.toLocaleString()}</td>
                                <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{extra.isTinaco ? <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Tinaco</span> : "General"}</td>
                                <td className="px-4 py-2 text-right space-x-3">
                                    <button onClick={() => handleOpenExtraModal(extra)} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Editar</button>
                                    <button onClick={() => handleDeleteExtra(extra.id)} className="font-semibold text-red-600 dark:text-red-400 hover:underline">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <ModalExtraForm show={isExtraModalOpen} onClose={handleCloseExtraModal} onSaveSuccess={handleSaveExtraSuccess} extra={editingExtra} />
      <ModalMachineModelForm show={isModelModalOpen} onClose={handleCloseModelModal} onSaveSuccess={handleSaveModelSuccess} model={editingModel} />
      <ModalAssociateExtra show={isAssociateModalOpen} onClose={handleCloseAssociateModal} onSaveSuccess={handleSaveAssociateSuccess} model={selectedModel} allExtras={extras} modelExtraToEdit={editingModelExtra} />
      <ModalImageForm show={isImageModalOpen} onClose={handleCloseImageModal} onSaveSuccess={handleSaveImageSuccess} model={selectedModel} allExtras={extras} imageToEdit={editingImage} />
    </>
  );
};

export default ConfiguradorAdmin;
