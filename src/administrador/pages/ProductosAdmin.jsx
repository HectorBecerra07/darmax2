import React, { useEffect, useState } from "react";
import ModalProductoForm from "../components/ModalProductoForm";

const LS_PROD = "productos";
const LS_CAT = "categorias";

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  // Carga inicial
  useEffect(() => {
    const ps = JSON.parse(localStorage.getItem(LS_PROD)) || [];
    const cs = JSON.parse(localStorage.getItem(LS_CAT)) || [];
    setProductos(ps);
    setCategorias(cs);
  }, []);

  const guardarProductos = (nuevos) => {
    localStorage.setItem(LS_PROD, JSON.stringify(nuevos));
    setProductos(nuevos);
  };

  const guardarCategorias = (nuevas) => {
    const uniques = Array.from(new Set(nuevas.map((c) => c.trim()).filter(Boolean)));
    localStorage.setItem(LS_CAT, JSON.stringify(uniques));
    setCategorias(uniques);
  };

  const ensureCategoria = (cat) => {
    if (!cat) return;
    if (!categorias.includes(cat)) guardarCategorias([...categorias, cat]);
  };

  const handleAgregar = (nuevoProducto) => {
    // Asegura la categoría en el catálogo
    ensureCategoria(nuevoProducto.categoria);

    let nuevos;
    if (productoEditando) {
      nuevos = productos.map((p) =>
        p.id === productoEditando.id ? { ...nuevoProducto, id: productoEditando.id } : p
      );
    } else {
      nuevos = [...productos, { ...nuevoProducto, id: Date.now() }];
    }
    guardarProductos(nuevos);
    setProductoEditando(null);
    setModalOpen(false);
  };

  const handleEliminar = (id) => {
    const nuevos = productos.filter((p) => p.id !== id);
    guardarProductos(nuevos);
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setModalOpen(true);
  };

  const productosFiltrados =
    filtro === "todos"
      ? productos
      : productos.filter((p) => p.categoria?.toLowerCase() === filtro.toLowerCase());

  const fmtMoney = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
      .format(Number(n || 0));

  const fmtDims = (d) => {
    if (!d) return "-";
    const { largoCm, anchoCm, altoCm } = d;
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
            <option key={c} value={c}>{c}</option>
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
                <td className="border p-2">{p.categoria}</td>
                <td className="border p-2 text-left">{p.descripcion}</td>
                <td className="border p-2">{p.stock ?? "-"}</td>
                <td className="border p-2">{p.pesoKg ?? "-"}</td>
                <td className="border p-2">{fmtDims(p.dimensiones)}</td>
                <td className="border p-2">
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} className="mx-auto h-16 w-16 object-cover" />
                  ) : ("-")}
                </td>
                <td className="space-x-2 border p-2">
                  <button onClick={() => handleEditar(p)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(p.id)} className="text-red-600 hover:underline">
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
        onSave={handleAgregar}
        producto={productoEditando}
      />
    </div>
  );
}
