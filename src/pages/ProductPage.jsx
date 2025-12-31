import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Simulación de productos (puedes importar desde un contexto o fetch real si gustas)
const productos = [
  {
    id: "1",
    nombre: "Producto Ejemplo",
    descripcion: "Descripción detallada del producto.",
    imagen: "/img/productos/ejemplo.jpg",
    precio: 199,
  },
  {
    id: "2",
    nombre: "Purificadora Básica",
    descripcion: "Equipo ideal para comenzar tu propio negocio de agua purificada.",
    imagen: "/img/productos/purificadora-basica.jpg",
    precio: 54950,
  },
  {
    id: "3",
    nombre: "Máquina Vending",
    descripcion: "Máquina automática para dispensar garrafones, ideal para negocios 24/7.",
    imagen: "/img/productos/vending.jpg",
    precio: 79900,
  },
];

export default function ProductPage({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const producto = productos.find((p) => p.id === id);

  // ✅ Scroll to top al montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (!producto) {
    return (
      <>
        <Helmet>
          <title>Producto no encontrado - Darmax</title>
        </Helmet>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Producto no encontrado</h2>
          <button
            onClick={() => navigate("/productos")}
            className="text-blue-600 hover:underline"
          >
            Volver a productos
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${producto.nombre} - Darmax`}</title>
        <meta name="description" content={producto.descripcion} />
        <meta property="og:title" content={`${producto.nombre} - Darmax`} />
        <meta property="og:description" content={producto.descripcion} />
        <meta property="og:image" content={producto.imagen} />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
          <div className="h-80 md:h-auto">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 flex flex-col justify-center gap-6">
            <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
            <p className="text-gray-700">{producto.descripcion}</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${producto.precio.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            <button
              onClick={() => {
                if (onAddToCart) {
                  onAddToCart({ ...producto, cantidad: 1 });
                }
                navigate("/carrito");
              }}
              className="bg-[#ccff00] hover:brightness-90 text-black px-6 py-3 rounded-xl font-semibold"
            >
              Añadir al carrito
            </button>

            <button
              onClick={() => navigate("/productos")}
              className="text-blue-600 hover:underline mt-4"
            >
              Volver a productos
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
