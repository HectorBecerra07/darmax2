import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import ProductModal from "../components/ProductModal";
import { useCarrito } from "../context/CarritoContext";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSortAmountDownAlt,
  FaCartPlus,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIA_PURIFICADORES = "PurificadoresCaseros";

const agruparPorCategoria = (productos) =>
  productos.reduce((acc, p) => {
    const cat = p.categoria?.nombre || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

const money = (n) => `MXN $${Number(n || 0).toFixed(2)}`;

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-6 bg-gray-100 rounded w-1/2" />
        <div className="h-11 bg-gray-100 rounded-2xl w-full" />
      </div>
    </div>
  );
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevancia"); // relevancia | precio_asc | precio_desc | nombre | stock

  const productosPorPagina = 12;
  const { agregarProducto, carrito } = useCarrito();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/productos`);
        if (!res.ok) throw new Error("No se pudieron cargar los productos.");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const productosVisibles = useMemo(
    () =>
      (productos || []).filter(
        (p) =>
          (p.categoria?.nombre || "").toLowerCase() !==
          CATEGORIA_PURIFICADORES.toLowerCase()
      ),
    [productos]
  );

  const categorias = useMemo(() => {
    const set = new Set(
      (productosVisibles || []).map((p) => p.categoria?.nombre).filter(Boolean)
    );
    return Array.from(set);
  }, [productosVisibles]);

  useEffect(() => {
    if (!categoriaActiva && categorias.length > 0) {
      setCategoriaActiva(categorias[0]);
    } else if (!categorias.includes(categoriaActiva) && categorias.length > 0) {
      setCategoriaActiva(categorias[0]);
    }
  }, [categorias, categoriaActiva]);

  const productosPorCategoria = useMemo(
    () => agruparPorCategoria(productosVisibles),
    [productosVisibles]
  );

  const productosFiltrados = useMemo(() => {
    let lista = categoriaActiva
      ? productosPorCategoria[categoriaActiva] || []
      : productosVisibles;

    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      lista = lista.filter((p) => (p.nombre || "").toLowerCase().includes(t));
    }

    const sorted = [...lista];
    if (sortBy === "precio_asc")
      sorted.sort((a, b) => (a.precio || 0) - (b.precio || 0));
    if (sortBy === "precio_desc")
      sorted.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    if (sortBy === "nombre")
      sorted.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
    if (sortBy === "stock")
      sorted.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));

    return sorted;
  }, [
    categoriaActiva,
    productosPorCategoria,
    productosVisibles,
    searchTerm,
    sortBy,
  ]);

  const totalPaginas =
    Math.ceil(productosFiltrados.length / productosPorPagina) || 1;

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(inicio, fin);

  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaActiva, searchTerm, sortBy]);

  const handleAgregarCarrito = (producto) => {
    const itemEnCarrito = carrito.find((item) => item.id === producto.id);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const stockEfectivo = (producto.stock ?? 0) - cantidadEnCarrito;

    if (stockEfectivo <= 0) {
      toast.error("No hay más stock disponible para este producto.");
      return;
    }

    agregarProducto(producto, 1);
    toast.success(
      <div className="flex items-center gap-3">
        <img
          src={producto.imagen || "https://via.placeholder.com/40"}
          alt={producto.nombre}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span>{producto.nombre} añadido al carrito</span>
      </div>
    );
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

  return (
    <>
      <Helmet>
        <title>Productos - Darmax</title>
        <meta
          name="description"
          content="Explora nuestra amplia gama de productos en Darmax."
        />
      </Helmet>

      {/* HERO */}
      <section className="max-w-7xl mx-auto pt-10 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Nuestros Productos
              </h1>
              <p className="text-gray-600 mt-1">
                Encuentra todo lo que necesitas para tu hogar o negocio.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
                {productosFiltrados.length} resultados
              </span>
              {categoriaActiva && (
                <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
                  {categoriaActiva}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTROLES (sticky) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="sticky top-16 z-20">
          <div className="backdrop-blur bg-white/85 border border-gray-200 rounded-2xl shadow-sm p-3 sm:p-4">
            <div className="flex flex-col gap-3">
              {/* Categorías scroll */}
              {categorias.length > 0 && (
                <div
                  className="
                    flex items-center gap-2
                    overflow-x-auto whitespace-nowrap
                    scroll-smooth snap-x snap-mandatory
                    [-ms-overflow-style:none] [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {categorias.map((cat) => {
                    const active = cat === categoriaActiva;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoriaActiva(cat)}
                        className={`
                          snap-start shrink-0
                          px-4 py-2.5 rounded-xl text-sm font-semibold
                          border transition-all
                          ${
                            active
                              ? "bg-[#24d4da] text-white border-transparent shadow"
                              : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                          }
                        `}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Search + Sort */}
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                {/* Search */}
                <div className="relative w-full md:max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#24d4da] focus:border-transparent transition-shadow"
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                      aria-label="Limpiar búsqueda"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700">
                  <FaSortAmountDownAlt className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-sm outline-none"
                  >
                    <option value="relevancia">Ordenar: Relevancia</option>
                    <option value="precio_asc">Precio: menor a mayor</option>
                    <option value="precio_desc">Precio: mayor a menor</option>
                    <option value="nombre">Nombre: A-Z</option>
                    <option value="stock">Stock: mayor</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {productosFiltrados.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-gray-900">
                  No se encontraron productos
                </p>
                <p className="mt-2 text-gray-600">
                  Prueba con otra categoría o término de búsqueda.
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-5 px-5 py-3 rounded-xl bg-[#24d4da] text-white font-semibold hover:bg-[#007377] transition"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {productosPaginados.map((p) => {
                    const itemEnCarrito = carrito.find((item) => item.id === p.id);
                    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
                    const stockEfectivo = (p.stock ?? 0) - cantidadEnCarrito;

                    const badge =
                      stockEfectivo <= 0
                        ? { text: "Agotado", cls: "bg-gray-900 text-white" }
                        : stockEfectivo <= 5
                        ? { text: `Últimos ${stockEfectivo}`, cls: "bg-red-500 text-white" }
                        : { text: "Disponible", cls: "bg-emerald-500 text-white" };

                    return (
                      <article
                        key={p.id}
                        onClick={() => handleVerMas(p)}
                        className="
                          group cursor-pointer
                          bg-white border border-gray-200 rounded-3xl overflow-hidden
                          shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300
                          flex flex-col
                        "
                      >
                        {/* Imagen (SIN ZOOM) */}
                        <div className="relative bg-gradient-to-b from-gray-50 to-white p-4">
                          <span
                            className={`absolute top-3 left-3 text-[11px] font-extrabold px-3 py-1 rounded-full ${badge.cls}`}
                          >
                            {badge.text}
                          </span>

                          <div className="aspect-[4/3] flex items-center justify-center">
                            <img
                              src={p.imagen || "https://via.placeholder.com/400x300"}
                              alt={p.nombre}
                              loading="lazy"
                              className="max-h-full w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/400x300";
                              }}
                            />
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-4 pt-3 flex flex-col gap-2 flex-grow">
                          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug line-clamp-2">
                            {p.nombre}
                          </h3>

                          <div className="flex items-end justify-between gap-3 mt-auto">
                            <div>
                              <p className="text-lg font-extrabold text-[#007377] leading-none">
                                {money(p.precio)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Stock:{" "}
                                <span
                                  className={
                                    stockEfectivo <= 5
                                      ? "text-red-600 font-semibold"
                                      : "text-emerald-600 font-semibold"
                                  }
                                >
                                  {stockEfectivo > 0 ? stockEfectivo : "0"}
                                </span>
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAgregarCarrito(p);
                              }}
                              disabled={stockEfectivo <= 0}
                              className={`
                                inline-flex items-center gap-2
                                px-4 py-2.5 rounded-2xl text-sm font-extrabold
                                transition active:scale-95
                                ${
                                  stockEfectivo <= 0
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-[#24d4da] text-white hover:bg-[#007377] shadow-sm hover:shadow"
                                }
                              `}
                            >
                              <FaCartPlus />
                              {stockEfectivo <= 0 ? "Agotado" : "Añadir"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* PAGINACIÓN */}
                {totalPaginas > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => cambiarPagina(paginaActual - 1)}
                      disabled={paginaActual === 1}
                      className="p-3 border rounded-full hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center transition"
                      aria-label="Página anterior"
                    >
                      <FaChevronLeft size={16} />
                    </button>

                    {[...Array(totalPaginas)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => cambiarPagina(i + 1)}
                        className={`w-10 h-10 border rounded-full text-sm font-bold transition ${
                          paginaActual === i + 1
                            ? "bg-[#24d4da] border-[#24d4da] text-white shadow"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        aria-current={paginaActual === i + 1 ? "page" : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => cambiarPagina(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                      className="p-3 border rounded-full hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center transition"
                      aria-label="Página siguiente"
                    >
                      <FaChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <ProductModal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          producto={productoActivo}
          onAddToCart={handleAgregarCarrito}
        />
      </section>
    </>
  );
}
