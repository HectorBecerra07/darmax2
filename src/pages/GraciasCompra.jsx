// src/pages/GraciasCompra.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GraciasCompra = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Intentamos leer el pedido desde location.state
  const orderFromState = location.state?.order;

  // Si no viene por state (p.ej. recarga), lo tomamos de localStorage
  const order =
    orderFromState ||
    (() => {
      try {
        const raw = localStorage.getItem("ultimoPedido");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

  if (!order) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24 px-4">
        <h2 className="text-2xl font-bold mb-4">No hay información de la compra.</h2>
        <button
          onClick={() => navigate("/productos")}
          className="px-6 py-2 rounded-full bg-[#ccff00] font-semibold"
        >
          Ir a productos
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            ¡Gracias por tu compra, {order.cliente || "cliente"}! 🎉
          </h2>
          <p className="text-gray-600">
            Tu pedido <span className="font-semibold">#{order.orden}</span> ha sido
            registrado correctamente.
          </p>
          <p className="text-gray-600">
            Te enviamos un correo con los detalles a{" "}
            <span className="font-semibold">{order.correo}</span>.
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-gray-50">
          <h3 className="text-xl font-semibold mb-3">Resumen de tu compra</h3>
          <p>
            <span className="font-semibold">Total:</span> ${order.total} MXN
          </p>
          <p>
            <span className="font-semibold">Teléfono:</span> {order.telefono || "N/A"}
          </p>
          <p className="mt-2 font-semibold">Envío a:</p>
          <p className="text-gray-700">
            {order.direccion}
            <br />
            {order.colonia}
            <br />
            {order.ciudad}, {order.estadoDireccion}
            <br />
            CP {order.codigoPostal}
          </p>
        </div>

        <div className="border rounded-xl p-4 bg-gray-50">
          <h3 className="text-xl font-semibold mb-3">Productos</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {order.productos?.map((nombre, idx) => (
              <li key={idx}>{nombre}</li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={() => navigate("/perfil")}
            className="px-6 py-2 rounded-full bg-[#ccff00] font-semibold"
          >
            Ver mis pedidos
          </button>
          <button
            onClick={() => navigate("/productos")}
            className="px-6 py-2 rounded-full border border-gray-300 font-semibold"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </section>
  );
};

export default GraciasCompra;
