import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import ProductModal from "../components/ProductModal";
import { useCarrito } from "../context/CarritoContext";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIA_PURIFICADORES = "PurificadoresCaseros";

const agruparPorCategoria = (productos) =>
  productos.reduce((acc, p) => {
    const cat = p.categoria?.nombre || "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);

  const productosPorPagina = 10;
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

  const productosFiltrados = categoriaActiva
    ? productosPorCategoria[categoriaActiva] || []
    : productosVisibles;

  const totalPaginas =
    Math.ceil(productosFiltrados.length / productosPorPagina) || 1;
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(inicio, fin);

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

  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaActiva]);

  const money = (n) => `MXN $${Number(n || 0).toFixed(2)}`;

  return (
    <>
      <Helmet>
        <title>Productos - Darmax</title>
        <meta
          name="description"
          content="Explora nuestra amplia gama de productos de alta calidad en Darmax. Encuentra todo lo que necesitas, desde purificadores hasta soluciones para tu negocio."
        />
      </Helmet>

      <section className="p-6 max-w-7xl mx-auto pt-10 pb-16">
        <h2 className="text-3xl font-bold mb-12 text-center uppercase tracking-wide">
          Nuestros productos
        </h2>

        {/* LOADING SPINNER */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#24d4da] rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Cargando productos...</p>
          </div>
        ) : (
          <>
            {/* CATEGORÍAS */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categorias.length === 0 ? (
                <span className="text-gray-500 text-sm">
                  No hay categorías de componentes disponibles.
                </span>
              ) : (
                categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-medium border transition ${
                      cat === categoriaActiva
                        ? "text-white font-semibold"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    style={
                      cat === categoriaActiva
                        ? { backgroundColor: "#24d4da", borderColor: "#24d4da" }
                        : {}
                    }
                  >
                    {cat}
                  </button>
                ))
              )}
            </div>

            {/* GRID DE PRODUCTOS (CARD UNIFICADA + IMAGEN MISMO TAMAÑO) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {productosPaginados.map((p) => {
                const itemEnCarrito = carrito.find((item) => item.id === p.id);
                const cantidadEnCarrito = itemEnCarrito
                  ? itemEnCarrito.cantidad
                  : 0;
                const stockEfectivo = (p.stock ?? 0) - cantidadEnCarrito;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleVerMas(p)}
                    className="
                      group cursor-pointer
                      bg-white rounded-3xl
                      border border-gray-100
                      shadow-sm hover:shadow-xl
                      transition-all duration-300
                      overflow-hidden
                      flex flex-col
                    "
                  >
                    {/* Imagen uniforme */}
                    <div className="relative w-full aspect-[4/3] bg-gray-0 flex items-center justify-center">
                      <img
                        src={p.imagen || "https://via.placeholder.com/400x300"}
                        alt={p.nombre}
                        loading="lazy"
                        className="
                          max-h-[160px]
                          object-contain
                          transition-transform duration-300
                          group-hover:scale-105
                        "
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />

                      {/* Línea divisoria */}
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    </div>

                    {/* Contenido */}
                    <div className="flex flex-col items-center text-center px-5 py-4">
                      <p className="text-base font-semibold capitalize leading-snug">
                        {p.nombre}
                      </p>

                      <p className="mt-1 text-black font-bold text-base">
                        {money(p.precio)}
                      </p>

                      <p className="mt-1 text-gray-500 text-sm">
                        Disponibles:{" "}
                        <span
                          className={
                            stockEfectivo <= 0 ? "text-red-500 font-bold" : ""
                          }
                        >
                          {stockEfectivo}
                        </span>
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAgregarCarrito(p);
                        }}
                        disabled={stockEfectivo <= 0}
                        className={`
                          mt-3 px-5 py-2 rounded-full text-sm font-semibold transition
                          ${
                            stockEfectivo <= 0
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-[#24d4da] text-white hover:brightness-90"
                          }
                        `}
                      >
                        {stockEfectivo <= 0 ? "Agotado" : "Añadir al carrito"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {productosPaginados.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                  No hay productos para esta categoría.
                </div>
              )}
            </div>

            {/* PAGINACIÓN */}
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
                        ? "bg-[#24d4da] border-[#24d4da] text-black font-bold"
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
