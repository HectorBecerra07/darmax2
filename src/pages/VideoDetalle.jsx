import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader, AlertTriangle, Home, ChevronRight, PlayCircle } from "lucide-react";

// Mock data - En una app real, esto vendría de un context o una API
const allVideos = [
    {
      id: "purificador-eco",
      titulo: "Instalación Purificador DARMAX Eco",
      thumbnail: "/img/PurificadoresCaseros/purificadorcasero2.jpg",
      videoUrl: "https://www.youtube.com/embed/MJYdWsrvBr8?si=afWbBtGRHprqgrBq&autoplay=1",
      descripcion: "Tutorial completo sobre la instalación, detalles técnicos y mantenimiento del purificador modelo Eco.",
      categoria: "Instalación",
      duracion: "6:12",
    },
    {
      id: "purificador-plus",
      titulo: "Guía de Uso: Purificador Familiar Plus",
      thumbnail: "/img/PurificadoresCaseros/purificadorcasero1.jpg",
      videoUrl: "https://www.youtube.com/embed/MJYdWsrvBr8?si=afWbBtGRHprqgrBq&autoplay=1",
      descripcion: "Demostración práctica del modelo Plus y consejos para el uso diario en el hogar.",
      categoria: "Uso en casa",
      duracion: "5:01",
    },
    {
      id: "purificador-premium",
      titulo: "Mantenimiento del Purificador Premium UV",
      thumbnail: "/img/PurificadoresCaseros/purificadorcasero3.jpg",
      videoUrl: "https://www.youtube.com/embed/MJYdWsrvBr8?si=afWbBtGRHprqgrBq&autoplay=1",
      descripcion: "Explora el funcionamiento de la luz UV y aprende el mantenimiento recomendado para el modelo Premium.",
      categoria: "Mantenimiento",
      duracion: "7:40",
    },
];

// --- Subcomponentes ---

const Breadcrumbs = ({ videoTitulo }) => (
    <nav className="flex items-center text-sm font-semibold text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-600 flex items-center gap-1">
            <Home className="w-4 h-4" />
            Inicio
        </Link>
        <ChevronRight className="w-5 h-5 text-slate-400" />
        <Link to="/videos" className="hover:text-indigo-600">
            Videos
        </Link>
        <ChevronRight className="w-5 h-5 text-slate-400" />
        <span className="text-slate-700 truncate">{videoTitulo}</span>
    </nav>
);

const RelatedVideoCard = ({ video, navigate }) => (
    <button
      key={video.id}
      onClick={() => navigate(`/videos/${video.id}`)}
      className="text-left bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group border border-slate-200/80"
    >
      <div className="relative">
        <img src={video.thumbnail} alt={video.titulo} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white/80 drop-shadow-lg transform transition-transform group-hover:scale-110" />
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-indigo-600 mb-1">{video.categoria}</p>
        <h4 className="text-base font-bold text-slate-800 line-clamp-2">{video.titulo}</h4>
      </div>
    </button>
);


export default function VideoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const relatedVideos = useMemo(() => {
    return allVideos.filter(v => v.id !== id).slice(0, 3);
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    const timeout = setTimeout(() => {
      const foundVideo = allVideos.find(v => v.id === id) || null;
      setVideo(foundVideo);
      setLoading(false);
    }, 300); // Simula una carga de red
    return () => clearTimeout(timeout);
  }, [id]);

  const pageTitle = video?.titulo || "Video no encontrado";
  const pageDescription = video?.descripcion || "Video no disponible";

  return (
    <>
      <Helmet>
        <title>{`${pageTitle} | Darmax`}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className="min-h-screen font-sans bg-slate-50 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
            {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                <Loader className="w-12 h-12 animate-spin text-indigo-500" />
                <p className="mt-4 text-lg font-semibold">Cargando video...</p>
            </div>
            ) : !video ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <AlertTriangle className="w-16 h-16 text-amber-500" />
                <h2 className="mt-4 text-3xl font-extrabold text-slate-800">Video no encontrado</h2>
                <p className="mt-2 text-slate-500">El video que buscas no existe o fue removido.</p>
                <button
                onClick={() => navigate("/videos")}
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-sm"
                >
                Volver al Centro de Videos
                </button>
            </div>
            ) : (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* --- Contenido principal (Video) --- */}
                <div className="lg:col-span-8">
                    <Breadcrumbs videoTitulo={video.titulo} />
                    
                    <div className="aspect-video w-full bg-slate-200 rounded-2xl shadow-2xl shadow-indigo-200/50 overflow-hidden border border-slate-200/50">
                        <iframe
                            key={id} // Forzar recarga del iframe al cambiar de video
                            loading="lazy"
                            src={video.videoUrl}
                            title={video.titulo}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <header className="mt-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{video.titulo}</h1>
                        <p className="mt-3 text-lg text-slate-600">{video.descripcion}</p>
                    </header>
                </div>

                {/* --- Barra lateral (Videos relacionados) --- */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-28">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 pt-10 lg:pt-0">También te podría interesar</h3>
                        <div className="space-y-4">
                        {relatedVideos.map(related => (
                            <RelatedVideoCard key={related.id} video={related} navigate={navigate} />
                        ))}

                        <button
                            onClick={() => navigate('/videos')}
                            className="w-full mt-4 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 font-semibold py-3 rounded-lg transition"
                        >
                            Ver todos los videos
                        </button>
                        </div>
                    </div>
                </aside>
            </div>
            )}
        </div>
      </div>
    </>
  );
}
