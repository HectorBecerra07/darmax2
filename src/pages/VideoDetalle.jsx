import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function VideoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [producto, setProducto] = useState(null);

  const videos = {
    "purificador-eco": {
      titulo: "Purificador Compacto Eco",
      video: "https://www.youtube.com/embed/MJYdWsrvBr8?si=afWbBtGRHprqgrBq",
      descripcion: "Detalles técnicos, instalación y mantenimiento del modelo Eco.",
    },
    "purificador-plus": {
      titulo: "Purificador Familiar Plus",
      video: "https://www.youtube.com/embed/MJYdWsrvBr8?si=afWbBtGRHprqgrBq",
      descripcion: "Demostración del modelo Plus y consejos de uso doméstico.",
    },
    "purificador-premium": {
      titulo: "Purificador Premium UV",
      video: "https://www.youtube.com/embed/MJYdWsrvBr8?si=afWbBtGRHprqgrBq",
      descripcion: "Funcionamiento interno con luz UV y mantenimiento recomendado.",
    },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timeout = setTimeout(() => {
      setProducto(videos[id] || null);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{producto?.titulo || "Video no encontrado"} | Darmax</title>
        <meta name="description" content={producto?.descripcion || "Video no disponible"} />
      </Helmet>

      <div className="w-screen min-h-screen font-sans text-gray-800 bg-white overflow-x-hidden pt-20 px-6 md:px-16 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Cargando video...</p>
          </div>
        ) : !producto ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Producto no encontrado</h2>
            <p className="mb-6 text-gray-700">
              El video que estás buscando no existe o fue removido.
            </p>
            <button
              onClick={() => navigate("/videos")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
            >
              Volver al Centro de Videos
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">{producto.titulo}</h1>
            <p className="mb-6 text-base">{producto.descripcion}</p>

            <div className="w-full max-w-4xl mx-auto aspect-video">
              <iframe
                loading="lazy"
                src={producto.video}
                title={producto.titulo}
                className="w-full h-full rounded"
                allowFullScreen
              ></iframe>
            </div>
          </>
        )}
      </div>
    </>
  );
}
