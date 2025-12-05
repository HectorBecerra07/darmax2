import express from "express";
import cors from "cors";

import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/productos.js";
import categoryRoutes from "./routes/categorias.js";
import cartRoutes from "./routes/carrito.js";
import userRoutes from "./routes/users.js";
import paymentRoutes from "./routes/payments.js";
import orderEmailRoutes from "./routes/orderEmail.js";
import ordersRouter from "./routes/orders.js";
import configuradorRoutes from "./routes/configurador.js";
// Shipping routes
import shippingRoutes from "./routes/shipping.js";

import postalCodeRoutes from "./routes/postalcode.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use("/api/admin", adminRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/categorias", categoryRoutes);
app.use("/api/carrito", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/postalcode", postalCodeRoutes);
app.use("/api/configurador", configuradorRoutes);

app.use("/api/orders", ordersRouter);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;
