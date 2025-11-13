import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "./SidebarAdmin.css";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const nombreAdmin = localStorage.getItem("adminNombre") || "Administrador";
  const [modoClaro, setModoClaro] = useState(false);

  const handleCerrarSesion = () => {
    localStorage.removeItem("adminNombre");
    navigate("/admin/login");
  };

  const linkClass =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium hover:bg-cyan-500 hover:text-white";

  return (
    <aside
      className={`sidebar-hud ${
        modoClaro ? "sidebar-light" : "sidebar-dark"
      } w-64 md:h-screen text-gray-100 p-6 flex flex-col justify-between`}
    >
      <div className="sidebar-hud-content space-y-6">
        <div className="flex flex-col items-center gap-2">
          <img
            src="/img/darmax-logo.png"
            alt="Darmax"
            className="w-12 h-12 object-contain"
          />
          <h2 className="text-lg font-bold">Panel Admin</h2>
          <p className="text-sm text-gray-400">Bienvenido, {nombreAdmin}</p>
        </div>

        <nav className="space-y-2 md:mt-6">
          <NavLink
            to="/admin/dashboard/productos"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-cyan-500 text-white" : "text-gray-300"}`
            }
          >
            📦 Productos
          </NavLink>
          <NavLink
            to="/admin/dashboard/categorias"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-cyan-500 text-white" : "text-gray-300"}`
            }
          >
            🏷️ Categorías
          </NavLink>
          <NavLink
            to="/admin/dashboard/pedidos"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-cyan-500 text-white" : "text-gray-300"}`
            }
          >
            🛍️ Pedidos
          </NavLink>
          <NavLink
            to="/admin/dashboard/reportes"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-cyan-500 text-white" : "text-gray-300"}`
            }
          >
            📊 Reportes
          </NavLink>
          <NavLink
            to="/admin/dashboard/clientes"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? "bg-cyan-500 text-white" : "text-gray-300"}`
            }
          >
            👤 Clientes
          </NavLink>
        </nav>

        <button
          onClick={() => setModoClaro(!modoClaro)}
          className="w-full mt-6 bg-gray-700 text-xs text-white px-3 py-2 rounded hover:bg-cyan-500 transition"
        >
          {modoClaro ? "Modo Futurista" : "Modo Blanco & Negro"}
        </button>
      </div>

      <div className="sidebar-hud-content space-y-3">
        <button
          onClick={handleCerrarSesion}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:text-red-500 hover:bg-gray-800 transition w-full"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-cyan-500 hover:bg-gray-800 transition w-full"
        >
          Ir a tienda
        </NavLink>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
