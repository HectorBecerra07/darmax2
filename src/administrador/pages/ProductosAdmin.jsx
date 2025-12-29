import React, { useEffect, useState, useCallback } from "react";
import ModalProductoForm from "../components/ModalProductoForm";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const fetchData = useCallback(async () => {
    try {
      const [productosRes, categoriasRes] = await Promise.all([
        fetch(`${API_URL}/api/productos`, { cache: "no-store" }),
        fetch(`${API_URL}/api/categorias`, { cache: "no-store" }),
      ]);

      if (!productosRes.ok || !categoriasRes.ok) {
        throw new Error("Error al cargar los datos");
      }

      const productosData = await productosRes.json();
      const categoriasData = await categoriasRes.json();

      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar los datos desde el servidor.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSuccess = () => {
    setModalOpen(false);
    setProductoEditando(null);
    toast.success("Producto guardado exitosamente!");
    fetchData(); // Recargar datos
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error al eliminar");
      }
      toast.success("Producto eliminado.");
      fetchData(); // Recargar datos
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el producto.");
    }
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setModalOpen(true);
  };

  const productosFiltrados =
    filtro === "todos"
      ? productos
      : productos.filter((p) => p.categoria?.nombre.toLowerCase() === filtro.toLowerCase());

  const fmtMoney = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
      Number(n || 0)
    );

  const fmtDims = (p) => {
    const { largoCm, anchoCm, altoCm } = p;
    if ([largoCm, anchoCm, altoCm].every((x) => x == null || x === "")) return "-";
    return `${largoCm ?? "-"} × ${anchoCm ?? "-"} × ${altoCm ?? "-"} cm`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Gestión de Productos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Agrega, edita y elimina productos de tu catálogo.
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={() => {
            setProductoEditando(null);
            setModalOpen(true);
          }}
        >
          <span className="text-xl leading-none">+</span> Agregar Producto
        </button>
      </div>

      {/* --- Filters --- */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
          Filtrar por categoría:
        </label>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full sm:w-64 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-slate-800 dark:text-slate-200"
        >
          <option value="todos">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* --- Card Layout (Mobile) --- */}
      <div className="grid gap-6 md:hidden">
        {productosFiltrados.map((p) => (
          <div key={p.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex gap-4">
              <img
                src={p.imagen || "https://via.placeholder.com/150"}
                alt={p.nombre}
                className="h-20 w-20 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{p.nombre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{p.categoria.nombre}</p>
                <p className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mt-1">{fmtMoney(p.precio)}</p>
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p><span className="font-semibold dark:text-slate-300">Stock:</span> {p.stock ?? "N/A"}</p>
              <p><span className="font-semibold dark:text-slate-300">Peso:</span> {p.pesoKg ? `${p.pesoKg} kg` : "N/A"}</p>
              <p><span className="font-semibold dark:text-slate-300">Dims:</span> {fmtDims(p)}</p>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-600 pt-3">
              <button onClick={() => handleEditar(p)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Editar</button>
              <button onClick={() => handleEliminar(p.id)} className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Table Layout (Desktop) --- */}
      <div className="w-full overflow-auto hidden md:block">
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Peso</th>
              <th className="px-6 py-3">Dimensiones</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {productosFiltrados.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img src={p.imagen || "https://via.placeholder.com/150"} alt={p.nombre} className="h-10 w-10 object-cover rounded-md"/>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{p.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{fmtMoney(p.precio)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{p.categoria.nombre}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{p.stock ?? "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{p.pesoKg ? `${p.pesoKg} kg` : "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{fmtDims(p)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-4">
                  <button onClick={() => handleEditar(p)} className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">Editar</button>
                  <button onClick={() => handleEliminar(p.id)} className="font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {productosFiltrados.length === 0 && (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 border-dashed border-2 border-slate-200 dark:border-slate-700 rounded-lg">
          No hay productos que coincidan con el filtro seleccionado.
        </div>
      )}

      <ModalProductoForm
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaveSuccess={handleSaveSuccess}
        producto={productoEditando}
        categoriasExistentes={categorias}
      />
    </div>
  );
}
