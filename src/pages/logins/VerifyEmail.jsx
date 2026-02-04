import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("Verificando tu correo electrónico...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setVerificationStatus("error");
      setMessage("Token de verificación no encontrado.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "No se pudo verificar el correo.");
        }

        setVerificationStatus("success");
        setMessage(data.message);
        toast.success("¡Tu cuenta ha sido verificada!");
      } catch (error) {
        setVerificationStatus("error");
        setMessage(error.message);
        toast.error("Error al verificar la cuenta.");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Verificación de Correo - Darmax</title>
      </Helmet>
      <div className="login-container">
        <div className="login-form-container text-center">
          <div className="logo-container">
            <img src="/img/darmaxfoto.png" alt="Logo Darmax" className="logo" />
          </div>
          <h2 className="login-title">
            {verificationStatus === "verifying" && "Verificando..."}
            {verificationStatus === "success" && "¡Correo Verificado!"}
            {verificationStatus === "error" && "Error de Verificación"}
          </h2>
          <p className="mb-6">{message}</p>

          {verificationStatus === "verifying" && (
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#24d4da] rounded-full animate-spin mx-auto" />
          )}

          {(verificationStatus === "success" || verificationStatus === "error") && (
            <Link to="/login" className="submit-button inline-block">
              Ir a Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
