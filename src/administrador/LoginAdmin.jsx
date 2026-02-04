import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { LogIn } from "lucide-react";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        throw new Error("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }

      const data = await res.json();

      localStorage.setItem("adminNombre", data.name);
      toast.success(`¡Bienvenido, ${data.name}!`);

      // Navigate after a short delay to allow toast to be seen
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error conectando con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/img/fondo-login.jpg')" }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/20 space-y-6 text-white"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <img
              src="/img/darmaxfoto.png"
              alt="Darmax Logo"
              className="w-20 h-20 mx-auto object-contain"
            />
            <h2 className="text-3xl font-bold tracking-tight">
              Panel de Control
            </h2>
            <p className="text-sm text-gray-300">
              Acceso exclusivo para administradores
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@darmax.mx"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password-input"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••••"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all text-white font-bold py-3 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Ingresar</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
