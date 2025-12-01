   server/routes/postalcode.js

import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/:cp', async (req, res) => {
    const { cp } = req.params;

    if (!cp || cp.length !== 5) {
        return res.status(400).json({ error: 'Código postal inválido.' });
    }

    const apiUrl = `https://sepomex.nitrostudio.com.mx/api/latest/cp/${cp}.json`;

    try {
        const apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
            // Forward the status and error from the external API if possible
            const errorBody = await apiResponse.text();
            return res.status(apiResponse.status).json({ error: `Error desde la API externa: ${errorBody}` });
        }

        const data = await apiResponse.json();
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Error al contactar la API de SEPOMEX:', error);
        res.status(500).json({ error: 'No se pudo conectar con el servicio de códigos postales.' });
    }
});

export default router;
