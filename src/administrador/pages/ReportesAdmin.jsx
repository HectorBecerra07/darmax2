import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const reportesSimulados = [
  { mes: "Enero", ingresos: 15000 },
  { mes: "Febrero", ingresos: 22000 },
  { mes: "Marzo", ingresos: 18000 },
  { mes: "Abril", ingresos: 25000 },
  { mes: "Mayo", ingresos: 20000 },
];

const ReportesAdmin = () => {
  const totalVentas = reportesSimulados.reduce((acc, item) => acc + item.ingresos, 0);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reportes de Ventas</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Análisis de ingresos y tendencias mensuales.
          </p>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-700/50 p-6 rounded-xl shadow-inner mb-10 border border-slate-200 dark:border-slate-700">
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">Total Ingresos Acumulados:</p>
        <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">${totalVentas.toLocaleString()} MXN</p>
      </div>

      <div className="h-72 bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-lg mb-4 text-slate-700 dark:text-slate-100">Ingresos por Mes</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reportesSimulados} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* Default light stroke */}
            <XAxis dataKey="mes" stroke="#888888" tick={{ fill: "#888888" }} />
            <YAxis stroke="#888888" tick={{ fill: "#888888" }} />
            <Tooltip 
              formatter={(value) => `$${value}`} 
              wrapperStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }} // Default light mode tooltip
              itemStyle={{ color: '#333' }}
              labelStyle={{ color: '#333' }}
            />
            <Bar dataKey="ingresos" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportesAdmin;
