import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const videos = [
  {
    id: "purificador-eco",
    titulo: "Purificador DARMAX",
    thumbnail: "img/PurificadoresCaseros/purificadorcasero2.jpg",
    descripcion: "Detalles técnicos, instalación y mantenimiento del modelo Eco.",
    categoria: "Instalación",
    duracion: "6:12",
    destacado: true,
  },
  {
    id: "purificador-plus",
    titulo: "Purificador Familiar Plus",
    thumbnail: "img/PurificadoresCaseros/purificadorcasero1.jpg",
    descripcion: "Demostración del modelo Plus y consejos de uso doméstico.",
    categoria: "Uso en casa",
    duracion: "5:01",
    destacado: false,
  },
  {
    id: "purificador-premium",
    titulo: "Purificador Premium UV",
    thumbnail: "img/PurificadoresCaseros/purificadorcasero3.jpg",
    descripcion: "Funcionamiento interno con luz UV y mantenimiento recomendado.",
    categoria: "Mantenimiento",
    duracion: "7:40",
    destacado: false,
  },
];

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

      <div className="w-screen min-h-screen font-sans text-gray-900 bg-white overflow-x-hidden pt-20">
        {/* HERO / LANDING */}
        <section className="px-6 md:px-16 pt-10 pb-10 md:pt-14 md:pb-14">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
            {/* Copy */}
            <div className="lg:col-span-6">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                Centro de Videos Darmax Agua
              </p>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
                Tutoriales claros para instalar, usar y dar mantenimiento a tu purificador.
              </h1>

              <p className="mt-4 text-base md:text-lg text-gray-600">
                Encuentra el video correcto por modelo o categoría. Todo en un solo lugar.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById("videos-grid");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-sm"
                >
                  Ver videos
                </button>

                <button
                  onClick={() => navigate(`/videos/${destacado.id}`)}
                  className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-semibold shadow-sm"
                >
                  Ver destacado
                </button>
              </div>

              {/* Buscador + Filtro */}
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-3xl p-4 md:p-5">
                <div className="grid md:grid-cols-12 gap-3">
                  <div className="md:col-span-8">
                    <label className="text-xs font-bold text-gray-600">Buscar</label>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ej. Eco, UV, mantenimiento..."
                      className="mt-1 w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-gray-600">Categoría</label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="mt-1 w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {categorias.map((c) => (
                        <option key={c} value={c}>
                          {c === "todos" ? "Todas" : c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Mostrando{" "}
                    <span className="font-bold text-gray-700">{filtrados.length}</span> video(s)
                  </span>
                  <button
                    onClick={() => {
                      setQuery("");
                      setCategoria("todos");
                    }}
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta destacada */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-5 md:p-7 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold text-blue-700">VIDEO DESTACADO</p>
                    <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900">
                      {destacado.titulo}
                    </h2>
                    <p className="mt-3 text-gray-600">{destacado.descripcion}</p>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      {destacado.categoria ? (
                        <span className="px-3 py-1 rounded-full bg-white border border-gray-200 font-semibold text-gray-700">
                          {destacado.categoria}
                        </span>
                      ) : null}
                      {destacado.duracion ? (
                        <span className="px-3 py-1 rounded-full bg-white border border-gray-200 font-semibold text-gray-700">
                          {destacado.duracion}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/videos/${destacado.id}`)}
                  className="mt-5 w-full group text-left"
                  aria-label="Abrir video destacado"
                >
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-200 bg-white">
                    <img
                      src={destacado.thumbnail}
                      alt={destacado.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-3 bg-white/90 backdrop-blur border border-gray-200 px-5 py-3 rounded-2xl shadow-sm group-hover:shadow">
                        <span className="inline-flex w-10 h-10 rounded-full bg-blue-600 text-white items-center justify-center font-black">
                          ▶
                        </span>
                        <div>
                          <p className="font-extrabold leading-tight">Reproducir</p>
                          <p className="text-xs text-gray-600">Abrir detalles del video</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate(`/videos/${destacado.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold"
                  >
                    Ver ahora
                  </button>
                  <button
                    onClick={() => navigate("/contacto")}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 px-6 py-3 rounded-2xl font-semibold"
                  >
                    ¿Necesitas ayuda?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GRID DE VIDEOS */}
        <section id="videos-grid" className="px-6 md:px-16 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h3 className="text-3xl font-extrabold text-blue-900">Biblioteca de Videos</h3>
              <p className="mt-2 text-gray-600">
                Selecciona un video para ver el detalle y reproducirlo.
              </p>
            </div>

            {filtrados.length === 0 ? (
              <div className="border border-gray-200 rounded-3xl p-10 text-center bg-gray-50">
                <h4 className="text-xl font-extrabold mb-2">No encontramos resultados</h4>
                <p className="text-gray-600">Prueba otra búsqueda o cambia la categoría.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {filtrados.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => navigate(`/videos/${video.id}`)}
                    className="text-left bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg transition overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.titulo}
                        className="w-full h-56 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition" />

                      <div className="absolute top-3 left-3 flex gap-2">
                        {video.categoria ? (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/90 border border-gray-200">
                            {video.categoria}
                          </span>
                        ) : null}
                        {video.duracion ? (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/90 border border-gray-200">
                            {video.duracion}
                          </span>
                        ) : null}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black group-hover:scale-105 transition">
                          ▶
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-extrabold text-blue-800 mb-2">
                        {video.titulo}
                      </h4>
                      <p className="text-sm text-gray-700">{video.descripcion}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-800">
                          Ver video →
                        </span>
                        {video.destacado ? (
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                            Destacado
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* CTA FINAL */}
            <div className="mt-12 border border-gray-200 rounded-3xl p-8 md:p-10 bg-gray-50">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h4 className="text-2xl font-extrabold text-gray-900">
                    ¿No encuentras tu modelo?
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Escríbenos y te ayudamos con instalación, mantenimiento o refacciones.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/contacto")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold"
                  >
                    Contactar soporte
                  </button>
                  <button
                    onClick={() => navigate("/productos")}
                    className="bg-white hover:bg-gray-100 border border-gray-200 px-6 py-3 rounded-2xl font-semibold"
                  >
                    Ver productos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
