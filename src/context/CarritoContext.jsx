import React, { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const data = localStorage.getItem("carrito");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarProducto = (producto) => {
    const cantidad = producto.cantidad ? producto.cantidad : 1;
    const precio = producto.precio ? producto.precio : 0;

    setCarrito((prev) => {
      const existe = prev.find(
        (p) => String(p.id) === String(producto.id)
      );

      if (existe) {
        return prev.map((p) =>
          String(p.id) === String(producto.id)
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
      }

      return [...prev, { ...producto, cantidad, precio }];
    });
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) =>
      prev.filter((p) => String(p.id) !== String(id))
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const incrementarCantidad = (productoId) => {
    setCarrito((prev) =>
      prev.map((item) =>
        String(item.id) === String(productoId)
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (productoId) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (String(item.id) === String(productoId)) {
            const nuevaCantidad = item.cantidad - 1;
            return { ...item, cantidad: nuevaCantidad };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0)
    );
  };

  const totalProductos = carrito.reduce(
    (acc, p) => acc + (p.cantidad || 0),
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        vaciarCarrito,
        totalProductos,
        incrementarCantidad,
        disminuirCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
