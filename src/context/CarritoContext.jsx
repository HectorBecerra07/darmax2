import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useUser } from "./UserContext";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

const GUEST_CART_KEY = 'guestCart';

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated, user } = useUser();

  // Helper para actualizar el estado y localStorage para invitados
  const updateGuestCart = (newCart) => {
    setCarrito(newCart);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
  };

  // Cargar el carrito desde el backend
  const fetchApiCart = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/carrito', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo cargar el carrito del servidor.");
      const data = await res.json();
      const serverCart = data.map(item => ({
        ...item.producto,
        cantidad: item.cantidad,
        id: item.producto.id,
      }));
      setCarrito(serverCart);
    } catch (error) {
      toast.error(error.message);
      setCarrito([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Sincronizar carrito de invitado con el backend al iniciar sesión
  const syncGuestCartToApi = useCallback(async () => {
    const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
    if (guestCart.length === 0) {
      await fetchApiCart();
      return;
    }

    const toastId = toast.loading("Sincronizando tu carrito...");
    try {
      // Usamos Promise.all para enviar todos los productos al mismo tiempo
      await Promise.all(
        guestCart.map(item =>
          fetch('/api/carrito', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ productoId: item.id, cantidad: item.cantidad }),
          })
        )
      );
      localStorage.removeItem(GUEST_CART_KEY);
      toast.success("Carrito sincronizado", { id: toastId });
    } catch (error) {
      toast.error("Error al sincronizar el carrito.", { id: toastId });
    } finally {
      // Cargar el carrito final desde el servidor
      await fetchApiCart();
    }
  }, [token, fetchApiCart]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Si el usuario está autenticado, sincronizar y/o cargar el carrito del API
      syncGuestCartToApi();
    } else {
      // Si es un invitado, cargar desde localStorage
      const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
      setCarrito(guestCart);
      setIsLoading(false);
    }
  }, [isAuthenticated, user, syncGuestCartToApi]);


  const agregarProducto = async (producto, cantidad = 1) => {
    if (isAuthenticated) {
      const toastId = toast.loading("Agregando al carrito...");
      try {
        const res = await fetch('/api/carrito', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ productoId: producto.id, cantidad }),
        });
        if (!res.ok) throw new Error("Error al agregar el producto.");
        toast.success("Producto agregado", { id: toastId });
        await fetchApiCart();
      } catch (error) {
        toast.error(error.message, { id: toastId });
      }
    } else {
      // Lógica para invitado
      const existingItem = carrito.find(p => p.id === producto.id);
      let newCart;
      if (existingItem) {
        newCart = carrito.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      } else {
        newCart = [...carrito, { ...producto, cantidad }];
      }
      updateGuestCart(newCart);
      toast.success("Producto agregado al carrito");
    }
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      await eliminarProducto(productoId);
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await fetch(`/api/carrito/${productoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ cantidad: nuevaCantidad }),
        });
        if (!res.ok) throw new Error("Error al actualizar cantidad.");
        await fetchApiCart();
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      const newCart = carrito.map(p =>
        p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
      );
      updateGuestCart(newCart);
    }
  };

  const eliminarProducto = async (productoId) => {
    if (isAuthenticated) {
      const toastId = toast.loading("Eliminando producto...");
      try {
        const res = await fetch(`/api/carrito/${productoId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al eliminar el producto.");
        toast.success("Producto eliminado", { id: toastId });
        await fetchApiCart();
      } catch (error) {
        toast.error(error.message, { id: toastId });
      }
    } else {
      const newCart = carrito.filter(p => p.id !== productoId);
      updateGuestCart(newCart);
      toast.success("Producto eliminado");
    }
  };

  const vaciarCarrito = async () => {
    if (isAuthenticated) {
      const toastId = toast.loading("Vaciando carrito...");
      try {
        const res = await fetch('/api/carrito', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al vaciar el carrito.");
        toast.success("Carrito vacío", { id: toastId });
        await fetchApiCart();
      } catch (error) {
        toast.error(error.message, { id: toastId });
      }
    } else {
      updateGuestCart([]);
      toast.success("Carrito vacío");
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
