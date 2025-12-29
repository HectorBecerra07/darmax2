import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import { BanknotesIcon, ShoppingCartIcon, ReceiptPercentIcon, TrophyIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const KpiCard = ({ title, value, icon, subValue, isLoading }) => (
    <div className={`bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-5 ${isLoading ? 'animate-pulse' : ''}`}>
        <div className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 p-4 rounded-full">
            {icon ? React.cloneElement(icon, { className: "h-6 w-6" }) : <div className="h-6 w-6 bg-slate-200 rounded-full"></div>}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            {isLoading ? (
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-md mt-1"></div>
            ) : (
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            )}
            {subValue && !isLoading && <p className="text-xs text-slate-500 dark:text-slate-500">{subValue}</p>}
        </div>
    </div>
);


const ReportesAdmin = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const reportData = useMemo(() => {
        const validPedidos = pedidos.filter(p => ['PAGADO', 'ENVIADO', 'ENTREGADO'].includes(p.estado));
        
        const monthMap = new Map();
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('es-MX', { month: 'short' }).replace('.', '');
            const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
            monthMap.set(key, { 
                mes: monthName.charAt(0).toUpperCase() + monthName.slice(1), 
                ingresos: 0, 
                ventas: 0 
            });
        }
        
        validPedidos.forEach(pedido => {
            const date = new Date(pedido.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;

            if (monthMap.has(key)) {
                const current = monthMap.get(key);
                current.ingresos += pedido.total;
                current.ventas += 1;
            }
        });
        
        return Array.from(monthMap.values());
    }, [pedidos]);

    const { totalIngresos, totalVentas, ticketPromedio, mesMayorVenta } = useMemo(() => {
        if (loading || reportData.length === 0) {
            return { totalIngresos: 0, totalVentas: 0, ticketPromedio: 0, mesMayorVenta: { mes: '-', ingresos: 0 }};
        }
        const totalIngresos = reportData.reduce((acc, item) => acc + item.ingresos, 0);
        const totalVentas = reportData.reduce((acc, item) => acc + item.ventas, 0);
        const ticketPromedio = totalVentas > 0 ? totalIngresos / totalVentas : 0;
        const mesMayorVenta = reportData.reduce((max, current) => current.ingresos > max.ingresos ? current : max, reportData[0] || { mes: '-', ingresos: 0 });
        return { totalIngresos, totalVentas, ticketPromedio, mesMayorVenta };
    }, [reportData, loading]);

    const formatCurrency = (value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dashboard de Ventas</h2>
            <p className="text-md text-slate-500 dark:text-slate-400 mt-1">
            Resumen de métricas clave y tendencias de negocio.
            </p>
        </div>
         <button
          onClick={fetchPedidos}
          disabled={loading}
          className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

       {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded-lg">
            <strong>Error:</strong> {error}
        </div>
        )}

      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Ingresos Totales (12m)" value={formatCurrency(totalIngresos)} icon={<BanknotesIcon />} isLoading={loading} />
        <KpiCard title="Ventas Totales (12m)" value={totalVentas.toLocaleString()} icon={<ShoppingCartIcon />} isLoading={loading} />
        <KpiCard title="Ticket Promedio (12m)" value={formatCurrency(ticketPromedio)} icon={<ReceiptPercentIcon />} isLoading={loading} />
        <KpiCard title="Mejor Mes (12m)" value={mesMayorVenta.mes} subValue={formatCurrency(mesMayorVenta.ingresos)} icon={<TrophyIcon />} isLoading={loading} />
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 h-96 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-lg mb-4 text-slate-700 dark:text-slate-100">Rendimiento de Ingresos (Últimos 12 meses)</h3>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={reportData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e030" />
                    <XAxis dataKey="mes" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                        formatter={(value) => formatCurrency(value)} 
                        contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            backdropFilter: 'blur(5px)',
                            border: '1px solid #e0e0e0', 
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            color: '#333'
                        }}
                    />
                    <Area type="monotone" dataKey="ingresos" stroke="#0891b2" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 h-96 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-lg mb-4 text-slate-700 dark:text-slate-100">Volumen de Ventas</h3>
             <ResponsiveContainer width="100%" height="90%">
                <LineChart data={reportData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e030" />
                    <XAxis dataKey="mes" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip 
                         formatter={(value) => `${value} ventas`}
                         contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            backdropFilter: 'blur(5px)',
                            border: '1px solid #e0e0e0', 
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            color: '#333'
                        }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Line type="monotone" dataKey="ventas" name="Número de Ventas" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportesAdmin;
