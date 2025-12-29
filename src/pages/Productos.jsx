import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSortAmountDownAlt,
  FaCartPlus,
  FaSlidersH,
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

// 🔥 Paginación con ellipsis (se ve pro)
function buildPagination(current, total) {
  const pages = [];
  const push = (v) => pages.push(v);

  if (total <= 7) {
    for (let i = 1; i <= total; i++) push(i);
    return pages;
  }

  push(1);

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) push("…");

  for (let i = left; i <= right; i++) push(i);

  if (right < total - 1) push("…");

  push(total);
  return pages;
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-24 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
        <div className="h-8 bg-gray-100 rounded w-2/3 animate-pulse" />
        <div className="h-12 bg-gray-100 rounded-2xl w-full animate-pulse" />
      </div>
    </div>
  );
}

/** ✅ Card Premium */
function ProductCard({ p, stockEfectivo, badge, onVerMas, onAgregar }) {
  return (
    <article
      onClick={() => onVerMas(p)}
      className="
        group cursor-pointer
        rounded-3xl overflow-hidden
        border border-gray-200 bg-white
        shadow-sm hover:shadow-xl hover:border-gray-300
        transition-all duration-300
        flex flex-col
      "
    >
      {/* Media */}
      <div className="relative p-4 bg-gradient-to-b from-gray-50 via-white to-white">
        <span
          className={`absolute top-3 left-3 z-10 text-[11px] font-extrabold px-3 py-1 rounded-full ${badge.cls}`}
        >
          {badge.text}
        </span>

        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/90 border border-gray-200 text-gray-700 shadow-sm">
            Ver detalles →
          </span>
        </div>

        <div className="aspect-[4/3]">
          <div
            className="
              h-full w-full
              rounded-2xl
              bg-white
              border border-gray-100
              shadow-[0_12px_30px_rgba(0,0,0,0.06)]
              p-4
              flex items-center justify-center
              transition-transform duration-300
              group-hover:scale-[1.02]
            "
          >
            <img
              src={p.imagen || "https://via.placeholder.com/400x300"}
              alt={p.nombre}
              loading="lazy"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x300";
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-3 flex flex-col gap-3 flex-grow">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-700">
              {p.categoria?.nombre || "Sin categoría"}
            </span>

            <span
              className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                stockEfectivo <= 0
                  ? "bg-gray-100 border-gray-200 text-gray-500"
                  : stockEfectivo <= 5
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              {stockEfectivo <= 0
                ? "Sin stock"
                : stockEfectivo <= 5
                ? `Quedan ${stockEfectivo}`
                : "En stock"}
            </span>
          </div>

          <h3 className="text-[15px] sm:text-base font-extrabold text-gray-900 leading-snug line-clamp-2">
            {p.nombre}
          </h3>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-gray-500 tracking-wide">
                Precio
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#007377] leading-none">
                {money(p.precio)}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#24d4da]" />
              <span className="font-bold">Entrega rápida</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAgregar(p);
            }}
            disabled={stockEfectivo <= 0}
            className={`
              w-full
              relative inline-flex items-center justify-center gap-2
              px-4 py-3 rounded-2xl text-sm font-extrabold
              transition active:scale-[0.98]
              ${
                stockEfectivo <= 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#24d4da] text-white hover:bg-[#007377] shadow-sm hover:shadow"
              }
            `}
          >
            <FaCartPlus />
            {stockEfectivo <= 0 ? "Agotado" : "Añadir al carrito"}
            {stockEfectivo > 0 && (
              <span className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-[#24d4da]/20 transition" />
            )}
          </button>

          <p className="text-[11px] text-gray-500">
            Toca la tarjeta para ver descripción y detalles.
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevancia");

  // UI/UX
  const [mostrarTodasCategorias, setMostrarTodasCategorias] = useState(false);
  const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);
  const CATS_PREVIEW = 10;

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
    const arr = Array.from(set);
    arr.sort((a, b) => a.localeCompare(b));
    return ["Todas", ...arr];
  }, [productosVisibles]);

  useEffect(() => {
    if (!categorias.includes(categoriaActiva)) setCategoriaActiva("Todas");
  }, [categorias, categoriaActiva]);

  const productosPorCategoria = useMemo(
    () => agruparPorCategoria(productosVisibles),
    [productosVisibles]
  );

  const productosFiltrados = useMemo(() => {
    let lista =
      categoriaActiva && categoriaActiva !== "Todas"
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
          className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
        />
        <span className="font-semibold">{producto.nombre}</span>
        <span className="text-gray-500">añadido</span>
      </div>
    );
  };

  const handleVerMas = (producto) => {
    navigate(`/producto/${producto.id}`);
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const categoriasMostradas = useMemo(() => {
    if (mostrarTodasCategorias) return categorias;
    return categorias.slice(0, Math.min(CATS_PREVIEW + 1, categorias.length));
  }, [categorias, mostrarTodasCategorias]);

  const pages = useMemo(
    () => buildPagination(paginaActual, totalPaginas),
    [paginaActual, totalPaginas]
  );

  return (
    <>
      <Helmet>
        <title>Productos - Darmax</title>
        <meta
          name="description"
          content="Explora nuestra amplia gama de productos en Darmax."
        />
      </Helmet>

      {/* 🌈 Fondo premium */}
      <div className="min-h-screen bg-gradient-to-b from-[#f7fbfb] via-white to-white">
        {/* HERO premium */}
        <section className="max-w-7xl mx-auto pt-10 pb-6 px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* glow */}
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#24d4da]/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#007377]/10 blur-3xl" />

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-extrabold text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-[#24d4da]" />
                    Catálogo Darmax
                  </div>

                  <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                    Nuestros Productos
                  </h1>

                  <p className="text-gray-600 mt-3 text-sm sm:text-base">
                    Busca, filtra y ordena con una experiencia limpia y rápida.
                    Encuentra lo ideal para tu hogar o negocio.
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-sm text-sm font-extrabold text-gray-800">
                    {productosFiltrados.length} resultados
                  </span>

                  <span className="px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-sm text-sm font-extrabold text-gray-800">
                    {categoriaActiva}
                  </span>

                  {/* Botón filtros mobile */}
                  <button
                    onClick={() => setMostrarFiltrosMobile(true)}
                    className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#24d4da] text-white font-extrabold shadow-sm hover:shadow transition active:scale-[0.98]"
                  >
                    <FaSlidersH />
                    Filtros
                  </button>
                </div>
              </div>

              {/* Search + Sort (hero) */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-8 relative">
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-2xl text-sm bg-white shadow-sm focus:ring-2 focus:ring-[#24d4da] focus:border-transparent transition"
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-gray-100 text-gray-600"
                      aria-label="Limpiar búsqueda"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                <div className="md:col-span-4">
                  <div className="h-full inline-flex w-full items-center gap-2 px-4 py-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm text-gray-700">
                    <FaSortAmountDownAlt className="text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-sm outline-none w-full font-bold"
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

              {/* Chips categorías (solo desktop) */}
              <div className="mt-5 hidden md:block">
                <div
                  className="
                    flex items-center gap-2
                    overflow-x-auto whitespace-nowrap
                    scroll-smooth
                    [-ms-overflow-style:none] [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                    py-1
                  "
                >
                  {categoriasMostradas.map((cat) => {
                    const active = cat === categoriaActiva;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoriaActiva(cat)}
                        className={`
                          relative shrink-0
                          px-4 py-2 rounded-full text-sm font-extrabold
                          border transition
                          focus:outline-none focus:ring-2 focus:ring-[#24d4da]/40
                          ${
                            active
                              ? "bg-gray-900 text-white border-gray-900 shadow"
                              : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                          }
                        `}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {categorias.length > CATS_PREVIEW + 1 && (
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => setMostrarTodasCategorias((prev) => !prev)}
                      className="text-sm font-extrabold text-[#007377] hover:text-[#005b5e] transition"
                    >
                      {mostrarTodasCategorias ? "Ver menos" : "Ver más"}
                    </button>

                    {categoriaActiva !== "Todas" && (
                      <button
                        onClick={() => setCategoriaActiva("Todas")}
                        className="text-sm font-extrabold text-gray-600 hover:text-gray-900 transition"
                      >
                        Limpiar categoría
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Layout: sidebar categorías (desktop) + grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar (desktop) */}
            <aside className="hidden md:block md:col-span-3">
              <div className="sticky top-20 space-y-4">
                <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-5">
                  <p className="text-sm font-extrabold text-gray-900">
                    Categorías
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Elige una para filtrar rápido.
                  </p>

                  <div className="mt-4 space-y-2">
                    {categorias.map((cat) => {
                      const active = cat === categoriaActiva;
                      return (
                        <button
                          key={cat}
                          onClick={() => setCategoriaActiva(cat)}
                          className={`
                            w-full text-left px-4 py-3 rounded-2xl
                            border transition font-extrabold text-sm
                            ${
                              active
                                ? "bg-[#24d4da]/15 border-[#24d4da]/30 text-[#007377]"
                                : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{cat}</span>
                            {active && (
                              <span className="text-[11px] px-2 py-1 rounded-full bg-white border border-gray-200">
                                Activa
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-5">
                  <p className="text-sm font-extrabold text-gray-900">
                    Tips rápidos
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-gray-600">
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#24d4da]" />
                      Usa búsqueda para encontrar por nombre.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#24d4da]" />
                      Ordena por precio o stock.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#24d4da]" />
                      Toca una tarjeta para ver detalles.
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="md:col-span-9">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : (
                <>
                  {/* Barra “estado” */}
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {searchTerm && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-extrabold text-gray-700 shadow-sm">
                          Búsqueda: <span className="font-black">{searchTerm}</span>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="p-1 rounded-full hover:bg-gray-100"
                            aria-label="Quitar búsqueda"
                          >
                            <FaTimes />
                          </button>
                        </span>
                      )}
                      {categoriaActiva !== "Todas" && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-extrabold text-gray-700 shadow-sm">
                          Categoría:{" "}
                          <span className="font-black">{categoriaActiva}</span>
                          <button
                            onClick={() => setCategoriaActiva("Todas")}
                            className="p-1 rounded-full hover:bg-gray-100"
                            aria-label="Quitar categoría"
                          >
                            <FaTimes />
                          </button>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 font-bold">
                      Página <span className="text-gray-900">{paginaActual}</span>{" "}
                      de <span className="text-gray-900">{totalPaginas}</span>
                    </div>
                  </div>

                  {productosFiltrados.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                      <div className="mx-auto h-12 w-12 rounded-2xl bg-[#24d4da]/15 flex items-center justify-center">
                        <FaSearch className="text-[#007377]" />
                      </div>
                      <p className="mt-4 text-2xl font-extrabold text-gray-900">
                        No se encontraron productos
                      </p>
                      <p className="mt-2 text-gray-600">
                        Prueba con otra categoría o término de búsqueda.
                      </p>
                      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="px-6 py-3 rounded-2xl bg-[#24d4da] text-white font-extrabold hover:bg-[#007377] transition active:scale-[0.98]"
                          >
                            Limpiar búsqueda
                          </button>
                        )}
                        {categoriaActiva !== "Todas" && (
                          <button
                            onClick={() => setCategoriaActiva("Todas")}
                            className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 font-extrabold hover:bg-gray-50 transition active:scale-[0.98]"
                          >
                            Quitar categoría
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
                        {productosPaginados.map((p) => {
                          const itemEnCarrito = carrito.find(
                            (item) => item.id === p.id
                          );
                          const cantidadEnCarrito = itemEnCarrito
                            ? itemEnCarrito.cantidad
                            : 0;
                          const stockEfectivo = (p.stock ?? 0) - cantidadEnCarrito;

                          const badge =
                            stockEfectivo <= 0
                              ? { text: "Agotado", cls: "bg-gray-900 text-white" }
                              : stockEfectivo <= 5
                              ? {
                                  text: `Últimos ${stockEfectivo}`,
                                  cls: "bg-red-500 text-white",
                                }
                              : {
                                  text: "Disponible",
                                  cls: "bg-emerald-500 text-white",
                                };

                          return (
                            <ProductCard
                              key={p.id}
                              p={p}
                              stockEfectivo={stockEfectivo}
                              badge={badge}
                              onVerMas={handleVerMas}
                              onAgregar={handleAgregarCarrito}
                            />
                          );
                        })}
                      </div>

                      {/* PAGINACIÓN PRO */}
                      {totalPaginas > 1 && (
                        <div className="mt-12 flex flex-col items-center gap-4">
                          <div className="inline-flex items-center gap-2 rounded-3xl border border-gray-200 bg-white shadow-sm px-3 py-2">
                            <button
                              onClick={() => cambiarPagina(paginaActual - 1)}
                              disabled={paginaActual === 1}
                              className="
                                h-11 w-11 rounded-2xl
                                border border-gray-200
                                bg-white
                                hover:bg-gray-50
                                disabled:opacity-50 disabled:hover:bg-white
                                flex items-center justify-center
                                transition
                              "
                              aria-label="Página anterior"
                            >
                              <FaChevronLeft size={16} />
                            </button>

                            <div className="flex items-center gap-1">
                              {pages.map((v, idx) =>
                                v === "…" ? (
                                  <span
                                    key={`dots-${idx}`}
                                    className="px-2 text-gray-400 font-black"
                                  >
                                    …
                                  </span>
                                ) : (
                                  <button
                                    key={v}
                                    onClick={() => cambiarPagina(v)}
                                    className={`
                                      h-11 min-w-[44px] px-3 rounded-2xl
                                      border text-sm font-extrabold transition
                                      ${
                                        paginaActual === v
                                          ? "bg-gray-900 border-gray-900 text-white shadow"
                                          : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                                      }
                                    `}
                                    aria-current={
                                      paginaActual === v ? "page" : undefined
                                    }
                                  >
                                    {v}
                                  </button>
                                )
                              )}
                            </div>

                            <button
                              onClick={() => cambiarPagina(paginaActual + 1)}
                              disabled={paginaActual === totalPaginas}
                              className="
                                h-11 w-11 rounded-2xl
                                border border-gray-200
                                bg-white
                                hover:bg-gray-50
                                disabled:opacity-50 disabled:hover:bg-white
                                flex items-center justify-center
                                transition
                              "
                              aria-label="Página siguiente"
                            >
                              <FaChevronRight size={16} />
                            </button>
                          </div>

                          <div className="text-xs text-gray-500 font-bold">
                            Mostrando{" "}
                            <span className="text-gray-900">
                              {inicio + 1}-{Math.min(fin, productosFiltrados.length)}
                            </span>{" "}
                            de{" "}
                            <span className="text-gray-900">
                              {productosFiltrados.length}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </main>
          </div>
        </section>

        {/* MODAL filtros (mobile) */}
        {mostrarFiltrosMobile && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMostrarFiltrosMobile(false)}
            />
            <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white border-t border-gray-200 shadow-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="text-base font-extrabold text-gray-900">
                  Filtros
                </p>
                <button
                  onClick={() => setMostrarFiltrosMobile(false)}
                  className="h-10 w-10 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  aria-label="Cerrar"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm font-extrabold text-gray-900">Categorías</p>
                <div className="mt-3 max-h-56 overflow-auto space-y-2 pr-1">
                  {categorias.map((cat) => {
                    const active = cat === categoriaActiva;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoriaActiva(cat)}
                        className={`
                          w-full text-left px-4 py-3 rounded-2xl border transition font-extrabold text-sm
                          ${
                            active
                              ? "bg-[#24d4da]/15 border-[#24d4da]/30 text-[#007377]"
                              : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                          }
                        `}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setCategoriaActiva("Todas");
                      setSearchTerm("");
                    }}
                    className="px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 transition active:scale-[0.98]"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={() => setMostrarFiltrosMobile(false)}
                    className="px-4 py-3 rounded-2xl bg-[#24d4da] text-white font-extrabold hover:bg-[#007377] transition active:scale-[0.98]"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
