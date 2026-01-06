import express from 'express';
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET: Obtener un MachineModel por su slug con sus relaciones
router.get('/models/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const model = await prisma.machineModel.findUnique({
      where: { slug },
      include: {
        extras: {
          include: {
            extra: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        images: {
          orderBy: {
            priority: 'asc',
          },
          include: {
            tinacoExtra: true,
          },
        },
      },
    });
    if (!model) {
      return res.status(404).json({ message: 'Modelo de máquina no encontrado.' });
    }
    res.json(model);
  } catch (error) {
    console.error(`Error fetching machine model by slug ${slug}:`, error);
    res.status(500).json({ message: 'Error al obtener el modelo de máquina', error: error.message });
  }
});

// GET: Obtener solo los extras de un modelo por slug
router.get('/models/:slug/extras', async (req, res) => {
    const { slug } = req.params;
    try {
        const model = await prisma.machineModel.findUnique({
            where: { slug },
            select: {
                extras: {
                    include: {
                        extra: true,
                    },
                    orderBy: {
                        sortOrder: 'asc',
                    },
                },
            },
        });

        if (!model) {
            return res.status(404).json({ message: 'Modelo de máquina no encontrado.' });
        }

        res.json(model.extras);
    } catch (error) {
        console.error(`Error fetching extras for model ${slug}:`, error);
        res.status(500).json({ message: 'Error al obtener los extras del modelo', error: error.message });
    }
});

// GET: Obtener todos los MachineModels con sus relaciones
router.get('/models', async (req, res) => {
  try {
    const models = await prisma.machineModel.findMany({
      include: {
        extras: {
          include: {
            extra: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        images: {
          orderBy: {
            priority: 'asc',
          },
          include: {
            tinacoExtra: true,
          },
        },
      },
    });
    res.json(models);
  } catch (error) {
    console.error("Error fetching machine models:", error);
    res.status(500).json({ message: 'Error al obtener los modelos de máquinas', error: error.message });
  }
});

// --- CRUD para Extras ---

// GET: Obtener todos los Extras
router.get('/extras', async (req, res) => {
  try {
    const extras = await prisma.extra.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    res.json(extras);
  } catch (error) {
    console.error("Error fetching extras:", error);
    res.status(500).json({ message: 'Error al obtener los extras', error: error.message });
  }
});

// POST: Crear un nuevo Extra
router.post('/extras', async (req, res) => {
    const { code, name, description, basePrice, isTinaco, tinacoKey, tinacoCapacityLiters } = req.body;

    // Validación: code y name son obligatorios. basePrice puede ser 0, pero no undefined/null.
    if (!code || !name || basePrice === undefined || basePrice === null) {
        return res.status(400).json({ message: 'Los campos code, name y basePrice son requeridos.' });
    }

    try {
        const newExtra = await prisma.extra.create({
            data: {
                code,
                name,
                description: description || "",
                basePrice: parseInt(basePrice),
                isTinaco: Boolean(isTinaco),
                tinacoKey: tinacoKey || null,
                tinacoCapacityLiters: tinacoCapacityLiters ? parseInt(tinacoCapacityLiters) : null,
            },
        });
        res.status(201).json(newExtra);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe un extra con ese código (slug).' });
        }
        console.error("Error creating extra:", error);
        res.status(500).json({ message: 'Error al crear el extra', error: error.message });
    }
});

// PUT: Actualizar un Extra existente
router.put('/extras/:id', async (req, res) => {
    const { id } = req.params;
    const { code, name, description, basePrice, isTinaco, tinacoKey, tinacoCapacityLiters } = req.body;

    if (!code || !name || basePrice === undefined || basePrice === null) {
        return res.status(400).json({ message: 'Los campos code, name y basePrice son requeridos.' });
    }
    
    try {
        const updatedExtra = await prisma.extra.update({
            where: { id },
            data: {
                code,
                name,
                description: description || "",
                basePrice: parseInt(basePrice),
                isTinaco: Boolean(isTinaco),
                tinacoKey: tinacoKey || null,
                tinacoCapacityLiters: tinacoCapacityLiters ? parseInt(tinacoCapacityLiters) : null,
            },
        });
        res.json(updatedExtra);
    } catch (error) {
         if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe un extra con ese código (slug).' });
        }
        console.error(`Error updating extra ${id}:`, error);
        res.status(500).json({ message: 'Error al actualizar el extra', error: error.message });
    }
});

// DELETE: Eliminar un Extra
router.delete('/extras/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.extra.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting extra ${id}:`, error);
        res.status(500).json({ message: 'Error al eliminar el extra. Asegúrate que no esté en uso por un modelo.', error: error.message });
    }
});

// --- CRUD para MachineModel ---

// POST: Crear un nuevo MachineModel
router.post('/models', async (req, res) => {
    const { slug, name, description, basePrice, features, supportsTinacos, isAtlantis, vendingType } = req.body;
    
    if (!slug || !name) {
        return res.status(400).json({ message: 'Los campos slug y name son requeridos.' });
    }

    try {
        const newModel = await prisma.machineModel.create({
            data: {
                slug,
                name,
                description,
                basePrice: basePrice ? parseInt(basePrice) : 0,
                features: Array.isArray(features) ? features : [],
                supportsTinacos: Boolean(supportsTinacos),
                isAtlantis: Boolean(isAtlantis),
                vendingType: vendingType || "NONE",
            },
        });
        res.status(201).json(newModel);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe un modelo con ese slug.' });
        }
        console.error("Error creating machine model:", error);
        res.status(500).json({ message: 'Error al crear el modelo de máquina', error: error.message });
    }
});

