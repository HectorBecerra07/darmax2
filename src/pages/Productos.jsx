import React, { useState, useEffect, useMemo } from "react";
import ProductModal from "../components/ProductModal";
import { useCarrito } from "../context/CarritoContext";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const LS_PROD = "productos";
const LS_CAT = "categorias";
const CATEGORIA_PURIFICADORES = "PurificadoresCaseros";

const agruparPorCategoria = (productos) =>
  productos.reduce((acc, p) => {
    const cat = p.categoria || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriasLS, setCategoriasLS] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 16;

  const { agregarProducto } = useCarrito();

  useEffect(() => {
    const prods = JSON.parse(localStorage.getItem(LS_PROD)) || [];
    const cats = JSON.parse(localStorage.getItem(LS_CAT)) || [];
    setProductos(prods);
    setCategoriasLS(cats);
  }, []);

  // Excluir la categoría "PurificadoresCaseros" del listado general
  const productosVisibles = useMemo(
    () =>
      (productos || []).filter(
        (p) => (p.categoria || "").toLowerCase() !== CATEGORIA_PURIFICADORES.toLowerCase()
      ),
    [productos]
  );

  // Categorías visibles (también sin PurificadoresCaseros)
  const categoriasDerivadas = useMemo(() => {
    const set = new Set(
      (productosVisibles || []).map((p) => p.categoria).filter(Boolean)
    );
    return Array.from(set);
  }, [productosVisibles]);

  const categorias = useMemo(() => {
    const base = categoriasLS.length > 0 ? categoriasLS : categoriasDerivadas;
    return base.filter(
      (c) => (c || "").toLowerCase() !== CATEGORIA_PURIFICADORES.toLowerCase()
    );
  }, [categoriasLS, categoriasDerivadas]);

  useEffect(() => {
    if (!categoriaActiva) {
      setCategoriaActiva(categorias[0] || "");
    } else if (!categorias.includes(categoriaActiva) && categorias.length > 0) {
      setCategoriaActiva(categorias[0]);
    }
  }, [categorias, categoriaActiva]);

  const productosPorCategoria = useMemo(
    () => agruparPorCategoria(productosVisibles),
    [productosVisibles]
  );

  const productosFiltrados = categoriaActiva
    ? productosPorCategoria[categoriaActiva] || []
    : productosVisibles;

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(inicio, fin);

  const handleAgregarCarrito = (producto) => {
    agregarProducto({ ...producto, cantidad: 1, precio: producto.precio });
    toast.success(`${producto.nombre} añadido al carrito 🎉`);
  };

  const handleVerMas = (producto) => {
    setProductoActivo(producto);
    setModalOpen(true);
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaActiva]);

  const money = (n) => `MXN $${Number(n || 0).toFixed(2)}`;

  return (
    <section className="p-6 max-w-7xl mx-auto pt-28 pb-16">
      <h2 className="text-3xl font-bold mb-12 text-center uppercase tracking-wide">
        Componentes para Purificadoras
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categorias.length === 0 ? (
          <span className="text-gray-500 text-sm">
            Aún no hay categorías (excluyendo PurificadoresCaseros). Agrega desde el Admin.
          </span>
        ) : (
          categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium border transition ${
                cat === categoriaActiva
                  ? "text-black font-semibold"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              style={
                cat === categoriaActiva
                  ? { backgroundColor: "#ccff00", borderColor: "#ccff00" }
                  : {}
              }
            >
              {cat}
            </button>
          ))
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productosPaginados.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-3 cursor-pointer group"
            onClick={() => handleVerMas(p)}
          >
            <div className="bg-white shadow-md rounded-2xl p-6 w-full aspect-[4/3] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src={p.imagen || "https://via.placeholder.com/400x300"}
                alt={p.nombre}
                className="object-contain max-h-[200px] transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            <p className="text-center text-base font-medium capitalize">{p.nombre}</p>

            <p className="text-center text-black font-semibold text-base">{money(p.precio)}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAgregarCarrito(p);
              }}
              className="text-black px-5 py-2 rounded-full text-sm font-semibold hover:brightness-90 transition"
              style={{ backgroundColor: "#ccff00" }}
            >
              Añadir al carrito
            </button>
            {/* NOTA: Peso y dimensiones NO se muestran aquí (solo en Admin). */}
          </div>
        ))}
        {productosPaginados.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No hay productos para esta categoría.
          </div>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="p-2 border rounded-full hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center transition"
            aria-label="Página anterior"
            title="Página anterior"
          >
            <FaChevronLeft size={14} />
          </button>

          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              onClick={() => cambiarPagina(i + 1)}
              className={`px-3 py-1 border rounded-full transition ${
                paginaActual === i + 1
                  ? "bg-[#ccff00] border-[#ccff00] text-black font-bold"
                  : "hover:bg-gray-100"
              }`}
              aria-current={paginaActual === i + 1 ? "page" : undefined}
              title={`Página ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="p-2 border rounded-full hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center transition"
            aria-label="Página siguiente"
            title="Página siguiente"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      )}

      <ProductModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        producto={productoActivo}
        onAddToCart={handleAgregarCarrito}
      />
    </section>
  );
}
