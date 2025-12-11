import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const estadosPosibles = [
  "PENDIENTE",
  "PAGADO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

// Colores para el ENUM de la BD
const estadoConfig = {
  PENDIENTE: { label: "Pendiente", className: "bg-yellow-100 text-yellow-700" },
  PAGADO: { label: "Pagado", className: "bg-green-100 text-green-700" },
  ENVIADO: { label: "Enviado", className: "bg-blue-100 text-blue-700" },
  ENTREGADO: { label: "Entregado", className: "bg-indigo-100 text-indigo-700" },
  CANCELADO: { label: "Cancelado", className: "bg-red-100 text-red-700" },
};

const PedidosAdmin = () => {
  const tableContainerRef = useRef(null);

  const [pedidos, setPedidos] = useState([]);
  const [pedidosPorPagina, setPedidosPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actualizandoId, setActualizandoId] = useState(null);
  const [creandoGuiaId, setCreandoGuiaId] = useState(null);

  // 👉 Cargar pedidos desde el backend
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al cargar pedidos");

      setPedidos(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // 👉 Calcular cuántas filas caben en la pantalla
  useEffect(() => {
    const calcularFilasPorPantalla = () => {
      if (!tableContainerRef.current) return;
      const alturaContenedor = tableContainerRef.current.clientHeight || 400;
      const alturaFila = 50; // Aproximado
      const filasDisponibles = Math.floor(alturaContenedor / alturaFila);
      setPedidosPorPagina(filasDisponibles || 5);
    };

    calcularFilasPorPantalla();
    window.addEventListener("resize", calcularFilasPorPantalla);
    return () =>
      window.removeEventListener("resize", calcularFilasPorPantalla);
  }, []);

  // 👉 Paginación
  const indiceUltimoPedido = paginaActual * pedidosPorPagina;
  const indicePrimerPedido = indiceUltimoPedido - pedidosPorPagina;
  const pedidosAMostrar = pedidos.slice(
    indicePrimerPedido,
    indiceUltimoPedido
  );
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina || 1);

  // 👉 Cambiar estado de un pedido
  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    try {
      setActualizandoId(pedidoId);
      const res = await fetch(`${API_URL}/api/orders/${pedidoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar estado");
      }

      // actualizar lista local sin volver a pedir todo
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al actualizar estado");
    } finally {
      setActualizandoId(null);
    }
  };

// 👉 Crear guía / envío en Skydropx
const crearGuia = async (pedidoId) => {
  try {
    setCreandoGuiaId(pedidoId);
    const res = await fetch(`${API_URL}/api/shipping/create-label`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedidoId }),
    });

    let data;
    try {
      data = await res.json();
    } catch (_) {
      data = null;
    }

    if (!res.ok) {
      console.error("Error create-label:", data || "(sin cuerpo JSON)");
      
      // --- Lógica de Alerta Mejorada (Reactivada para depuración) ---
      let errorMessage = data?.error || "Error desconocido al crear la guía.";
      if (data?.detail) {
        errorMessage += `\n\nDetalles:\n${JSON.stringify(data.detail, null, 2)}`;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
      alert(errorMessage);
      setCreandoGuiaId(null);
      return; 
    }

    const envioActualizado = data.envio;

    // Actualizamos solo ese pedido en el estado
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId ? { ...p, envio: envioActualizado } : p
      )
    );
    toast.success("¡Guía generada exitosamente!");
  } catch (err) {
    // Este catch es para errores de red o si el fetch mismo falla.
    console.error("Error de red o fetch:", err);
    alert(`Ocurrió un error de conexión: ${err.message}`);
  } finally {
    setCreandoGuiaId(null);
  }
};


  // 👉 Generar PDF usando datos de la BD
  const generarPDF = (pedido) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Orden de Compra #${pedido.orden || "N/A"}`, 14, 20);
    doc.text("Detalle del Pedido", 14, 30);

    const direccionCompleta = `${pedido.direccion || ""}, ${
      pedido.ciudad || ""
    }, ${pedido.estadoEnvio || ""}, CP: ${pedido.codigoPostal || ""}`;

    const productosTexto =
      pedido.productos?.map(
        (pp) => `${pp.producto?.nombre || "Producto"} x ${pp.cantidad}`
      ) || [];

    const estado = estadoConfig[pedido.estado] || {
      label: pedido.estado,
      className: "",
    };

    autoTable(doc, {
      head: [["Campo", "Valor"]],
      body: [
        ["Número de Orden", `#${pedido.orden || "No asignado"}`],
        ["Cliente", pedido.clienteNombre || ""],
        ["Correo", pedido.clienteEmail || ""],
        ["Teléfono", pedido.clienteTelefono || ""],
        ["Dirección", direccionCompleta],
        ["Productos", productosTexto.join(", ")],
        [
          "Envío",
          pedido.envio
            ? `$${Number(pedido.envio.costoEnvio || 0).toFixed(2)} MXN`
            : "N/D",
        ],
        ["Total", `$${Number(pedido.total || 0).toFixed(2)} MXN`],
        ["Estado", estado.label],
      ],
      startY: 40,
    });

    doc.save(
      `Orden-${pedido.orden || "SinNumero"}-${
        (pedido.clienteNombre || "").replace(/ /g, "_") || "Cliente"
      }.pdf`
    );
  };

  if (loading) {
    return <p className="p-6">Cargando pedidos...</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error: {error}
        <button
          onClick={fetchPedidos}
          className="ml-4 px-3 py-1 text-sm bg-slate-200 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Pedidos Recibidos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualiza y gestiona las órdenes de compra de tus clientes.
          </p>
        </div>
        <button
          onClick={fetchPedidos}
          className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
        >
          Actualizar
        </button>
      </div>

      {/* --- Card Layout (Mobile) --- */}
      <div className="grid gap-6 md:hidden">
        {pedidosAMostrar.map((pedido) => {
          const estado = estadoConfig[pedido.estado] || {
            label: pedido.estado,
            className: "",
          };
          const productosTexto =
            pedido.productos?.map(
              (pp) => `${pp.producto?.nombre || "Producto"} x ${pp.cantidad}`
            ) || [];
          const envio = pedido.envio;

          return (
            <div
              key={pedido.id}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">
                    {pedido.clienteNombre}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    #{pedido.orden || "—"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${estado.className}`}
                  >
                    {estado.label}
                  </span>
                  <select
                    className="mt-1 text-xs border rounded px-2 py-1 bg-white dark:bg-slate-800"
                    value={pedido.estado}
                    disabled={actualizandoId === pedido.id}
                    onChange={(e) =>
                      actualizarEstado(pedido.id, e.target.value)
                    }
                  >
                    {estadosPosibles.map((est) => (
                      <option key={est} value={est}>
                        {estadoConfig[est]?.label || est}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <p>
                  <span className="font-semibold dark:text-slate-200">
                    Total:
                  </span>{" "}
                  ${Number(pedido.total || 0).toFixed(2)}
                </p>
                <p className="line-clamp-2">
                  <span className="font-semibold dark:text-slate-200">
                    Productos:
                  </span>{" "}
                  {productosTexto.join(", ")}
                </p>
              </div>

              {/* Info de envío / guía */}
              <div className="border-t border-slate-200 dark:border-slate-600 pt-2 text-sm space-y-1">
                {envio ? (
                  envio.etiquetaUrl ? (
                    <>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        Envío generado
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={envio.etiquetaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline"
                        >
                          Ver guía (PDF)
                        </a>
                        {envio.trackingUrl && (
                          <a
                            href={envio.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-600 dark:text-cyan-400 underline"
                          >
                            Rastrear
                          </a>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        Generando guía...
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        La guía se está procesando. Actualiza en unos momentos.
                      </p>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => crearGuia(pedido.id)}
                    disabled={creandoGuiaId === pedido.id}
                    className="mt-1 inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {creandoGuiaId === pedido.id
                      ? "Creando guía..."
                      : "Crear envío en Skydropx"}
                  </button>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-600 pt-3">
                <button
                  onClick={() => generarPDF(pedido)}
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Table Layout (Desktop) --- */}
      <div
        ref={tableContainerRef}
        className="w-full overflow-auto hidden md:block"
        style={{ maxHeight: "500px" }}
      >
        <table className="w-full min-w-[1100px] text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3"># Orden</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Productos</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Envío</th>
              <th className="px-6 py-3 text-right">PDF</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {pedidosAMostrar.map((pedido) => {
              const estado = estadoConfig[pedido.estado] || {
                label: pedido.estado,
                className: "",
              };
              const productosTexto =
                pedido.productos?.map(
                  (pp) =>
                    `${pp.producto?.nombre || "Producto"} x ${pp.cantidad}`
                ) || [];
              const envio = pedido.envio;

              return (
                <tr
                  key={pedido.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-100">
                    #{pedido.orden || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {pedido.clienteNombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {pedido.clienteEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap line-clamp-1 max-w-xs text-slate-600 dark:text-slate-300">
                    {productosTexto.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-600 dark:text-slate-300">
                    ${Number(pedido.total || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${estado.className}`}
                      >
                        {estado.label}
                      </span>
                      <select
                        className="text-xs border rounded px-2 py-1 bg-white dark:bg-slate-800"
                        value={pedido.estado}
                        disabled={actualizandoId === pedido.id}
                        onChange={(e) =>
                          actualizarEstado(pedido.id, e.target.value)
                        }
                      >
                        {estadosPosibles.map((est) => (
                          <option key={est} value={est}>
                            {estadoConfig[est]?.label || est}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {envio ? (
                      envio.etiquetaUrl ? (
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Guía generada
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={envio.etiquetaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline"
                            >
                              Ver PDF
                            </a>
                            {envio.trackingUrl && (
                              <a
                                href={envio.trackingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-600 dark:text-cyan-400 underline"
                              >
                                Rastrear
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs">
                          <p className="font-semibold text-slate-700 dark:text-slate-200">
                            Generando guía...
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                            Procesando...
                          </p>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => crearGuia(pedido.id)}
                        disabled={creandoGuiaId === pedido.id}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {creandoGuiaId === pedido.id
                          ? "Creando guía..."
                          : "Crear envío"}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => generarPDF(pedido)}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pedidos.length === 0 && (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 border-dashed border-2 border-slate-200 dark:border-slate-700 rounded-lg mt-6">
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
