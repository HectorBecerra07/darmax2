import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCarrito } from "../context/CarritoContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CarritoLateral = ({ isOpen, onClose }) => {
  const {
    carrito,
    eliminarProducto,
    vaciarCarrito,
    incrementarCantidad,
    disminuirCantidad,
    validateCart,
  } = useCarrito();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      validateCart();
      const itemsToRemove = carrito.filter((item) => (item.stock ?? 0) === 0);
      if (itemsToRemove.length > 0) {
        itemsToRemove.forEach((item) => eliminarProducto(item.id));
        toast.info("Algunos productos se quitaron por falta de stock.", {
          icon: "ℹ️",
        });
      }
    }
  }, [isOpen, carrito, validateCart, eliminarProducto]);

  const total = carrito.reduce(
    (acc, p) => acc + Number(p.precio || 0) * p.cantidad,
    0
  );

  const handleCheckout = () => {
    onClose();
    navigate("/carrito");
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Carrito de compras
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Cerrar panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {carrito.length === 0 ? (
                            <p className="text-center text-gray-500">
                              Tu carrito está vacío.
                            </p>
                          ) : (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {carrito.map((product) => (
                                <li key={product.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={product.imagen}
                                      alt={product.nombre}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{product.nombre}</h3>
                                        <p className="ml-4">
                                          $
                                          {(
                                            Number(product.precio || 0) *
                                            product.cantidad
                                          ).toLocaleString("es-MX", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        $
                                        {Number(product.precio || 0).toLocaleString(
                                          "es-MX",
                                          {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }
                                        )}{" "}
                                        c/u
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => disminuirCantidad(product.id)}
                                          className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100"
                                        >
                                          -
                                        </button>
                                        <span className="font-medium text-gray-700">{product.cantidad}</span>
                                        <button
                                          type="button"
                                          onClick={() => incrementarCantidad(product.id)}
                                          disabled={(product.cantidad ?? 0) >= (product.stock ?? 0)}
                                          className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          +
                                        </button>
                                      </div>
                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => eliminarProducto(product.id)}
                                          className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                          Quitar
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {carrito.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>
                            $
                            {total.toLocaleString("es-MX", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            MXN
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Gastos de envío e impuestos calculados en el checkout.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={handleCheckout}
                            disabled={total <= 0}
                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400"
                          >
                            Finalizar Compra
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            o{" "}
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={onClose}
                            >
                              Seguir comprando
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={vaciarCarrito}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CarritoLateral;
