import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";
import WelcomeScreen from "../../components/WelcomeScreen";
import Swal from "sweetalert2"; // Importar SweetAlert2

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { user, login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Email y contraseña son obligatorios.");
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Iniciando sesión...");

    try {
      const res = await fetch(`/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo iniciar sesión.");
      }

      login(data);
      
      toast.dismiss(toastId);
      setShowWelcome(true);

    } catch (error) {
      toast.dismiss(toastId); // Ocultar el toast de "cargando" primero
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error.message,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstName = (user?.name || "").split(" ")[0];

  return (
    <>
      {showWelcome && <WelcomeScreen name={firstName} />}
      <div
        className="min-h-screen bg-cover bg-[center_top] md:bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/img/fondo-login.jpg')",
        }}
      >
        <div className="backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 sm:mx-auto transition-all duration-300">
          <h2 className="text-xl font-semibold text-center text-black mb-4 drop-shadow">
            Iniciar sesión
          </h2>

          <div className="relative text-center mb-6">
            <img
              src="/img/darmax-logo.png"
              alt="Logo Darmax"
              className="h-20 mx-auto animate-fade-in drop-shadow"
              style={{ animationDuration: "1s" }}
            />
            <div className="absolute inset-x-0 top-1/2 border-t border-white/30 -z-10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/60 border border-white/40 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#24d4da]"
              required
              disabled={isSubmitting}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white/60 border border-white/40 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#24d4da]"
              required
              disabled={isSubmitting}
            />

            <label className="flex items-center gap-2 text-sm text-black">
              <input type="checkbox" className="accent-white" disabled={isSubmitting} />
              Recordarme
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gray-900 to-slate-800 text-white text-sm font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ingresando..." : "Login"}
            </button>
          </form>

          <div className="text-sm text-center mt-6 text-black">
            <p>
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="font-bold underline">
                Regístrate ahora
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/forgot-password" className="underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
