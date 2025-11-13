const express = require('express');
const dotenv = require('dotenv');
const prisma = require('./prisma'); // o ../prismaClient si lo usas así
const cors = require('cors');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
