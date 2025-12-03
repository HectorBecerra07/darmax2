import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "./SidebarAdmin.css";

const SidebarAdmin = ({ collapsed, theme, setTheme }) => {
  const navigate = useNavigate();
  const nombreAdmin = localStorage.getItem("adminNombre") || "Administrador";

  const handleCerrarSesion = () => {
    localStorage.removeItem("adminNombre");
    navigate("/admin/login");
  };
  
  const isLight = theme === 'light';

  const getLinkClass = (isActive) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${
      isActive
        ? "bg-cyan-500 text-white"
        : isLight
        ? "text-slate-600 hover:bg-slate-100"
        : "text-gray-300 hover:bg-cyan-500/10"
    } ${collapsed ? "justify-center" : "justify-start"}`;

  return (
    <aside
      className={`sidebar-hud ${
        isLight ? "sidebar-light" : "sidebar-dark"
      } w-full h-full p-4 flex flex-col justify-between transition-all duration-300 overflow-y-auto`}
    >
      <div className="sidebar-hud-content space-y-6">
        <div className={`flex flex-col items-center gap-2 ${collapsed && "py-4"}`}>
          <img
            src="/img/darmax-logo.png"
            alt="Darmax"
            className="w-12 h-12 object-contain"
          />
          <div className={`${collapsed ? "hidden" : "block text-center"}`}>
            <h2 className="text-lg font-bold">Panel Admin</h2>
            <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Bienvenido, {nombreAdmin}
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { to: "/admin/dashboard/productos", icon: "📦", label: "Productos" },
            { to: "/admin/dashboard/categorias", icon: "🏷️", label: "Categorías" },
            { to: "/admin/dashboard/pedidos", icon: "🛍️", label: "Pedidos" },
            { to: "/admin/dashboard/envios", icon: "🚚", label: "Envíos" },
            { to: "/admin/dashboard/reportes", icon: "📊", label: "Reportes" },
            { to: "/admin/dashboard/clientes", icon: "👤", label: "Clientes" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => getLinkClass(isActive)}
              title={collapsed ? link.label : undefined}
            >
              <span>{link.icon}</span>
              <span className={`${collapsed ? "hidden" : "block"}`}>
                {link.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className={`${collapsed ? "hidden" : "block"}`}>
          <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`w-full mt-6 text-xs px-3 py-2 rounded transition ${
              isLight
                ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                : 'bg-gray-700 text-white hover:bg-cyan-500'
            }`}
          >
            {isLight ? "Modo Oscuro" : "Modo Claro"}
          </button>
        </div>
      </div>

      <div className="sidebar-hud-content space-y-3">
        <button
          onClick={handleCerrarSesion}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition w-full ${
            isLight
              ? 'text-red-500 hover:bg-red-50'
              : 'text-red-400 hover:bg-red-500/10'
          } ${collapsed ? "justify-center" : "justify-start"}`}
          title={collapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut className="w-4 h-4" />
          <span className={`${collapsed ? "hidden" : "block"}`}>
            Cerrar sesión
          </span>
        </button>
        <NavLink
          to="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition w-full ${
            isLight
              ? 'text-slate-500 hover:bg-slate-100'
              : 'text-gray-400 hover:bg-cyan-500/10'
          } ${collapsed ? "justify-center" : "justify-start"}`}
          title={collapsed ? "Ir a tienda" : undefined}
        >
          <span>🛒</span>
          <span className={`${collapsed ? "hidden" : "block"}`}>
            Ir a tienda
          </span>
        </NavLink>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
