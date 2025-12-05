import React from "react";
import { VendingType as VendingTypeEnum } from "@prisma/client"; // Importar el enum

export default function Step0SelectVendingType({ onSelect, availableVendingTypes, getVendingTypeImage }) {
  // Las opciones ahora vienen de `availableVendingTypes`
  // hardcodedStep0SelectVendingTypeOpciones:
  const displayNames = {
    [VendingTypeEnum.TOUCH]: "Vending Touch",
    [VendingTypeEnum.TRADICIONAL]: "Vending Tradicional",
  };
  const descriptions = {
    [VendingTypeEnum.TOUCH]: "Pantalla digital con sistema moderno.",
    [VendingTypeEnum.TRADICIONAL]: "Máquina básica de botones.",
  };

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-gray-900 text-center">Selecciona tu tipo de máquina Vending</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {availableVendingTypes.map((type) => (
          <div
            key={type}
            className="border rounded-xl p-6 hover:border-[#24d4da] hover:shadow-lg transition cursor-pointer text-center space-y-4"
            onClick={() => onSelect(type)}
          >
            <img src={getVendingTypeImage(type)} alt={displayNames[type]} className="h-52 object-contain mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">{displayNames[type]}</h3>
            <p className="text-gray-500">{descriptions[type]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
