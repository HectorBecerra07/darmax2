// src/main.jsx o index.jsx (según estructura)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CarritoProvider } from "./context/CarritoContext";
import { UserProvider } from "./context/UserContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { initVersionChecker } from "./utils/versionCheck";
import "./index.css";

initVersionChecker();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <CarritoProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavoritesProvider>
      </CarritoProvider>
    </UserProvider>
  </React.StrictMode>
);
