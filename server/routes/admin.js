const express = require('express');
const prisma = require('../prisma'); // asegúrate de esta ruta
const router = express.Router();

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

module.exports = router;
