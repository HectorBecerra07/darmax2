import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AtSymbolIcon } from "@heroicons/react/24/solid";
import "./Login.css"; // Reusing the same CSS file

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Por favor, ingresa tu correo electrónico.");
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Enviando enlace...");

    try {
      const res = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo enviar el enlace.");
      }

      toast.success(data.message, { id: toastId, duration: 6000 });
      setEmail(""); // Clear input on success
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Recuperar Contraseña - Darmax</title>
        <meta name="description" content="Recupera el acceso a tu cuenta de Darmax." />
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
          <h2 className="login-title">Recuperar Contraseña</h2>
          <p className="login-subtitle">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>

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

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <div className="signup-link-container">
            <p>
              ¿Recordaste tu contraseña?{" "}
              <Link to="/login" className="signup-link">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
