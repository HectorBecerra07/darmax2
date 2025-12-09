import React from "react";
import { useCarrito } from "../context/CarritoContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const SlideCart = ({ isOpen, onClose }) => {
  const {
    carrito,
    eliminarProducto,
    vaciarCarrito,
    incrementarCantidad,
    disminuirCantidad,
  } = useCarrito();

  const total = carrito.reduce((acc, p) => {
    const precio = Number(p?.precio || 0);
    const cantidad = Number(p?.cantidad || 0);
    return acc + precio * cantidad;
  }, 0);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6 flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tu Carrito</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {carrito.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío.</p>
          ) : (
            carrito.map((p) => {
              const nombre = p?.nombre || "Producto";
              const imagen = p?.imagen || "/img/placeholder-product.png";
              const cantidad = Number(p?.cantidad || 0);
              const precio = Number(p?.precio || 0);

              return (
                <div key={p.id} className="flex flex-col gap-2 border-b pb-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={imagen}
                      alt={nombre}
                      className="w-12 h-12 object-contain"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{nombre}</h4>
                      <p className="text-xs text-gray-500">
                        {cantidad} × ${precio.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => eliminarProducto(p.id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="flex items-center gap-2 ml-16">
                    <button
                      disabled={cantidad <= 1}
                      onClick={() => disminuirCantidad(p.id)}
                      className={`border px-2 py-1 rounded ${
                        cantidad <= 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      -
                    </button>
                    <span>{cantidad}</span>
                    <button
                      onClick={() => incrementarCantidad(p.id)}
                      className="border px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {carrito.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#24d4da] text-black font-bold py-2 rounded-lg hover:brightness-90">
              Finalizar pedido
            </button>
            <button
              onClick={vaciarCarrito}
              className="text-red-600 text-sm w-full text-center hover:underline"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default SlideCart;
