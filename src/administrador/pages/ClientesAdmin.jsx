import React, { useEffect, useState } from "react";

const ClientesAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // En una aplicación real, esto sería un fetch a la API
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(usuariosGuardados);
  }, []);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Clientes Registrados</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Lista de usuarios que han creado una cuenta en la tienda.
          </p>
        </div>
      </div>

      {/* --- Search --- */}
      <div className="mb-6">
        <label htmlFor="search" className="sr-only">
          Buscar cliente
        </label>
        <input
          type="text"
          id="search"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* --- Card Layout (Mobile) --- */}
      <div className="grid gap-6 md:hidden">
        {usuariosFiltrados.map((usuario, index) => (
          <div key={index} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{usuario.nombre}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{usuario.email}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{usuario.telefono || "Sin teléfono"}</p>
          </div>
        ))}
      </div>

      {/* --- Table Layout (Desktop) --- */}
      <div className="w-full overflow-auto hidden md:block">
        <table className="w-full min-w-[600px] text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Teléfono</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {usuariosFiltrados.map((usuario, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-100">{usuario.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{usuario.telefono || "Sin teléfono"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuariosFiltrados.length === 0 && (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 border-dashed border-2 border-slate-200 dark:border-slate-700 rounded-lg">
          {searchTerm 
            ? "No se encontraron clientes que coincidan con la búsqueda."
            : "Aún no hay clientes registrados."
          }
        </div>
      )}
    </div>
  );
};

export default ClientesAdmin;
