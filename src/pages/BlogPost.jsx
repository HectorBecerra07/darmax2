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

      <div className="max-w-4xl mx-auto px-6">
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
            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-strong:text-slate-900 prose-strong:font-black
            prose-a:text-cyan-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline
            /* Forzar clases dinámicas para highlights */
            [&_.border-l-4]:border-l-4 [&_.border-cyan-500]:border-cyan-500 
            [&_.pl-6]:pl-6 [&_.my-8]:my-8 [&_.italic]:italic [&_.text-xl]:text-xl 
            [&_.md\:text-2xl]:md:text-2xl [&_.font-medium]:font-medium 
            [&_.text-slate-700]:text-slate-700 [&_.leading-relaxed]:leading-relaxed"
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
            <div className="flex gap-2">
              <span className="text-[10px] font-black text-slate-900 px-2 py-1 bg-slate-100 rounded-md">#{post.category}</span>
              <span className="text-[10px] font-black text-slate-900 px-2 py-1 bg-slate-100 rounded-md">#Darmax</span>
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
