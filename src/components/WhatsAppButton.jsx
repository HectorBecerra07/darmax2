import React, { useState } from 'react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "525519655369";
  const questions = [
    "Quiero Iniciar mi negocio.",
    "Quisiera saber más sobre sus productos.",
    "¿Cuáles son los métodos de pago aceptados?",
    "¿Realizan envíos a domicilio y cuál es el costo?",
    "Necesito ayuda con un pedido existente."
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-14 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-64">
          <p className="font-semibold text-gray-800 mb-2">¿Cómo podemos ayudarte?</p>
          <ul>
            {questions.map((question, index) => {
              const message = encodeURIComponent(question);
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
              return (
                <li key={index} className="my-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-700 hover:text-blue-600 block"
                  >
                    {question}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button
        onClick={toggleMenu}
        aria-label="Contactar por WhatsApp"
        className="w-16 h-16 transition-transform"
      >
        <img
          src="/img/iconos/whatsico.png"
          alt="WhatsApp"
          className="w-full h-full object-contain rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}
