import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

// Mapeo de estados de Skydropx a colores y etiquetas legibles
const statusConfig = {
  "created": { label: "Creado", className: "bg-blue-100 text-blue-700" },
  "in_progress": { label: "En Progreso", className: "bg-orange-100 text-orange-700" },
  "pickup_scheduled": { label: "Recolección Agendada", className: "bg-cyan-100 text-cyan-700" },
  "in_transit": { label: "En Tránsito", className: "bg-purple-100 text-purple-700" },
  "delivered": { label: "Entregado", className: "bg-green-100 text-green-700" },
  "cancelled": { label: "Cancelado", className: "bg-red-100 text-red-700" },
  "error": { label: "Error", className: "bg-red-200 text-red-800" },
  "default": { label: "Desconocido", className: "bg-gray-100 text-gray-700" },
};

const EnviosAdmin = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/shipping/shipments`);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || data.detail || "Error al cargar los envíos desde Skydropx.");
      }
      setShipments(data.shipments);
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Gestión de Envíos (Skydropx)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Historial y estado de todas las guías generadas.
          </p>
        </div>
        <button
          onClick={fetchShipments}
          disabled={loading}
          className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50"
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <div className="p-6 text-center text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="font-bold">Ocurrió un error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-auto">
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3"># Orden</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Paquetería</th>
              <th className="px-6 py-3">Tracking</th>
              <th className="px-6 py-3">Destino</th>
              <th className="px-6 py-3">Fecha Creación</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-10 text-slate-500">
                  Cargando envíos...
                </td>
              </tr>
            ) : shipments.map((shipment) => {
                const config = statusConfig[shipment.status] || statusConfig.default;
                return (
                  <tr key={shipment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">
                      {shipment.externalOrderId || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {shipment.provider}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {shipment.trackingNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {shipment.addressTo.name}
                      <br />
                      <span className="text-xs text-slate-400">{shipment.addressTo.city}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {formatDate(shipment.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      {shipment.labelUrl && (
                        <a href={shipment.labelUrl} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                          Ver Guía
                        </a>
                      )}
                      {shipment.trackingUrl && (
                        <a href={shipment.trackingUrl} target="_blank" rel="noreferrer" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                          Rastrear
                        </a>
                      )}
                    </td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>

      {!loading && shipments.length === 0 && (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 border-dashed border-2 border-slate-200 dark:border-slate-700 rounded-lg mt-4">
          No se encontraron envíos generados en Skydropx.
        </div>
      )}
    </div>
  );
};

export default EnviosAdmin;
