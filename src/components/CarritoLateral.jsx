import React from "react";
import { useCarrito } from "../context/CarritoContext";
import { useNavigate } from "react-router-dom";
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const CarritoLateral = ({ isOpen, onClose }) => {
  const {
    carrito,
    eliminarProducto,
    vaciarCarrito,
    incrementarCantidad,
    disminuirCantidad,
  } = useCarrito();
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acc, p) => acc + Number(p.precio || 0) * p.cantidad,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 w-full sm:w-96 h-full bg-gray-900/95 backdrop-blur-lg shadow-2xl z-50 flex flex-col border-l border-gray-700">
      <div className="flex items-center justify-between p-5 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingCartIcon className="w-6 h-6 text-cyan-400" />
          Tu Carrito
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar carrito"
          className="text-gray-400 hover:text-white"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>
      </div>

      {carrito.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Tu carrito está vacío.</p>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto p-5 divide-y divide-gray-800">
            {carrito.map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-4">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-16 h-16 object-cover rounded-md border border-gray-700"
                />
                <div className="flex-1">
                  <p className="font-semibold text-white">{p.nombre}</p>
                  <p className="text-sm text-cyan-400">
                    ${Number(p.precio || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <button
                    type="button"
                    onClick={() => eliminarProducto(p.id)}
                    className="text-red-500 text-xs hover:underline mt-1"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => disminuirCantidad(p.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span className="font-medium text-white">{p.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => incrementarCantidad(p.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-5 border-t border-gray-700 space-y-4">
            <p className="flex justify-between font-bold text-white text-lg">
              <span>Total:</span>
              <span className="text-cyan-400">${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN</span>
            </p>

            <button
              type="button"
              onClick={() => {
                navigate("/carrito");
                onClose();
              }}
              disabled={total <= 0}
              className="w-full py-3 rounded-lg font-semibold text-white transition bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500"
            >
              Finalizar pedido
            </button>

            <button
              type="button"
              onClick={vaciarCarrito}
              className="w-full text-red-500 text-sm hover:underline"
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarritoLateral;