// PUT: Actualizar un MachineModel
router.put('/models/:id', async (req, res) => {
    const { id } = req.params;
    const { slug, name, description, basePrice, features, supportsTinacos, isAtlantis, vendingType } = req.body;
    
    if (!slug || !name) {
        return res.status(400).json({ message: 'Los campos slug y name son requeridos.' });
    }

    try {
        const updatedModel = await prisma.machineModel.update({
            where: { id },
            data: {
                slug,
                name,
                description,
                basePrice: basePrice ? parseInt(basePrice) : 0,
                features: Array.isArray(features) ? features : [],
                supportsTinacos: Boolean(supportsTinacos),
                isAtlantis: Boolean(isAtlantis),
                vendingType: vendingType || "NONE",
            },
        });
        res.json(updatedModel);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Ya existe un modelo con ese slug.' });
        }
        console.error(`Error updating machine model ${id}:`, error);
        res.status(500).json({ message: 'Error al actualizar el modelo de máquina', error: error.message });
    }
});

// DELETE: Eliminar un MachineModel
router.delete('/models/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar relaciones en ModelExtra primero
        await prisma.modelExtra.deleteMany({
            where: { modelId: id },
        });
        // Eliminar imágenes asociadas
        await prisma.configurationImage.deleteMany({
            where: { modelId: id },
        });
        // Finalmente, eliminar el modelo
        await prisma.machineModel.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting machine model ${id}:`, error);
        res.status(500).json({ message: 'Error al eliminar el modelo de máquina.', error: error.message });
    }
});

// --- CRUD para ModelExtra (Asociaciones) ---

// POST: Asociar un Extra a un MachineModel
router.post('/modelextras', async (req, res) => {
    const { modelId, extraId, priceOverride, isDefault, isRequired, sortOrder } = req.body;
    if (!modelId || !extraId) {
        return res.status(400).json({ message: 'modelId y extraId son requeridos.' });
    }
    try {
        const newAssociation = await prisma.modelExtra.create({
            data: {
                modelId,
                extraId,
                priceOverride: priceOverride ? parseInt(priceOverride) : null,
                isDefault: Boolean(isDefault),
                isRequired: Boolean(isRequired),
                sortOrder: sortOrder ? parseInt(sortOrder) : 0,
            },
        });
        res.status(201).json(newAssociation);
    } catch (error) {
        console.error("Error creating model-extra association:", error);
        res.status(500).json({ message: 'Error al asociar el extra al modelo.', error: error.message });
    }
});

// PUT: Actualizar una asociación ModelExtra
router.put('/modelextras/:id', async (req, res) => {
    const { id } = req.params;
    const { priceOverride, isDefault, isRequired, sortOrder } = req.body;
    try {
        const updatedAssociation = await prisma.modelExtra.update({
            where: { id },
            data: {
                priceOverride: priceOverride ? parseInt(priceOverride) : null,
                isDefault: Boolean(isDefault),
                isRequired: Boolean(isRequired),
                sortOrder: sortOrder ? parseInt(sortOrder) : 0,
            },
        });
        res.json(updatedAssociation);
    } catch (error) {
        console.error(`Error updating model-extra association ${id}:`, error);
        res.status(500).json({ message: 'Error al actualizar la asociación.', error: error.message });
    }
});

// DELETE: Eliminar una asociación ModelExtra
router.delete('/modelextras/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.modelExtra.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting model-extra association ${id}:`, error);
        res.status(500).json({ message: 'Error al eliminar la asociación.', error: error.message });
    }
});

// --- CRUD para ConfigurationImage ---

// POST: Crear una nueva ConfigurationImage
router.post('/images', async (req, res) => {
    const { modelId, tinacoExtraId, context, onlyWhenAlcalina, isSecondary, secondaryVariantKey, url, alt, priority } = req.body;

    if (!modelId || !context || !url || !alt) {
        return res.status(400).json({ message: 'modelId, context, url, y alt son requeridos.' });
    }

    try {
        const newImage = await prisma.configurationImage.create({
            data: {
                modelId,
                tinacoExtraId: tinacoExtraId || null,
                context,
                onlyWhenAlcalina: Boolean(onlyWhenAlcalina),
                isSecondary: Boolean(isSecondary),
                secondaryVariantKey,
                url,
                alt,
                priority: priority ? parseInt(priority) : 0,
            },
        });
        res.status(201).json(newImage);
    } catch (error) {
        console.error("Error creating configuration image:", error);
        res.status(500).json({ message: 'Error al crear la imagen de configuración.', error: error.message });
    }
});

// PUT: Actualizar una ConfigurationImage
router.put('/images/:id', async (req, res) => {
    const { id } = req.params;
    const { tinacoExtraId, context, onlyWhenAlcalina, isSecondary, secondaryVariantKey, url, alt, priority } = req.body;

    if (!context || !url || !alt) {
        return res.status(400).json({ message: 'context, url, y alt son requeridos.' });
    }

    try {
        const updatedImage = await prisma.configurationImage.update({
            where: { id },
            data: {
                tinacoExtraId: tinacoExtraId || null,
                context,
                onlyWhenAlcalina: Boolean(onlyWhenAlcalina),
                isSecondary: Boolean(isSecondary),
                secondaryVariantKey,
                url,
                alt,
                priority: priority ? parseInt(priority) : 0,
            },
        });
        res.json(updatedImage);
    } catch (error) {
        console.error(`Error updating configuration image ${id}:`, error);
        res.status(500).json({ message: 'Error al actualizar la imagen de configuración.', error: error.message });
    }
});

// DELETE: Eliminar una ConfigurationImage
router.delete('/images/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.configurationImage.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting configuration image ${id}:`, error);
        res.status(500).json({ message: 'Error al eliminar la imagen de configuración.', error: error.message });
    }
});

export default router;
