import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("Ambos campos de contraseña son obligatorios.");
    }
    if (password !== confirmPassword) {
      return toast.error("Las contraseñas no coinciden.");
    }
    if (!token) {
      return toast.error("Token de recuperación no encontrado. Por favor, solicita un nuevo enlace.");
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Restableciendo contraseña...");

    try {
      const res = await fetch(`${API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo restablecer la contraseña.");
      }

      toast.success(data.message, { id: toastId });
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
        <title>Restablecer Contraseña - Darmax</title>
      </Helmet>
      <div className="login-container">
        <div className="login-form-container">
          <div className="logo-container">
            <img src="/img/darmaxfoto.png" alt="Logo Darmax" className="logo" />
          </div>
          <h2 className="login-title">Establecer Nueva Contraseña</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <LockClosedIcon className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
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
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="input-group">
              <LockClosedIcon className="input-icon" />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isSubmitting ? "Guardando..." : "Restablecer Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;