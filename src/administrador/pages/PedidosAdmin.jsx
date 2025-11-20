import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const estadoColor = {
  Pagado: "bg-green-100 text-green-700",
  Pendiente: "bg-yellow-100 text-yellow-700",
  Entregado: "bg-blue-100 text-blue-700",
};

const PedidosAdmin = () => {
  const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];

  const tableContainerRef = useRef(null);
  const [pedidosPorPagina, setPedidosPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    const calcularFilasPorPantalla = () => {
      if (!tableContainerRef.current) return;
      const alturaContenedor = tableContainerRef.current.clientHeight;
      const alturaFila = 50; // Aproximado, ajusta si tus filas son más grandes/pequeñas
      const filasDisponibles = Math.floor(alturaContenedor / alturaFila);
      setPedidosPorPagina(filasDisponibles || 5);
    };

    calcularFilasPorPantalla();
    window.addEventListener("resize", calcularFilasPorPantalla);
    return () => window.removeEventListener("resize", calcularFilasPorPantalla);
  }, []);

  const indiceUltimoPedido = paginaActual * pedidosPorPagina;
  const indicePrimerPedido = indiceUltimoPedido - pedidosPorPagina;
  const pedidosAMostrar = pedidosGuardados.slice(indicePrimerPedido, indiceUltimoPedido);
  const totalPaginas = Math.ceil(pedidosGuardados.length / pedidosPorPagina);

  const generarPDF = (pedido) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Orden de Compra #${pedido.orden || "N/A"}`, 14, 20);
    doc.text("Detalle del Pedido", 14, 30);

    const direccionCompleta = `${pedido.direccion}, ${pedido.ciudad}, ${pedido.estadoDireccion}, CP: ${pedido.codigoPostal}`;

    autoTable(doc, {
      head: [["Campo", "Valor"]],
      body: [
        ["Número de Orden", `#${pedido.orden || "No asignado"}`],
        ["Cliente", pedido.cliente],
        ["Correo", pedido.correo],
        ["Teléfono", pedido.telefono],
        ["Dirección", direccionCompleta],
        ["Productos", pedido.productos.join(", ")],
        ["Total", `$${pedido.total} MXN`],
        ["Estado", pedido.estadoPedido],
      ],
      startY: 40,
    });

    doc.save(`Orden-${pedido.orden || "SinNumero"}-${pedido.cliente.replace(/ /g, "_")}.pdf`);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Pedidos Recibidos</h2>

      <div ref={tableContainerRef} className="overflow-auto" style={{ maxHeight: "60vh" }}>
        <table className="w-full border text-sm rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3"># Orden</th>
              <th className="border p-3">Cliente</th>
              <th className="border p-3">Correo</th>
              <th className="border p-3">Teléfono</th>
              <th className="border p-3">Dirección</th>
              <th className="border p-3">Productos</th>
              <th className="border p-3">Total</th>
              <th className="border p-3">Estado</th>
              <th className="border p-3">PDF</th>
            </tr>
          </thead>
          <tbody>
            {pedidosAMostrar.map((pedido) => {
              const direccionCompleta = `${pedido.direccion}, ${pedido.ciudad}, ${pedido.estadoDireccion}, CP: ${pedido.codigoPostal}`;

              return (
                <tr key={pedido.id} className="text-center">
                  <td className="border p-3">#{pedido.orden || "—"}</td>
                  <td className="border p-3">{pedido.cliente}</td>
                  <td className="border p-3">{pedido.correo}</td>
                  <td className="border p-3">{pedido.telefono}</td>
                  <td className="border p-3">{direccionCompleta}</td>
                  <td className="border p-3">{pedido.productos.join(", ")}</td>
                  <td className="border p-3">${pedido.total}</td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor[pedido.estadoPedido]}`}>
                      {pedido.estadoPedido}
                    </span>
                  </td>
                  <td className="border p-3">
                    <button
                      onClick={() => generarPDF(pedido)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center space-x-2 my-6">
        {[...Array(totalPaginas)].map((_, index) => (
          <button
            key={index}
            onClick={() => setPaginaActual(index + 1)}
            className={`px-3 py-1 rounded ${
              paginaActual === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PedidosAdmin;
