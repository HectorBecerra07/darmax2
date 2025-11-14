import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/productos.js";
import categoryRoutes from "./routes/categorias.js";
import cartRoutes from "./routes/carrito.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/categorias", categoryRoutes);
app.use("/api/carrito", cartRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;
