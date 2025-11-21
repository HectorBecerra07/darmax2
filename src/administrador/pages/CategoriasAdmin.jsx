import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const CategoriasAdmin = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null); // { id, nombre }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategorias = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/categorias`);
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editando ? "Actualizando..." : "Creando...");

    const url = editando
      ? `${API_URL}/api/categorias/${editando.id}`
      : `${API_URL}/api/categorias`;
    const method = editando ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim() }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Ocurrió un error");
      }

      toast.success(`Categoría ${editando ? "actualizada" : "creada"}`, { id: toastId });
      resetForm();
      fetchCategorias();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (categoria) => {
    setEditando(categoria);
    setNombre(categoria.nombre);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro? Los productos asociados podrían verse afectados.")) {
      return;
    }
    const toastId = toast.loading("Eliminando...");
    try {
      const res = await fetch(`${API_URL}/api/categorias/${id}`, { method: "DELETE" });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "No se pudo eliminar");
      }

      toast.success("Categoría eliminada", { id: toastId });
      fetchCategorias();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const resetForm = () => {
    setNombre("");
    setEditando(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gestión de Categorías</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Crea, edita y elimina categorías para tus productos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna del formulario */}
        <div className="md:col-span-1 bg-white dark:bg-slate-700/50 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">
            {editando ? "Editar Categoría" : "Nueva Categoría"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cat-nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nombre
              </label>
              <input
                id="cat-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Ej. Purificadores"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg disabled:bg-gray-400 disabled:text-gray-200 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : (editando ? "Actualizar" : "Crear")}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Columna de la lista */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Categorías Existentes</h3>
          <ul className="space-y-2">
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200"
              >
                <span className="font-medium">{cat.nombre}</span>
                <div className="space-x-3">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 dark:text-red-400 hover:underline text-sm">
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
            {categorias.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">No hay categorías creadas.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CategoriasAdmin;