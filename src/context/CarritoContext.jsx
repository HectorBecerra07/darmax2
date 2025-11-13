import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useUser } from "./UserContext"; // Importar el contexto de usuario real

const CarritoContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated } = useUser(); // Usar el contexto real

  const fetchCarrito = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCarrito([]); // Si no está autenticado, el carrito está vacío
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/carrito`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo cargar el carrito.");
      const data = await res.json();
      const carritoAplanado = data.map(item => ({
        ...item.producto,
        cantidad: item.cantidad,
        id: item.producto.id 
      }));
      setCarrito(carritoAplanado);
    } catch (error) {
      toast.error(error.message);
      setCarrito([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchCarrito();
  }, [fetchCarrito]);

  const agregarProducto = async (producto, cantidad = 1) => {
    if (!isAuthenticated) return toast.error("Necesitas iniciar sesión para agregar productos.");
    
    const toastId = toast.loading("Agregando al carrito...");
    try {
      const res = await fetch(`${API_URL}/api/carrito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId: producto.id, cantidad }),
      });
      if (!res.ok) throw new Error("Error al agregar el producto.");
      
      toast.success("Producto agregado", { id: toastId });
      await fetchCarrito();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const eliminarProducto = async (productoId) => {
    const toastId = toast.loading("Eliminando producto...");
    try {
      const res = await fetch(`${API_URL}/api/carrito/${productoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar el producto.");
      
      toast.success("Producto eliminado", { id: toastId });
      await fetchCarrito();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const vaciarCarrito = async () => {
    const toastId = toast.loading("Vaciando carrito...");
    try {
      const res = await fetch(`${API_URL}/api/carrito`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al vaciar el carrito.");
      
      toast.success("Carrito vacío", { id: toastId });
      await fetchCarrito();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      await eliminarProducto(productoId);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/carrito/${productoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });
      if (!res.ok) throw new Error("Error al actualizar cantidad.");
      
      await fetchCarrito();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const incrementarCantidad = (productoId) => {
    const item = carrito.find(p => p.id === productoId);
    if (item) {
      actualizarCantidad(productoId, item.cantidad + 1);
    }
  };

  const disminuirCantidad = (productoId) => {
    const item = carrito.find(p => p.id === productoId);
    if (item) {
      actualizarCantidad(productoId, item.cantidad - 1);
    }
  };

  const totalProductos = carrito.reduce((acc, p) => acc + (p.cantidad || 0), 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        isLoading,
        agregarProducto,
        eliminarProducto,
        vaciarCarrito,
        totalProductos,
        incrementarCantidad,
        disminuirCantidad,
        actualizarCantidad, 
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
