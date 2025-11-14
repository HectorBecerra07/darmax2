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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loggedOutUserName, setLoggedOutUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const decodedToken = parseJwt(storedToken);
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          try {
            const response = await fetch('/api/users/me', {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              setToken(storedToken);
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem("token");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        } else {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = (data) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (user) {
      setLoggedOutUserName((user.name || "").split(" ")[0]);
    }
    setIsLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setIsLoggingOut(false);
      setLoggedOutUserName("");
    }, 2500); // Debe coincidir con la duración de la pantalla de despedida
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    isLoggingOut,
    loggedOutUserName,
    setUser: login,
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
