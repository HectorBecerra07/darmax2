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
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Reportes de Ventas</h2>

      <div className="bg-gray-100 p-6 rounded-xl shadow-inner mb-10">
        <p className="text-xl font-bold">Total Ingresos Acumulados:</p>
        <p className="text-3xl font-extrabold text-cyan-600">${totalVentas.toLocaleString()} MXN</p>
      </div>

      <div className="h-72 bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-lg mb-4 text-gray-700">Ingresos por Mes</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reportesSimulados} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Bar dataKey="ingresos" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportesAdmin;
