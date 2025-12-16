import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importar iconos de ojo

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Nombre, email y contraseña son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creando cuenta...");

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, telefono }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo completar el registro.");
      }

      toast.success("¡Registro exitoso! Ahora puedes iniciar sesión.", { id: toastId });
      navigate("/login");

    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Crear Cuenta - Darmax</title>
        <meta name="description" content="Regístrate en Darmax para crear tu cuenta y empezar a comprar nuestros productos y soluciones de negocio." />
      </Helmet>
      <div
        className="min-h-screen bg-cover bg-[center_top] md:bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('/img/repartidor-apuntando-la-botella-de-agua-en-el-hombro.jpg')",
        }}
      >
        <div className="backdrop-blur-md bg-white/40 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 sm:mx-auto transition-all duration-300">
          <div className="text-center py-4 border-b border-white/40 mb-4">
            <h5 className="text-2xl font-semibold text-black">Regístrate con</h5>
          </div>

          <div className="relative text-center mb-6">
            <img
              src="/img/darmax-logo.png"
              alt="Logo Darmax"
              className="h-20 mx-auto"
            />
            <div className="absolute inset-x-0 top-1/2 border-t border-black/30 -z-10" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-white/40 rounded-lg text-sm text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#24d4da]"
              disabled={isSubmitting}
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-white/40 rounded-lg text-sm text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#24d4da]"
              disabled={isSubmitting}
            />
            <input
              type="tel"
              placeholder="Número de teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-white/40 rounded-lg text-sm text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#24d4da]"
              disabled={isSubmitting}
            />
            <div className="relative"> {/* Contenedor para input y botón */}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-white/40 rounded-lg text-sm text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#24d4da] pr-10" // Añadir pr-10 para el espacio del botón
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <label className="flex items-center text-sm text-black mt-2">
              <input type="checkbox" className="mr-2 accent-black" required disabled={isSubmitting} />
              Acepto los{" "}
              <a href="#" className="font-bold underline ml-1 text-black">
                Términos y condiciones
              </a>
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <p className="text-sm text-center mt-6 text-black">
              ¿Ya tienes una cuenta?
              <Link to="/login" className="font-bold underline ml-1 text-black">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
