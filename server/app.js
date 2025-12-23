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
import chatbotRoutes from "./routes/chatbot.js";
import intentRoutes from "./routes/intents.js";
import configurationRoutes from "./routes/configuration.js";

import postalCodeRoutes from "./routes/postalcode.js";

const app = express();
app.disable('x-powered-by');
const allowedOrigins = [
  'https://darmaxagua.com.mx', 
  'https://darmax2.vercel.app',
  'http://localhost:5173',
];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
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
app.use("/api/orderEmail", orderEmailRoutes); 
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/intents", intentRoutes);
app.use("/api/configuration", configurationRoutes);

app.use("/api/orders", ordersRouter);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Custom error handling middleware (debe ser el último middleware)
app.use((err, req, res, next) => {
  console.error("🚨 Global Error Handler:", err.stack); // Log the error stack for debugging
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred";

  // En producción, podrías querer ocultar el stack trace
  const errorResponse = {
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { detail: err.stack }),
  };
  
  res.status(statusCode).json(errorResponse);
});

export default app;
