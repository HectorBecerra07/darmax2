import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.js";

const app = express();

// Middleware
app.use(cors()); // permite peticiones desde tu frontend (Vite en 5173)
app.use(express.json()); // para leer JSON en req.body

// Rutas del admin
app.use("/api/admin", adminRoutes);

// Ruta simple para probar que el server está vivo
app.get("/", (req, res) => {
  res.send("API Darmax funcionando");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
