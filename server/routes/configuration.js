import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// GET a specific configuration setting by key
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const config = await prisma.configuration.findUnique({
      where: { key },
    });
    if (config) {
      res.json(config);
    } else {
      res.status(404).json({ error: `Configuration with key "${key}" not found.` });
    }
  } catch (error) {
    console.error(`Error fetching configuration for key "${key}":`, error);
    res.status(500).json({ error: 'Could not fetch configuration' });
  }
});

// POST to create or update a configuration setting
router.post('/', async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Key and value are required.' });
  }

  try {
    const config = await prisma.configuration.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    res.json(config);
  } catch (error) {
    console.error(`Error upserting configuration for key "${key}":`, error);
    res.status(500).json({ error: 'Could not save configuration' });
  }
});

export default router;
