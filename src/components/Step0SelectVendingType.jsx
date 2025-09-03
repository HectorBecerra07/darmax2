import React from "react";

export default function Step0SelectVendingType({ onSelect }) {
  const opciones = [
    {
      id: "Touch",
      nombre: "Vending Touch",
      descripcion: "Pantalla digital con sistema moderno.",
      imagen: "/img/vending/TOUCHAGUA.png", 
    },
    {
      id: "Tradicional",
      nombre: "Vending Tradicional",
      descripcion: "Máquina básica de botones.",
      imagen: "/img/vending/ATLANTIS300MAX.png", 
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-gray-900 text-center">Selecciona tu tipo de máquina Vending</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {opciones.map((opcion) => (
          <div
            key={opcion.id}
            className="border rounded-xl p-6 hover:border-[#24d4da] hover:shadow-lg transition cursor-pointer text-center space-y-4"
            onClick={() => onSelect(opcion.id)}
          >
            <img src={opcion.imagen} alt={opcion.nombre} className="h-52 object-contain mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">{opcion.nombre}</h3>
            <p className="text-gray-500">{opcion.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
