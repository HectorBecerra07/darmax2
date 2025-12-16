import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center px-4 py-12">
      <Helmet>
        <title>Página no encontrada (404) - Darmax</title>
        <meta name="description" content="La página que buscas no existe o ha sido movida." />
      </Helmet>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-8xl md:text-9xl font-extrabold text-[#ccff00] animate-bounce mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Página no encontrada
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-md">
          ¡Oops! Parece que te has perdido. La página que buscas no existe o ha
          sido movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[#ccff00] hover:bg-[#b6e600] transition duration-300 ease-in-out shadow-lg"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
