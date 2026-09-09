/**
 * Detector de versiones y reiniciador automatico tras nuevos despliegues.
 */
export const initVersionChecker = () => {
  if (typeof window === 'undefined') return;

  // Escuchar errores de precarga de chunks cuando un deploy reemplaza los archivos anteriores
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    console.warn("Nueva version detectada por vite:preloadError. Recargando...");
    window.location.reload();
  });

  // Solo verificar periodicamente en entorno de produccion
  if (!import.meta.env.PROD) return;

  const currentVersion = document
    .querySelector('meta[name="build-version"]')
    ?.getAttribute('content');

  if (!currentVersion) return;

  const checkForNewVersion = async () => {
    try {
      const response = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data && data.version && data.version !== currentVersion) {
        console.warn("Nueva version del deploy disponible. Actualizando aplicacion...");
        window.location.reload();
      }
    } catch {
      // Ignorar fallos de conexion pasajeros
    }
  };

  // Verificar cuando el usuario regresa a la pestaña o ventana
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForNewVersion();
    }
  });

  window.addEventListener('focus', checkForNewVersion);

  // Verificar periodicamente cada 3 minutos
  setInterval(checkForNewVersion, 3 * 60 * 1000);
};
