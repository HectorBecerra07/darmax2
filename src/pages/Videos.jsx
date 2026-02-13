import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Search, Film, SlidersHorizontal } from "lucide-react";

// Mock data (debería venir de una API en un caso real)
const videos = [
  {
    id: "purificador-eco",
    titulo: "Instalación Purificador DARMAX Eco",
    thumbnail: "/img/PurificadoresCaseros/purificadorcasero2.jpg",
    descripcion: "Tutorial completo sobre la instalación, detalles técnicos y mantenimiento del purificador modelo Eco.",
    categoria: "Instalación",
    duracion: "6:12",
    destacado: true,
  },
  {
    id: "purificador-plus",
    titulo: "Guía de Uso: Purificador Familiar Plus",
    thumbnail: "/img/PurificadoresCaseros/purificadorcasero1.jpg",
    descripcion: "Demostración práctica del modelo Plus y consejos para el uso diario en el hogar.",
    categoria: "Uso en casa",
    duracion: "5:01",
    destacado: false,
  },
  {
    id: "purificador-premium",
    titulo: "Mantenimiento del Purificador Premium UV",
    thumbnail: "/img/PurificadoresCaseros/purificadorcasero3.jpg",
    descripcion: "Explora el funcionamiento de la luz UV y aprende el mantenimiento recomendado para el modelo Premium.",
    categoria: "Mantenimiento",
    duracion: "7:40",
    destacado: false,
  },
];

// --- Subcomponentes ---

const VideoCard = ({ video, navigate }) => (
  <button
    key={video.id}
    onClick={() => navigate(`/videos/${video.id}`)}
    className="text-left bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-slate-200/80"
  >
    <div className="relative">
      <img
        src={video.thumbnail}
        alt={video.titulo}
        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity" />
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayCircle className="w-14 h-14 text-white/80 drop-shadow-lg transform transition-transform group-hover:scale-110 group-hover:text-white" />
      </div>
      <div className="absolute bottom-3 left-3 flex gap-2">
        {video.duracion && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 text-slate-800">
            {video.duracion}
          </span>
        )}
      </div>
    </div>
    <div className="p-5">
      {video.categoria && (
        <p className="text-sm font-semibold text-indigo-600 mb-1">{video.categoria}</p>
      )}
      <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
        {video.titulo}
      </h4>
      <p className="text-sm text-slate-500 line-clamp-2">{video.descripcion}</p>
    </div>
  </button>
);


export default function Videos() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("todos");

  const categorias = useMemo(() => {
    const set = new Set(videos.map((v) => v.categoria).filter(Boolean));
    return ["todos", ...Array.from(set)];
  }, []);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos
      .filter((v) => (categoria === "todos" ? true : v.categoria === categoria))
      .filter((v) => {
        if (!q) return true;
        return (
          v.titulo.toLowerCase().includes(q) ||
          v.descripcion.toLowerCase().includes(q) ||
          (v.categoria || "").toLowerCase().includes(q)
        );
      });
  }, [query, categoria]);

  const destacado = useMemo(() => {
    return videos.find((v) => v.destacado) || videos[0];
  }, []);

  return (
    <>
      <Helmet>
        <title>Centro de Videos | Darmax</title>
        <meta
          name="description"
          content="Explora nuestra galería de videos sobre purificadoras y equipos Darmax."
        />
      </Helmet>

      <div className="min-h-screen font-sans text-slate-800 bg-slate-50 overflow-x-hidden">
        {/* --- Hero Section --- */}
        <section className="px-6 md:px-16 pt-28 pb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80">
              <Film className="w-4 h-4" />
              Centro de Videos Darmax
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Guías y tutoriales para tu purificador
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Encuentra videos claros y concisos para instalar, usar y dar mantenimiento a tu equipo Darmax.
            </p>
          </div>
        </section>

        {/* --- Video Destacado --- */}
        {destacado && (
          <section className="px-6 md:px-16 -mt-8 mb-16">
            <div className="max-w-6xl mx-auto">
                <button
                  onClick={() => navigate(`/videos/${destacado.id}`)}
                  className="w-full group text-left rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200/50"
                  aria-label="Abrir video destacado"
                >
                  <div className="relative aspect-video bg-slate-200">
                    <img
                      src={destacado.thumbnail}
                      alt={destacado.titulo}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="w-20 h-20 text-white/80 drop-shadow-lg transform transition-transform group-hover:scale-110 group-hover:text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-indigo-600 shadow-lg">
                          VIDEO DESTACADO
                        </span>
                        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                          {destacado.titulo}
                        </h2>
                        <p className="mt-2 text-base text-slate-200 drop-shadow-md max-w-2xl line-clamp-2">{destacado.descripcion}</p>
                    </div>
                  </div>
                </button>
            </div>
          </section>
        )}

        {/* --- Barra de Búsqueda y Filtros --- */}
        <section id="videos-grid" className="px-6 md:px-16 pb-12 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-lg border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto py-4">
              <div className="grid md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar por modelo, función, etc. (ej. Eco, UV, mantenimiento...)"
                      className="w-full bg-white border border-slate-300 rounded-xl px-12 py-3 outline-none focus:ring-2 focus:ring-indigo-300 transition"
                    />
                  </div>
                </div>

                <div className="md:col-span-4">
                   <div className="relative">
                     <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-12 py-3 outline-none focus:ring-2 focus:ring-indigo-300 transition appearance-none"
                    >
                      {categorias.map((c) => (
                        <option key={c} value={c}>
                          {c === "todos" ? "Todas las categorías" : c}
                        </option>
                      ))}
                    </select>
                   </div>
                </div>
              </div>
          </div>
        </section>


        {/* --- Grid de Videos --- */}
        <section className="px-6 md:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            {filtrados.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-2xl p-12 text-center bg-slate-100">
                <h4 className="text-xl font-bold text-slate-700 mb-2">No se encontraron resultados</h4>
                <p className="text-slate-500">Intenta con otra palabra clave o limpia los filtros.</p>
                 <button
                    onClick={() => {
                      setQuery("");
                      setCategoria("todos");
                    }}
                    className="mt-4 font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Limpiar filtros
                  </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtrados.map((video) => (
                  <VideoCard key={video.id} video={video} navigate={navigate} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- CTA Final --- */}
        <section className="px-6 md:px-16 pb-20">
            <div className="max-w-7xl mx-auto border border-slate-200/80 rounded-2xl p-8 md:p-12 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">
                    ¿No encuentras lo que buscas?
                  </h4>
                  <p className="text-slate-600 mt-1">
                    Nuestro equipo de soporte está listo para ayudarte con cualquier duda.
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => navigate("/contacto")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-sm"
                  >
                    Contactar a Soporte
                  </button>
                </div>
              </div>
            </div>
        </section>

      </div>
    </>
  );
}
