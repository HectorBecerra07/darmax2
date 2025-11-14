import React from 'react';

const GoodbyeScreen = ({ name }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-[999]">
      <div className="text-center text-white animate-fadeInUp">
        <h1 className="text-4xl font-bold mb-4">¡Hasta luego, {name}!</h1>
        <p className="text-lg mb-8">Gracias por tu visita.</p>
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white mx-auto"></div>
      </div>
    </div>
  );
};

export default GoodbyeScreen;