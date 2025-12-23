import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ChatBubbleLeftRightIcon, BoltIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// --- API Functions ---
const api = {
  getIntents: () => fetch('/api/intents').then(res => res.ok ? res.json() : Promise.reject(res)),
  createIntent: (intent) => fetch('/api/intents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(intent),
  }).then(res => res.ok ? res.json() : Promise.reject(res)),
  updateIntent: (id, intent) => fetch(`/api/intents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(intent),
  }).then(res => res.ok ? res.json() : Promise.reject(res)),
  deleteIntent: (id) => fetch(`/api/intents/${id}`, { method: 'DELETE' }),

  getConfiguration: (key) => fetch(`/api/configuration/${key}`).then(res => res.ok ? res.json() : Promise.reject(res)),
  updateConfiguration: (key, value) => fetch('/api/configuration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  }).then(res => res.ok ? res.json() : Promise.reject(res)),
};

// --- Components ---

const IntentFormModal = ({ isOpen, onClose, onSave, intent }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trainingPhrases, setTrainingPhrases] = useState('');
  const [response, setResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (intent) {
      setName(intent.name || '');
      setDescription(intent.description || '');
      setTrainingPhrases(intent.trainingPhrases?.join(', ') || '');
      setResponse(intent.response || '');
    } else {
      setName('');
      setDescription('');
      setTrainingPhrases('');
      setResponse('');
    }
  }, [intent, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const phrases = trainingPhrases.split(',').map(p => p.trim()).filter(p => p);
    const intentData = { name, description, trainingPhrases: phrases, response };
    
    try {
        await onSave(intentData);
        onClose();
    } catch (error) {
        const err = await error.json().catch(() => ({error: 'Ocurrió un error desconocido.'}));
        toast.error(`Error al guardar: ${err.error}`);
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-2xl transform rounded-2xl bg-white dark:bg-slate-800 text-left shadow-xl transition-all">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
              {intent ? 'Editar Intención' : 'Crear Nueva Intención'}
            </h3>
            <div className="mt-4 space-y-4">
              <input type="text" placeholder="Nombre de la Intención (ej., saludo)" value={name} onChange={e => setName(e.target.value)} required className="w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600" />
              <input type="text" placeholder="Descripción (opcional)" value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600" />
              <textarea placeholder="Frases de entrenamiento, separadas por comas" value={trainingPhrases} onChange={e => setTrainingPhrases(e.target.value)} required rows="3" className="w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600"></textarea>
              <textarea placeholder="Respuesta del bot" value={response} onChange={e => setResponse(e.target.value)} required rows="4" className="w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600"></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 rounded-b-2xl bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md border dark:border-slate-600 dark:hover:bg-slate-700">Cancelar</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-semibold rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400">{isSaving ? 'Guardando...' : 'Guardar Intención'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, label, disabled }) => (
  <label htmlFor="toggle-chatbot" className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        id="toggle-chatbot"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div
        className={`block w-14 h-8 rounded-full ${
          checked ? 'bg-cyan-600' : 'bg-gray-400'
        } transition-colors duration-200 ease-in-out`}
      />
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
    <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
      {label}
    </div>
  </label>
);


const ChatbotAdmin = () => {
  const [intents, setIntents] = useState([]);
  const [isLoadingIntents, setIsLoadingIntents] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntent, setEditingIntent] = useState(null);
  const [isChatbotActive, setIsChatbotActive] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);


  const fetchIntents = useCallback(async () => {
    setIsLoadingIntents(true);
    try {
      const data = await api.getIntents();
      setIntents(data);
    } catch (error) {
      toast.error('No se pudieron cargar las intenciones.');
    } finally {
      setIsLoadingIntents(false);
    }
  }, []);

  const fetchChatbotStatus = useCallback(async () => {
    setIsLoadingConfig(true);
    try {
      const config = await api.getConfiguration('isChatbotActive');
      setIsChatbotActive(config.value === 'true');
    } catch (error) {
      if (error.status === 404) { // Setting not found, assume default to false
        setIsChatbotActive(false);
      } else {
        toast.error('No se pudo cargar el estado del chatbot.');
      }
    } finally {
      setIsLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    fetchIntents();
    fetchChatbotStatus();
  }, [fetchIntents, fetchChatbotStatus]);

  const handleOpenModal = (intent = null) => {
    setEditingIntent(intent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingIntent(null);
    setIsModalOpen(false);
  };

  const handleSave = async (intentData) => {
    const promise = editingIntent
      ? api.updateIntent(editingIntent.id, intentData)
      : api.createIntent(intentData);
    
    await toast.promise(promise, {
      loading: 'Guardando intención...',
      success: () => {
        fetchIntents();
        return `¡Intención "${intentData.name}" guardada exitosamente!`;
      },
      error: 'Error al guardar la intención.',
    });
    
    // Re-throw to be caught in the modal
    return promise;
  };

  const handleDelete = (intent) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la intención "${intent.name}"?`)) {
      toast.promise(api.deleteIntent(intent.id), {
        loading: 'Eliminando...',
        success: () => {
          fetchIntents();
          return 'Intención eliminada.';
        },
        error: 'No se pudo eliminar la intención.',
      });
    }
  };

  const handleToggleChatbot = async () => {
    const newValue = !isChatbotActive;
    setIsLoadingConfig(true);
    try {
      await toast.promise(api.updateConfiguration('isChatbotActive', newValue.toString()), {
        loading: newValue ? 'Activando chatbot...' : 'Desactivando chatbot...',
        success: newValue ? 'Chatbot activado.' : 'Chatbot desactivado.',
        error: 'Error al actualizar el estado del chatbot.',
      });
      setIsChatbotActive(newValue);
    } catch (error) {
      console.error('Error toggling chatbot:', error);
      toast.error('Hubo un problema al cambiar el estado del chatbot.');
    } finally {
      setIsLoadingConfig(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Gestión de Conocimiento del Chatbot</h1>
          {isLoadingConfig ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500" />
          ) : (
            <ToggleSwitch
              checked={isChatbotActive}
              onChange={handleToggleChatbot}
              label={isChatbotActive ? 'Chatbot Activo' : 'Chatbot Inactivo'}
              disabled={isLoadingConfig}
            />
          )}
        </div>
        <button onClick={() => handleOpenModal()} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-cyan-600 hover:bg-cyan-700">
          <PlusIcon className="h-5 w-5" />
          Nueva Intención
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        {isLoadingIntents ? (
          <p className="p-6 text-center">Cargando intenciones...</p>
        ) : intents.length === 0 ? (
          <div className="p-10 text-center border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
             <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-200">No se encontraron intenciones</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Comienza creando una nueva intención para que tu chatbot pueda responder.</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
            {intents.map(intent => (
              <li key={intent.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-cyan-700 dark:text-cyan-500">{intent.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{intent.description}</p>
                    <div className="mt-3">
                      <p className="text-xs font-mono dark:text-slate-400"><strong className="font-semibold">Entrenamiento:</strong> {intent.trainingPhrases.join(', ')}</p>
                      <p className="text-xs font-mono mt-2 bg-slate-100 dark:bg-slate-700 p-2 rounded-md dark:text-slate-300"><strong className="font-semibold">Respuesta:</strong> {intent.response}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                    <button onClick={() => handleOpenModal(intent)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><PencilIcon className="h-5 w-5 text-slate-500 dark:text-slate-300" /></button>
                    <button onClick={() => handleDelete(intent)} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="h-5 w-5 text-red-600 dark:text-red-500" /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <IntentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        intent={editingIntent}
      />
    </div>
  );
};

export default ChatbotAdmin;
