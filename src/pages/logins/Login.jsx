import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";
import WelcomeScreen from "../../components/WelcomeScreen";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon, AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import "./Login.css"; 

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { user, login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      toast.dismiss(toastId);
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
      <Helmet>
        <title>Iniciar Sesión - Darmax</title>
        <meta name="description" content="Inicia sesión en tu cuenta de Darmax para acceder a tu perfil, historial de pedidos y más." />
      </Helmet>
      {showWelcome && <WelcomeScreen name={firstName} />}
      <div className="login-container">
        <div className="login-form-container">
          <div className="logo-container">
            <img
              src="/img/darmaxfoto.png"
              alt="Logo Darmax"
              className="logo"
            />
          </div>
          <h2 className="login-title">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <AtSymbolIcon className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group">
              <LockClosedIcon className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="options-container">
              <label className="remember-me">
                <input type="checkbox" disabled={isSubmitting} />
                Recordarme
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ingresando..." : "Login"}
            </button>
          </form>

          <div className="signup-link-container">
            <p>
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="signup-link">
                Regístrate ahora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;


