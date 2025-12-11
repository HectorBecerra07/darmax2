import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import { DollarSign, ShoppingCart, Users, BadgePercent } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const StatCard = ({ icon, title, value, colorClass, prefix = '', suffix = '' }) => (
  <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 flex items-center gap-5 transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600">
    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        {prefix}{value}{suffix}
      </p>
    </div>
  </div>
);


const ReportesAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/orders`);
        if (!res.ok) {
          throw new Error("No se pudieron cargar los pedidos para los reportes.");
        }
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-slate-700 dark:text-slate-300">Cargando reportes...</p>
        </div>
    );
  }

  if (error) {
    return <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg">Error: {error}</div>;
  }
  
  const ventasValidas = pedidos.filter(p => ["PAGADO", "ENVIADO", "ENTREGADO"].includes(p.estado));
  
  const totalVentas = ventasValidas.reduce((acc, item) => acc + (item.total || 0), 0);
  const totalPedidosValidos = ventasValidas.length;
  const valorPromedioPedido = totalPedidosValidos > 0 ? totalVentas / totalPedidosValidos : 0;
  const clientesUnicos = new Set(ventasValidas.map(p => p.clienteEmail)).size;
  
  const ingresosMensuales = ventasValidas.reduce((acc, pedido) => {
    const fecha = new Date(pedido.createdAt);
    const mes = fecha.toLocaleString('es-MX', { month: 'short' });
    const anio = fecha.getFullYear();
    const clave = `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${anio}`;

    if (!acc[clave]) {
      acc[clave] = { mes: clave, ingresos: 0 };
    }
    acc[clave].ingresos += pedido.total || 0;
    return acc;
  }, {});
  
  const mesesOrden = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."];
  const reportes = Object.values(ingresosMensuales).sort((a, b) => {
    const [mesA, anioA] = a.mes.split(' ');
    const [mesB, anioB] = b.mes.split(' ');
    if (anioA !== anioB) return parseInt(anioA) - parseInt(anioB);
    return mesesOrden.indexOf(mesA.toLowerCase()) - mesesOrden.indexOf(mesB.toLowerCase());
  });

  const ventasPorCategoria = ventasValidas.reduce((acc, pedido) => {
    pedido.productos.forEach(item => {
      const categoria = item.producto?.categoria?.nombre || 'Sin Categoría';
      const precioTotalItem = (item.producto?.precio || 0) * item.cantidad;
      if (!acc[categoria]) {
        acc[categoria] = { name: categoria, value: 0 };
      }
      acc[categoria].value += precioTotalItem;
    });
    return acc;
  }, {});
  
  const dataCategorias = Object.values(ventasPorCategoria).sort((a, b) => b.value - a.value);
  const PIE_COLORS = isDark ? ['#2dd4bf', '#34d399', '#fbbf24', '#f87171', '#818cf8', '#a78bfa'] : ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];
  
  const formatCurrency = (value) => value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Reportes de Desempeño</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Análisis de ingresos, clientes y tendencias de ventas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Ingresos Totales" value={formatCurrency(totalVentas)} prefix="$" icon={<DollarSign className="w-6 h-6 text-white"/>} colorClass="bg-green-500" />
        <StatCard title="Pedidos Válidos" value={totalPedidosValidos} icon={<ShoppingCart className="w-6 h-6 text-white"/>} colorClass="bg-cyan-500" />
        <StatCard title="Clientes Únicos" value={clientesUnicos} icon={<Users className="w-6 h-6 text-white"/>} colorClass="bg-amber-500" />
        <StatCard title="Ticket Promedio" value={formatCurrency(valorPromedioPedido)} prefix="$" icon={<BadgePercent className="w-6 h-6 text-white"/>} colorClass="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50">
           <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-100">Tendencia de Ingresos Mensuales</h3>
           <div className="h-80">
            {reportes.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportes} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isDark ? "#2dd4bf" : "#06b6d4"} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={isDark ? "#2dd4bf" : "#06b6d4"} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "#e5e7eb"} />
                        <XAxis dataKey="mes" stroke={isDark ? "#64748b" : "#6b7280"} tick={{ fill: isDark ? "#94a3b8" : "#6b7280", fontSize: 12 }} />
                        <YAxis stroke={isDark ? "#64748b" : "#6b7280"} tick={{ fill: isDark ? "#94a3b8" : "#6b7280", fontSize: 12 }} tickFormatter={(value) => `$${(value/1000)}k`} />
                        <Tooltip
                            formatter={(value) => [`$${value.toLocaleString("es-MX")}`, "Ingresos"]}
                            cursor={{ stroke: isDark ? '#2dd4bf' : '#06b6d4', strokeWidth: 1, strokeDasharray: '3 3' }}
                            contentStyle={{ 
                                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(4px)',
                                border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                                borderRadius: '0.75rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                color: isDark ? '#cbd5e1' : '#333'
                            }}
                            labelStyle={{ color: isDark ? '#f1f5f9' : '#000', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke={isDark ? "#2dd4bf" : "#06b6d4"} strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">No hay datos de ingresos para mostrar.</div>
            )}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-100">Ventas por Categoría</h3>
            <div className="h-80">
            {dataCategorias.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataCategorias}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius="80%"
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {dataCategorias.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="focus:outline-none transition-opacity" style={{filter: `brightness(${isDark ? 1.1 : 0.95})`}}/>
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`$${value.toLocaleString('es-MX')}`, name]} cursor={{fill: 'transparent'}}/>
                        <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                 <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">No hay datos de categorías para mostrar.</div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesAdmin;
