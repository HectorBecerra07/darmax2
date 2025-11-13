import React, { createContext, useContext, useState, useEffect } from "react";

// Helper para decodificar el token JWT sin librerías externas
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decodificando el token:", e);
    return null;
  }
}

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, intentar restaurar la sesión desde localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken = parseJwt(storedToken);
      // Comprobar si el token ha expirado
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        // En un caso real, aquí también se podría volver a pedir los datos del usuario a la API
        // para tener la información más actualizada.
        setUser({
          id: decodedToken.userId,
          name: decodedToken.name,
          email: decodedToken.email,
        });
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Si el token es inválido o expiró, lo limpiamos
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (data) => {
    const { user: userData, token: userToken } = data;
    localStorage.setItem("token", userToken);
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // El valor del proveedor ahora incluye el estado de autenticación y las funciones
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser: login, // Renombramos setUser a login para mayor claridad
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
