import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = ({ name }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/perfil');
    }, 2500); // 2.5 segundos de espera

    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-[999]">
      <div className="text-center text-white animate-fadeInUp">
        <h1 className="text-4xl font-bold mb-4">¡Bienvenido, {name}!</h1>
        <p className="text-lg mb-8">Estamos preparando todo para ti.</p>
        {/* Spinner de carga */}
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white mx-auto"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
