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
        fetch(`${API_URL}/api/productos`),
        fetch(`${API_URL}/api/categorias`),
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
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Gestión de Productos</h2>

      <div className="flex items-center justify-between mb-4">
        <button
          className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600"
          onClick={() => {
            setProductoEditando(null);
            setModalOpen(true);
          }}
        >
          + Agregar Producto
        </button>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="todos">Todos</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-auto">
        <table className="w-full min-w-[1000px] border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Categoría</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Peso (kg)</th>
              <th className="border p-2">Dimensiones (L×A×H cm)</th>
              <th className="border p-2">Imagen</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id} className="text-center">
                <td className="border p-2">{p.nombre}</td>
                <td className="border p-2">{fmtMoney(p.precio)}</td>
                <td className="border p-2">{p.categoria.nombre}</td>
                <td className="border p-2 text-left">{p.descripcion}</td>
                <td className="border p-2">{p.stock ?? "-"}</td>
                <td className="border p-2">{p.pesoKg ?? "-"}</td>
                <td className="border p-2">{fmtDims(p)}</td>
                <td className="border p-2">
                  {p.imagen ? (
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="mx-auto h-16 w-16 object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="space-x-2 border p-2">
                  <button
                    onClick={() => handleEditar(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={9}>
                  No hay productos en esta vista.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
