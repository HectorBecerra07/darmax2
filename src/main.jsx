// src/main.jsx o index.jsx (según estructura)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import App from "./App";
import { CarritoProvider } from "./context/CarritoContext";
import { UserProvider } from "./context/UserContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import "./index.css";

const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <GoogleReCaptchaProvider
        reCaptchaKey={RECAPTCHA_KEY}
        container={{
          parameters: {
            badge: "bottomleft", // Explicitly requesting bottom left
          },
        }}
      >
        <CarritoProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FavoritesProvider>
        </CarritoProvider>
      </GoogleReCaptchaProvider>
    </UserProvider>
  </React.StrictMode>
);
