// src/main.jsx o index.jsx (según estructura)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import App from "./App";
import { CarritoProvider } from "./context/CarritoContext";
import { UserProvider } from "./context/UserContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { initVersionChecker } from "./utils/versionCheck";
import "./index.css";

initVersionChecker();

const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ReCaptchaWrapper = ({ children }) => {
  if (!RECAPTCHA_KEY) return <>{children}</>;
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_KEY}
      container={{
        parameters: {
          badge: "bottomleft",
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <ReCaptchaWrapper>
        <CarritoProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FavoritesProvider>
        </CarritoProvider>
      </ReCaptchaWrapper>
    </UserProvider>
  </React.StrictMode>
);
