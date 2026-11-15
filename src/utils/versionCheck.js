import { clearConfiguradorModelsCache } from "../services/configuradorService";

/**
 * Limpia caches del navegador (CacheStorage, Service Workers, sessionStorage) y fuerza recarga
 */
export const purgeCacheAndReload = async (newVersion = null) => {
  try {
    // 1. Desregistrar Service Workers activos si existen
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }

    // 2. Limpiar todos los caches de CacheStorage
    if (typeof window !== "undefined" && "caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }

    // 3. Limpiar almacenamiento de sesion y memoria
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.clear();
    }
    clearConfiguradorModelsCache();
  } catch (err) {
    console.error("Error al purgar caches de despliegue:", err);
  }

  // 4. Forzar recarga con parametro para bypass de HTTP cache
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.set("v", newVersion || Date.now().toString());
    window.location.replace(url.toString());
  }
};

/**
 * Detector de versiones y reiniciador automatico tras nuevos despliegues.
 */
export const initVersionChecker = () => {
  if (typeof window === "undefined") return;

  // Escuchar errores de precarga de chunks cuando un deploy reemplaza los archivos anteriores
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    console.warn("Nueva version detectada por vite:preloadError. Purgando cache y recargando...");
    purgeCacheAndReload();
  });

  // Solo verificar periodicamente en entorno de produccion
  if (!import.meta.env.PROD) return;

  const currentVersion = document
    .querySelector('meta[name="build-version"]')
    ?.getAttribute("content");

  if (!currentVersion) return;

  let isChecking = false;

  const checkForNewVersion = async () => {
    if (isChecking) return;
    isChecking = true;
    try {
      const response = await fetch(`/version.json?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data && data.version && data.version !== currentVersion) {
        console.warn("Nueva version del deploy disponible. Actualizando aplicacion...");
        await purgeCacheAndReload(data.version);
      }
    } catch {
      // Ignorar fallos de conexion pasajeros
    } finally {
      isChecking = false;
    }
  };

  // Verificar al iniciar la aplicacion poco despues del primer render
  setTimeout(checkForNewVersion, 1200);

  // Verificar cuando el usuario regresa a la pestaña o ventana
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      checkForNewVersion();
    }
  });

  window.addEventListener("focus", checkForNewVersion);

  // Verificar periodicamente cada 2 minutos
  setInterval(checkForNewVersion, 2 * 60 * 1000);
};
