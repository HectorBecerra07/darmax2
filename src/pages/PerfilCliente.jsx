import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const currency = (n) =>
  Number(n || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  });

export default function PerfilCliente() {
  const { user, logout, login, token } = useUser();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  // Estado del formulario de dirección
  const [direccion, setDireccion] = useState({
    calle: "",
    colonia: "",
    codigoPostal: "",
    ciudad: "",
    estadoEnvio: "",
    pais: "México",
  });

  // Estado para la API de CP
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState("");
  const [coloniasOptions, setColoniasOptions] = useState([]);

  // Sincronizar el formulario con los datos del usuario cuando se cargan
  useEffect(() => {
    if (user) {
      setDireccion({
        calle: user.calle || "",
        colonia: user.colonia || "",
        codigoPostal: user.codigoPostal || "",
        ciudad: user.ciudad || "",
        estadoEnvio: user.estadoEnvio || "",
        pais: user.pais || "México",
      });
    }
  }, [user]);

  const syncPedidosUsuario = () => {
    if (!user?.email) return;

    const pedidosAdmin = JSON.parse(localStorage.getItem("pedidos")) || [];
    const delUsuario = pedidosAdmin.filter((p) => p.correo === user.email);

    const keyUsuario = `pedidos-${user.email}`;
    const pedidosUsuario = JSON.parse(localStorage.getItem(keyUsuario)) || [];

    const map = new Map();
    [...pedidosUsuario, ...delUsuario].forEach((p) => map.set(p.id, p));
    const result = Array.from(map.values()).sort((a, b) => b.id - a.id);

    localStorage.setItem(keyUsuario, JSON.stringify(result));
    setPedidos(result);
  };

  useEffect(() => {
    if (!user?.email) return;
    syncPedidosUsuario();

    const onStorage = (e) => {
      if (e.key === "pedidos") {
        syncPedidosUsuario();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const pedidosFiltrados = useMemo(() => {
    if (filtro === "Todos") return pedidos;
    return pedidos.filter((p) => (p.estadoPedido || "Pendiente") === filtro);
  }, [pedidos, filtro]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Lógica para buscar por Código Postal
  const buscarPorCP = async (cp) => {
    setCpError("");
    setColoniasOptions([]);
    if (cp.length !== 5) return;

    setCpLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/postalcode/${cp}`);
      const data = await res.json();

      if (!res.ok || data.error || !data.codigo_postal) {
        throw new Error(data.error || data.message || "No se encontraron datos para este código postal.");
      }

      const { codigo_postal } = data;
      const coloniasList = [...new Set(codigo_postal.colonias.map(c => c.colonia).filter(Boolean))];

      setColoniasOptions(coloniasList);
      setDireccion((prev) => ({
        ...prev,
        estadoEnvio: codigo_postal.estado,
        ciudad: codigo_postal.municipio,
        colonia: coloniasList.length > 0 ? coloniasList[0] : "",
      }));

    } catch (err) {
      setCpError(err.message);
    } finally {
      setCpLoading(false);
    }
  };

  // Manejador de cambios para el formulario de dirección
  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setDireccion((prev) => ({ ...prev, [name]: value }));

    if (name === "codigoPostal") {
      if (value.length === 5) {
        buscarPorCP(value);
      } else {
        setColoniasOptions([]);
        setCpError("");
      }
    }
  };

  // Guardar dirección
  const handleGuardarDireccion = async () => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(direccion),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la dirección');
      }

      const updatedUser = await response.json();
      login({ user: updatedUser, token }); // Actualizar el contexto con el usuario y el token existente
      alert("Dirección guardada correctamente ✅");

    } catch (error) {
      console.error("Error en handleGuardarDireccion:", error);
      alert("Hubo un error al guardar la dirección. Inténtalo de nuevo.");
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-6 text-center">
        <h2 className="text-2xl font-bold">Debes iniciar sesión</h2>
        <p className="text-gray-500 mt-2">Para ver tu perfil y pedidos.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:opacity-90 transition"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 space-y-10">
      <Helmet>
        <title>Mi Perfil - Darmax</title>
        <meta name="description" content="Administra tu perfil, dirección y revisa tu historial de pedidos en Darmax." />
      </Helmet>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">¡Hola, {user?.name}!</h2>
          <p className="text-gray-500">Correo: {user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={syncPedidosUsuario}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            title="Actualizar pedidos"
          >
            Actualizar
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:opacity-90 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Pedidos */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-2xl font-semibold">Tus pedidos</h3>
          <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden">
            {["Todos", "Pendiente", "Entregado"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-4 py-2 text-sm font-medium ${
                  filtro === f
                    ? "bg-[#ccff00] text-black"
                    : "bg-white hover:bg-gray-50"
                } ${f !== "Todos" ? "border-l border-gray-200" : ""}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {pedidosFiltrados.length === 0 ? (
          <p className="text-gray-500">No hay pedidos en esta vista.</p>
        ) : (
          <div className="divide-y">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido.id}
                className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
              >
                <div>
                  <p className="font-bold">
                    Pedido #{pedido.orden || "Sin número"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Productos: {(pedido.productos || []).join(", ")}
                  </p>
                </div>

                <div className="text-right md:text-left">
                  <p className="font-semibold">{currency(pedido.total)} MXN</p>
                  <p className="text-sm mt-1">
                    <span
                      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-bold ${
                        (pedido.estadoPedido || "Pendiente") === "Entregado"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          (pedido.estadoPedido || "Pendiente") === "Entregado"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }`}
                      />
                      {pedido.estadoPedido || "Pendiente"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Datos */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Tus datos</h3>
        
        {/* Formulario de dirección */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-4">Dirección de Envío</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="calle"
              type="text"
              placeholder="Calle y Número"
              value={direccion.calle}
              onChange={handleDireccionChange}
              className="px-4 py-2 border rounded-lg md:col-span-2"
            />
            <div>
              <input
                name="codigoPostal"
                type="text"
                placeholder="Código Postal"
                value={direccion.codigoPostal}
                onChange={handleDireccionChange}
                className="px-4 py-2 border rounded-lg w-full"
              />
              {cpLoading && <p className="text-xs text-gray-500 mt-1">Buscando...</p>}
              {cpError && <p className="text-xs text-red-500 mt-1">{cpError}</p>}
            </div>
            {coloniasOptions.length > 1 ? (
              <select
                name="colonia"
                value={direccion.colonia}
                onChange={handleDireccionChange}
                className="px-4 py-2 border rounded-lg w-full bg-white"
              >
                {coloniasOptions.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            ) : (
              <input
                name="colonia"
                type="text"
                placeholder="Colonia"
                value={direccion.colonia}
                onChange={handleDireccionChange}
                className="px-4 py-2 border rounded-lg"
              />
            )}
            <input
              name="ciudad"
              type="text"
              placeholder="Ciudad / Municipio"
              value={direccion.ciudad}
              onChange={handleDireccionChange}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              name="estadoEnvio"
              type="text"
              placeholder="Estado"
              value={direccion.estadoEnvio}
              onChange={handleDireccionChange}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              name="pais"
              type="text"
              placeholder="País"
              value={direccion.pais}
              onChange={handleDireccionChange}
              className="px-4 py-2 border rounded-lg bg-gray-100"
              readOnly 
            />
          </div>
          <button
            onClick={handleGuardarDireccion}
            className="mt-4 px-6 py-2 bg-[#ccff00] rounded-lg font-bold"
          >
            Guardar dirección
          </button>
        </div>
      </div>
    </div>
  );
}
