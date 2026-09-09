import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';

const versionPlugin = () => {
  const buildTime = Date.now().toString();
  return {
    name: 'version-plugin',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: buildTime }),
      });
    },
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `  <meta name="build-version" content="${buildTime}" />\n  </head>`
      );
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    versionPlugin(),
    Sitemap({
      hostname: 'https://darmaxagua.com.mx',
      dynamicRoutes: [
        '/',
        '/vending-info',
        '/purificadora-info',
        '/vending-limpieza-info',
        '/duo-emprendedor-info',
        '/tridente-info',
        '/megalodon-info',
        '/proyectos-empresariales',
        '/videos',
        '/nosotros',
        '/terminos-y-condiciones',
        '/politica-de-privacidad'
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // PDF Libraries (Suelen ser muy pesadas)
            if (id.includes('@react-pdf') || id.includes('jspdf') || id.includes('html2pdf')) {
              return 'vendor-pdf';
            }
            // Material UI
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-ui';
            }
            // React Core & Router
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('react')) {
              return 'vendor-react';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Iconos
            if (id.includes('react-icons') || id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },
});
