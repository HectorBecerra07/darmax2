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
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Gestión de Categorías</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna del formulario */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">{editando ? "Editar Categoría" : "Nueva Categoría"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cat-nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="cat-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Ej. Purificadores"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : (editando ? "Actualizar" : "Crear")}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Columna de la lista */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">Categorías Existentes</h3>
          <ul className="space-y-2">
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <span className="font-medium">{cat.nombre}</span>
                <div className="space-x-3">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline text-sm">
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
            {categorias.length === 0 && (
              <p className="text-center text-gray-500 py-4">No hay categorías creadas.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoriasAdmin;
