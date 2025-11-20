import React, { useEffect, useState } from "react";

const ClientesAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    setUsuarios(usuariosGuardados);
  }, []);

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Clientes Registrados</h2>

      {usuarios.length === 0 ? (
        <p className="text-gray-500">Aún no hay clientes registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Nombre</th>
                <th className="border p-3">Correo</th>
                <th className="border p-3">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-3">{usuario.nombre}</td>
                  <td className="border p-3">{usuario.email}</td>
                  <td className="border p-3">{usuario.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientesAdmin;
