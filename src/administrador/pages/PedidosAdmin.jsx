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
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pedidos Recibidos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualiza y gestiona las órdenes de compra de tus clientes.
          </p>
        </div>
      </div>

      {/* --- Card Layout (Mobile) --- */}
      <div className="grid gap-6 md:hidden">
        {pedidosAMostrar.map((pedido) => (
          <div key={pedido.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{pedido.cliente}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">#{pedido.orden || "—"}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor[pedido.estadoPedido]}`}>
                {pedido.estadoPedido}
              </span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
              <p><span className="font-semibold dark:text-slate-200">Total:</span> ${pedido.total}</p>
              <p className="line-clamp-1"><span className="font-semibold dark:text-slate-200">Productos:</span> {pedido.productos.join(", ")}</p>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-600 pt-3">
              <button onClick={() => generarPDF(pedido)} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Descargar PDF</button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Table Layout (Desktop) --- */}
      <div ref={tableContainerRef} className="w-full overflow-auto hidden md:block">
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3"># Orden</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Contacto</th>
              <th className="px-6 py-3">Productos</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 text-right">PDF</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {pedidosAMostrar.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-100">#{pedido.orden || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{pedido.cliente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{pedido.correo}</td>
                <td className="px-6 py-4 whitespace-nowrap line-clamp-1 max-w-xs text-slate-600 dark:text-slate-300">{pedido.productos.join(", ")}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-600 dark:text-slate-300">${pedido.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor[pedido.estadoPedido]}`}>
                    {pedido.estadoPedido}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button onClick={() => generarPDF(pedido)} className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">Descargar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pedidosGuardados.length === 0 && (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 border-dashed border-2 border-slate-200 dark:border-slate-700 rounded-lg">
          No hay pedidos para mostrar.
        </div>
      )}

      {/* --- Pagination --- */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          {Array.from({ length: totalPaginas }, (_, index) => (
            <button
              key={index}
              onClick={() => setPaginaActual(index + 1)}
              className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                paginaActual === index + 1
                  ? "bg-cyan-500 text-white shadow"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosAdmin;
