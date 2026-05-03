import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import axios from "axios";
import { getEmbedUrl } from "../utils/videoUtils";
import { 
  CalendarIcon, 
  UserIcon, 
  ArrowLeftIcon,
  TagIcon,
  ShareIcon
} from "@heroicons/react/24/outline";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "";
        const response = await axios.get(`${API_URL}/api/blog`, {
          params: { slug }
        });
        setPost(response.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Cargar y procesar el script de Instagram dinámicamente
  useEffect(() => {
    if (!post) return;

    const process = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    if (!document.getElementById('instagram-embed-script')) {
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => process();
      document.body.appendChild(script);
    } else {
      process();
    }

    const timers = [
      setTimeout(process, 500),
      setTimeout(process, 1000),
      setTimeout(process, 2000)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [post, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🏜️</div>
          <h1 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Artículo no encontrado</h1>
          <p className="text-slate-500 mb-8 font-medium">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
          <Link to="/blog" className="inline-block px-8 py-4 bg-cyan-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-cyan-700 transition-all shadow-xl shadow-cyan-600/20">
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Helmet>
        <title>{post.title} | Blog Darmax Agua</title>
        <meta name="description" content={post.title} />
        {post.image && <meta property="og:image" content={post.image} />}
      </Helmet>

      <div className="max-w-5xl mx-auto px-6">
        {/* Navegación */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-600 transition-colors mb-8 font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver al Blog
        </Link>

        {/* Header del Post */}
        <div className="mb-12">
          <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-slate-300" />
              <span>Por <span className="text-slate-900 font-bold">{post.author}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-300" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Imagen Destacada */}
        {post.image && (
          <div className="rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl shadow-slate-900/10 max-h-[500px]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Contenido del Artículo */}
        <div 
          className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8
            prose-strong:text-slate-900 prose-strong:font-black
            prose-a:text-cyan-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline
            /* Forzar clases dinámicas para highlights avanzados, videos y espaciados */
            [&_.border-l-8]:border-l-8 [&_.border-l-4]:border-l-4 [&_.border-cyan-500]:border-cyan-500 
            [&_.border-4]:border-4 [&_.border-white]:border-white
            [&_.pl-6]:pl-6 [&_.pl-10]:pl-10 [&_.pr-10]:pr-10 [&_.p-10]:p-10
            [&_.py-6]:py-6 [&_.py-10]:py-10 [&_.py-12]:py-12 [&_.py-4]:py-4 
            [&_.pb-8]:pb-8 [&_.pb-10]:pb-10 [&_.pb-12]:pb-12 [&_.pb-14]:pb-14
            [&_.my-10]:my-10 [&_.my-8]:my-8 [&_.my-12]:my-12 [&_.my-14]:my-14 [&_.my-16]:my-16 [&_.my-20]:my-20
            [&_.mt-12]:mt-12 [&_.mt-14]:mt-14 [&_.mt-16]:mt-16 [&_.mt-20]:mt-20
            [&_.mb-16]:mb-16 [&_.mb-20]:mb-20 [&_.mb-10]:mb-10 [&_.mb-8]:mb-8 [&_.mb-6]:mb-6 [&_.mb-14]:mb-14
            [&_.italic]:italic [&_.text-xl]:text-xl [&_.text-lg]:text-lg [&_.text-2xl]:text-2xl
            [&_.md\:text-2xl]:md:text-2xl [&_.md\:text-xl]:md:text-xl 
            [&_.font-medium]:font-medium [&_.font-bold]:font-bold [&_.text-slate-700]:text-slate-700 
            [&_.leading-relaxed]:leading-relaxed [&_.bg-slate-50]:bg-slate-50 [&_.bg-cyan-50]:bg-cyan-50
            [&_.rounded-2xl]:rounded-2xl [&_.rounded-r-2xl]:rounded-r-2xl [&_.rounded-3xl]:rounded-3xl [&_.rounded-\[2\.5rem\]]:rounded-[2.5rem] [&_.rounded-\[2rem\]]:rounded-[2rem] [&_.rounded-\[3rem\]]:rounded-[3rem]
            [&_.shadow-sm]:shadow-sm [&_.shadow-2xl]:shadow-2xl [&_.shadow-inner]:shadow-inner
            /* Clases para video lateral y central */
            [&_.float-right]:float-right [&_.float-left]:float-left 
            [&_.ml-8]:ml-8 [&_.ml-10]:ml-10 [&_.ml-12]:ml-12 [&_.mr-8]:mr-8 [&_.mr-12]:mr-12 [&_.mx-4]:mx-4 
            [&_.lg\:-ml-12]:lg:-ml-12 [&_.lg\:-mr-12]:lg:-mr-12 [&_.lg\:-mt-40]:lg:-mt-40 [&_.z-10]:z-10 [&_.relative]:relative
            [&_.w-full]:w-full [&_.w-\[320px\]]:w-[320px] [&_.sm\:w-\[360px\]]:sm:w-[360px] [&_.md\:w-1\/2]:md:w-1/2 [&_.md\:w-\[380px\]]:md:w-[380px] [&_.md\:w-\[320px\]]:md:w-[320px]
            [&_.aspect-video]:aspect-video [&_.aspect-\[9\/16\]]:aspect-[9/16] [&_.aspect-\[4\/3\]]:aspect-[4/3]
            /* Clases para el bloque de Comparativa / Columnas */
            [&_.grid]:grid [&_.grid-cols-1]:grid-cols-1 [&_.md\:grid-cols-2]:md:grid-cols-2 [&_.md\:grid-cols-3]:md:grid-cols-3 [&_.md\:grid-cols-4]:md:grid-cols-4
            [&_.gap-6]:gap-6 [&_.md\:gap-8]:md:gap-8 [&_.border-t-8]:border-t-8 [&_.bg-slate-50\/50]:bg-slate-50/50 [&_.hover\:scale-\[1\.02\]]:hover:scale-[1.02] [&_.transition-transform]:transition-transform
            /* Colores dinámicos para columnas y tips */
            [&_.bg-cyan-50\/50]:bg-cyan-50/50 [&_.text-cyan-950]:text-cyan-950 [&_.text-cyan-900]:text-cyan-900 [&_.prose-strong\:text-cyan-950_strong]:text-cyan-950
            [&_.bg-teal-50\/50]:bg-teal-50/50 [&_.text-teal-950]:text-teal-950 [&_.text-teal-900]:text-teal-900 [&_.prose-strong\:text-teal-950_strong]:text-teal-950
            [&_.bg-indigo-50\/50]:bg-indigo-50/50 [&_.text-indigo-950]:text-indigo-950 [&_.text-indigo-900]:text-indigo-900 [&_.prose-strong\:text-indigo-950_strong]:text-indigo-950
            [&_.bg-rose-50\/50]:bg-rose-50/50 [&_.text-rose-950]:text-rose-950 [&_.text-rose-900]:text-rose-900 [&_.prose-strong\:text-rose-950_strong]:text-rose-950
            [&_.bg-amber-50\/50]:bg-amber-50/50 [&_.text-amber-950]:text-amber-950 [&_.text-amber-900]:text-amber-900 [&_.prose-strong\:text-amber-950_strong]:text-amber-950"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Video opcional si está fuera del contenido HTML */}
        {post.videoUrl && !post.content.includes(post.videoUrl) && (
            <div className="mt-12 rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-slate-100 aspect-video">
                <iframe 
                    src={getEmbedUrl(post.videoUrl)} 
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>
        )}

        {/* Footer del Post */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-slate-300" />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Etiquetas:</span>
            <div className="flex flex-wrap gap-2">
              {(post.tags && post.tags.length > 0 ? post.tags : [post.category, "Darmax"]).map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-black text-slate-900 px-2 py-1 bg-slate-100 rounded-md">#{tag}</span>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => {
                if (navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("¡Enlace copiado al portapapeles!");
                }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
            Compartir Guía
          </button>
        </div>

        {/* CTA Final */}
        <div className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-cyan-600 to-[#168387] text-white text-center shadow-xl shadow-cyan-900/20">
          <h3 className="text-2xl md:text-3xl font-black mb-4">¿Te interesa este modelo de negocio?</h3>
          <p className="text-white/80 mb-8 font-medium">Nuestros asesores pueden ayudarte a aterrizar tu proyecto con el equipo ideal.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contacto" className="px-8 py-4 bg-white text-slate-900 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
              Hablar con un Experto
            </Link>
            <Link to="/" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/10 transition-all">
              Ver Equipos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
