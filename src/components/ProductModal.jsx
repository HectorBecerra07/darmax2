import React from "react";

const ProductModal = ({ show, onClose, producto, onAddToCart }) => {
  if (!show || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex items-center justify-center">
            <img
              src={producto.imagen || "https://via.placeholder.com/300x300"}
              alt={producto.nombre}
              className="rounded-lg object-contain max-h-80 max-w-full"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{producto.nombre}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{producto.descripcion}</p>
              <p className="text-xl font-semibold text-black">MXN ${Number(producto.precio).toFixed(2)}</p>
              {/* Stock Display */}
              <p className="text-sm text-gray-600">
                Stock: <span className={`${(producto.stock ?? 0) === 0 ? 'text-red-500' : ''}`}>{producto.stock ?? 0}</span> unidades
              </p>
            </div>

            <button
              onClick={() => {
                onAddToCart(producto);
                onClose();
              }}
              disabled={(producto.stock ?? 0) === 0} // Disable if stock is 0
              className={`text-black font-bold py-3 px-5 rounded-lg hover:brightness-90 transition ${
                (producto.stock ?? 0) === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed" // Disabled style
                  : "bg-[#24d4da]" // Enabled style
              }`}
            >
              {(producto.stock ?? 0) === 0 ? "Agotado" : "Añadir al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
