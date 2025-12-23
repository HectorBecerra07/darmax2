import express from 'express';
import prisma from '../prisma.js';
const router = express.Router();

// Helper function to normalize strings
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD") // Normalize for Unicode, separates base char from diacritic
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"¿¡\s]/g, "") // Remove punctuation and extra spaces
    .replace(/\s+/g, "") // Remove any remaining multiple spaces
    .trim(); // Trim leading/trailing whitespace
};

const getBotResponse = async (userMessage) => {
  const normalizedUserMessage = normalizeString(userMessage);
  
  try {
    const allIntents = await prisma.chatIntent.findMany();
    
    for (const intent of allIntents) {
      for (const phrase of intent.trainingPhrases) {
        const normalizedPhrase = normalizeString(phrase);
        
        // Use a simple includes check. For more complex matching, consider regex or NLP libraries.
        // Ensure phrase is not empty after normalization to avoid false positives
        if (normalizedPhrase.length > 0 && normalizedUserMessage.includes(normalizedPhrase)) {
          return intent.response;
        }
      }
    }

    // Fallback response if no intent is matched
    return 'Lo siento, no he entendido tu pregunta. ¿Puedes intentar reformularla? También puedes contactar a nuestro equipo de soporte para obtener ayuda más detallada.';

  } catch (error) {
    console.error("Error fetching intents for bot response:", error);
    return 'He tenido un problema para acceder a mi base de conocimientos. Por favor, inténtalo de nuevo más tarde.';
  }
};

// @route   POST api/chatbot/session
// @desc    Create a new chat session
// @access  Public
router.post('/session', async (req, res) => {
  try {
    const session = await prisma.chatSession.create({
      data: {},
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Could not create chat session' });
  }
});

// @route   GET api/chatbot/session/:sessionId
// @desc    Get all messages for a session
// @access  Public
router.get('/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    try {
        const messages = await prisma.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Could not fetch messages' });
    }
});


// @route   POST api/chatbot/message
// @desc    Handle chatbot messages and save them
// @access  Public
router.post('/message', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: 'Message and sessionId are required' });
  }

  try {
    // 1. Save user message
    await prisma.chatMessage.create({
      data: {
        content: message,
        from: 'user',
        sessionId: sessionId,
      },
    });

    // 2. Get bot response from DB
    const botResponseText = await getBotResponse(message);

    // 3. Save bot message
    await prisma.chatMessage.create({
      data: {
        content: botResponseText,
        from: 'bot',
        sessionId: sessionId,
      },
    });
    
    // 4. Send response to frontend
    res.json({ response: botResponseText });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Error processing message' });
  }
});

export default router;
