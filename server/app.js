// server/app.js
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" }); // asegura que lee el correcto

import express from "express";
import cors from "cors";

import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/productos.js";
import categoryRoutes from "./routes/categorias.js";
import cartRoutes from "./routes/carrito.js";
import userRoutes from "./routes/users.js";
import paymentRoutes from "./routes/payments.js";
import orderEmailRoutes from "./routes/orderEmail.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/categorias", categoryRoutes);
app.use("/api/carrito", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderEmailRoutes); // 👈 aquí se monta la ruta de correos

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;
