import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/:cp', async (req, res) => {
    const { cp } = req.params;
    const apiKey = process.env.DIPOMEX_API_KEY;

    if (!cp || cp.length !== 5) {
        return res.status(400).json({ error: 'Código postal inválido.' });
    }

    if (!apiKey) {
        console.error('Error: La variable de entorno DIPOMEX_API_KEY no está configurada en el servidor.');
        return res.status(500).json({ error: 'El servicio de códigos postales no está configurado en el servidor.' });
    }

    const apiUrl = `https://api.tau.com.mx/dipomex/v1/codigo_postal?cp=${cp}`;

    try {
        const apiResponse = await fetch(apiUrl, {
            headers: { 'APIKEY': apiKey }
        });
        
        const data = await apiResponse.json();

        if (!apiResponse.ok || data.error) {
            return res.status(apiResponse.status).json({ error: data.message || 'Error desde la API de códigos postales.' });
        }

        res.status(200).json(data);
        
    } catch (error) {
        console.error('Error al contactar la API de DIPOMEX:', error);
        res.status(500).json({ error: 'No se pudo conectar con el servicio de códigos postales.' });
    }
});

export default router;
