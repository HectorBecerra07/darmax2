import React from "react";

// Reemplazar la importación de Prisma con una constante local
const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

export default function Step1SelectModel({ modelos, vendingType, onSelect, onNext }) {
  // Los modelos ya vienen filtrados por vendingType desde WizardGeneral.jsx
  // No necesitamos un filtro adicional aquí.
  const modelosParaMostrar = modelos; 

  const handleClick = (modelo) => {
    onSelect(modelo); // modelo es el objeto MachineModel completo
    onNext();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-gray-900 text-center">
        Elige tu modelo {vendingType === VendingTypeEnum.TOUCH ? "Touch" : "Tradicional"}
      </h2>

      <div className="space-y-4 max-w-3xl mx-auto">
        {modelosParaMostrar.map((item) => (
          <div
            key={item.slug} // Usar slug como key ya que es unique
            className="border rounded-xl p-6 hover:border-[#24d4da] hover:shadow-lg transition cursor-pointer"
            onClick={() => handleClick(item)}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                ${item.basePrice.toLocaleString()} MXN
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
