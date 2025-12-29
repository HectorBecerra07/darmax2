import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon, AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import "./Login.css";

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

      toast.success("¡Registro casi completo! Revisa tu correo (incluyendo la bandeja de spam) para verificar tu cuenta.", {
        id: toastId,
        duration: 6000, // Make it persistent
      });
      // Reset form fields
      setName("");
      setEmail("");
      setTelefono("");
      setPassword("");
      // Don't navigate away, let the user see the message.
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
      <div className="login-container">
        <div className="login-form-container">
          <div className="logo-container">
            <img
              src="/img/logo_darmaxnav.png"
              alt="Logo Darmax"
              className="logo"
            />
          </div>
          <h2 className="login-title">Crear cuenta</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <AtSymbolIcon className="input-icon" />
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group">
              <AtSymbolIcon className="input-icon" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group">
              <AtSymbolIcon className="input-icon" />
              <input
                type="tel"
                placeholder="Número de teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="input-field"
                disabled={isSubmitting}
              />
            </div>
            <div className="input-group">
              <LockClosedIcon className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
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
                <input type="checkbox" required disabled={isSubmitting} />
                Acepto&nbsp;
                <Link to="/terminos-y-condiciones" className="forgot-password-link" target="_blank">
                   Términos y condiciones
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <div className="signup-link-container">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="signup-link">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
