import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const videos = [
  {
    id: "purificador-eco",
    titulo: "Purificador DARMAX",
    thumbnail: "img/PurificadoresCaseros/purificadorcasero2.jpg",
    descripcion: "Detalles técnicos, instalación y mantenimiento del modelo Eco.",
  },
  {
    id: "purificador-plus",
    titulo: "Purificador Familiar Plus",
    thumbnail: "img/PurificadoresCaseros/purificadorcasero1.jpg",
    descripcion: "Demostración del modelo Plus y consejos de uso doméstico.",
  },
  {
    id: "purificador-premium",
    titulo: "Purificador Premium UV",
    thumbnail: "img/PurificadoresCaseros/purificadorcasero3.jpg",
    descripcion: "Funcionamiento interno con luz UV y mantenimiento recomendado.",
  },
];

export default function Videos() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Centro de Videos | Darmax</title>
        <meta
          name="description"
          content="Explora nuestra galería de videos sobre purificadoras y equipos Darmax."
        />
      </Helmet>

      <div className="w-screen min-h-screen font-sans text-gray-800 bg-white overflow-x-hidden pt-20 px-6 md:px-16 py-16">
        <h1 className="text-4xl font-bold mb-12 text-blue-900 text-center">Centro de Videos de Darmax Agua</h1>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 hover:scale-[1.02] transition cursor-pointer"
              onClick={() => navigate(`/videos/${video.id}`)}
            >
              <img
                src={video.thumbnail}
                alt={video.titulo}
                className="w-full object-contain rounded-2xl mb-4"
              />
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{video.titulo}</h3>
              <p className="text-sm text-gray-700">{video.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
