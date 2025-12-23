import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// GET all intents
router.get('/', async (req, res) => {
  try {
    console.log('Inspecting prisma object in intents route:', prisma);
    const intents = await prisma.chatIntent.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(intents);
  } catch (error) {
    console.error('Error fetching intents:', error);
    res.status(500).json({ error: 'Could not fetch intents' });
  }
});

// POST a new intent
router.post('/', async (req, res) => {
  const { name, description, trainingPhrases, response } = req.body;
  if (!name || !trainingPhrases || !response) {
    return res.status(400).json({ error: 'Name, trainingPhrases, and response are required.' });
  }

  try {
    const newIntent = await prisma.chatIntent.create({
      data: {
        name,
        description,
        trainingPhrases,
        response,
      },
    });
    res.status(201).json(newIntent);
  } catch (error) {
    console.error('Error creating intent:', error);
    if (error.code === 'P2002') {
        return res.status(409).json({ error: `An intent with the name "${name}" already exists.` });
    }
    res.status(500).json({ error: 'Could not create the intent' });
  }
});

// PUT (update) an intent by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, trainingPhrases, response } = req.body;

  if (!name || !trainingPhrases || !response) {
    return res.status(400).json({ error: 'Name, trainingPhrases, and response are required.' });
  }

  try {
    const updatedIntent = await prisma.chatIntent.update({
      where: { id },
      data: {
        name,
        description,
        trainingPhrases,
        response,
      },
    });
    res.json(updatedIntent);
  } catch (error) {
    console.error(`Error updating intent ${id}:`, error);
     if (error.code === 'P2002') {
        return res.status(409).json({ error: `An intent with the name "${name}" already exists.` });
    }
    res.status(500).json({ error: `Could not update the intent` });
  }
});

// DELETE an intent by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.chatIntent.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error(`Error deleting intent ${id}:`, error);
    res.status(500).json({ error: `Could not delete the intent` });
  }
});

export default router;
