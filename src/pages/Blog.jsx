import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  CalendarIcon, 
  UserIcon, 
  ChevronRightIcon,
  ArrowRightIcon 
} from "@heroicons/react/24/outline";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "";
        const response = await axios.get(`${API_URL}/api/blog`);
        // Solo mostrar los publicados
        setPosts(response.data.filter(p => p.published));
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    try {
        // Simulamos una petición o conectamos a un endpoint si existiera
        // Para este ejemplo usaremos un delay y feedback visual
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Swal.fire({
            title: '¡Suscripción Exitosa!',
            text: 'Pronto recibirás nuestras guías exclusivas en tu correo.',
            icon: 'success',
            confirmButtonColor: '#06b6d4',
            customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl font-black uppercase text-xs tracking-widest px-8 py-4'
            }
        });
        setEmail("");
    } catch (error) {
        Swal.fire('Error', 'No pudimos procesar tu suscripción.', 'error');
    } finally {
        setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <Helmet>
        <title>Blog para Emprendedores | Darmax Agua</title>
        <meta name="description" content="Aprende cómo iniciar tu negocio de agua purificada, consejos de mantenimiento, rentabilidad de máquinas vending y tecnología de ósmosis inversa." />
        <meta name="keywords" content="blog emprendimiento, negocio agua, vending productos limpieza, purificadoras de agua consejos" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Cabecera del Blog */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-4 bg-cyan-100 text-cyan-700 rounded-full text-xs font-black tracking-widest uppercase"
          >
            Conocimiento Darmax
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6"
          >
            Guías y Consejos para <br />
            <span className="text-[#168387]">Tu Próximo Negocio</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto font-medium"
          >
            Explora nuestros artículos expertos sobre purificación, vending y estrategias de emprendimiento rentable.
          </motion.p>
        </div>

        {/* Feed de Posts */}
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {[1, 2, 3].map(n => (
                    <div key={n} className="bg-white rounded-[2.5rem] h-[500px] animate-pulse border border-slate-100 shadow-sm" />
                ))}
            </div>
        ) : posts.length === 0 ? (
            <div className="py-20 text-center">
                <div className="text-5xl mb-4 text-slate-300">🏜️</div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Aún no hay publicaciones</h3>
                <p className="text-slate-500 mt-2">Estamos preparando contenido de valor para ti. ¡Vuelve pronto!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post, idx) => {
                const isReversedMobile = idx % 2 === 1; // Alternancia simple para móvil (fila)
                const isReversedDesktop = idx % 3 === 1; // El patrón de 3 para escritorio (columna)
                
                return (
                    <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/5 hover:shadow-cyan-900/10 transition-all duration-500 flex flex-col h-full"
                    >
                    {/* Contenedor Adaptativo: Horizontal en móvil, Vertical en Desktop */}
                    <div className={`flex h-full 
                        ${isReversedMobile ? 'flex-row-reverse' : 'flex-row'} 
                        md:flex-col 
                        ${isReversedDesktop ? 'lg:flex-col-reverse' : 'lg:flex-col'}`}
                    >
                        <Link to={`/blog/${post.slug}`} className="block relative w-2/5 md:w-full h-auto md:h-64 overflow-hidden shrink-0">
                            <img 
                            src={post.image || '/img/placeholder-blog.jpg'} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                {post.category}
                            </span>
                            </div>
                        </Link>
                        
                        <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-center md:justify-start">
                            <div className="flex items-center gap-2 sm:gap-4 text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-4">
                            <span className="flex items-center gap-1.5">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{new Date(post.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                <span className="inline sm:hidden">{new Date(post.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' })}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <UserIcon className="w-3.5 h-3.5" />
                                {post.author.split(' ')[0]}
                            </span>
                            </div>
                            
                            <h2 className="text-sm sm:text-lg md:text-xl font-black text-slate-900 leading-tight mb-2 sm:mb-4 group-hover:text-[#168387] transition-colors line-clamp-2">
                            <Link to={`/blog/${post.slug}`}>
                                {post.title}
                            </Link>
                            </h2>
                            
                            <p className="text-slate-500 text-[10px] sm:text-xs md:text-sm leading-relaxed mb-3 sm:mb-6 line-clamp-2 md:line-clamp-3 font-medium hidden xs:block">
                            {post.excerpt}
                            </p>
                            
                            <div className="mt-auto">
                                <Link 
                                to={`/blog/${post.slug}`}
                                className="inline-flex items-center gap-2 text-[8px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#168387] group/link"
                                >
                                Leer <span className="hidden sm:inline">Artículo</span>
                                <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    </motion.article>
                );
            })}
            </div>
        )}

        {/* Newsletter CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-24 p-10 sm:p-16 rounded-[3rem] bg-slate-900 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-4">¿Quieres recibir guías exclusivas?</h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Únete a nuestra comunidad de emprendedores y recibe consejos prácticos directamente en tu correo.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500 transition-colors font-medium"
              />
              <button 
                type="submit"
                disabled={subscribing}
                className={`px-8 py-4 bg-cyan-500 text-slate-900 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 ${subscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {subscribing ? 'Suscribiendo...' : 'Suscribirme'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
