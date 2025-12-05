import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// --- DATOS EXTRAÍDOS DE Step3ExtrasConfigurator.jsx ---

const extrasPorMaquina = {
  Neptuno: [{ id: "tinaco-1100", nombre: "2 Tinacos 1100L", precio: 1100 },{ id: "tinaco-2500", nombre: "2 Tinacos 2500L", precio: 10500 },{ id: "tinaco-5000", nombre: "1 Tinaco 5000L", precio: 10500 },{ id: "agua-alcalina", nombre: "Agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  NeptunoAPlus: [{ id: "tinaco-1100", nombre: "2 Tinacos 1100L", precio: 1100 },{ id: "tinaco-2500", nombre: "2 Tinacos 2500L", precio: 10500 },{ id: "tinaco-5000", nombre: "2 Tinacos 5000L", precio: 21000 },{ id: "agua-alcalina", nombre: "Agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  Atlantis: [{ id: "tinaco-1100", nombre: "2 Tinacos 1100L", precio: 1100 },{ id: "tinaco-2500", nombre: "1 Tinaco 2500L", precio: 10500 },{ id: "tinaco-5000", nombre: "1 Tinaco 5000L", precio: 21000 },{ id: "agua-alcalina", nombre: "Agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  AtlantisMax: [{ id: "tinaco-1100", nombre: "2 Tinacos 1100L", precio: 1100 },{ id: "tinaco-2500", nombre: "2 Tinacos 2500L", precio: 10500 },{ id: "tinaco-5000", nombre: "2 Tinacos 5000L", precio: 21000 },{ id: "agua-alcalina", nombre: "Agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  AtlantisTouch: [{ id: "tinaco-1100", nombre: "1 Tinaco 1100L", precio: 1100 },{ id: "tinaco-2500", nombre: "1 Tinaco 2500L", precio: 10500 },{ id: "tinaco-5000", nombre: "1 Tinaco 5000L", precio: 21000 },{ id: "agua-alcalina", nombre: "Agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  AtlantisMaxTouch: [{ id: "tinaco-2500-1100", nombre: "1 Tinaco 2500L + 1 Tinaco 1100L", precio: 1100 },{ id: "tinaco-2500", nombre: "2 Tinacos 2500L", precio: 10500 },{ id: "tinaco-5000-2500", nombre: "1 Tinaco 5000L + 1 Tinaco 2500L", precio: 1100 },{ id: "agua-alcalina", nombre: "Agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  Vending5: [{ id: "permisos", nombre: "Permisos y Trámites", precio: 3000 },{ id: "Volantes", nombre: "Volantes publicitarios", precio: 1500 },{ id: "limpieza", nombre: "5 bidones de 20 Litros", precio: 3000 }],
  Vending8: [{ id: "permisos", nombre: "Permisos y Trámites", precio: 3000 },{ id: "Volantes", nombre: "Volantes publicitarios", precio: 1500 },{ id: "limpieza", nombre: "8 bidones de 20 Litros", precio: 3000 },{ id: "Rack", nombre: "Rack para bidones ", precio: 8000 }],
};
const TINACO_IMAGES = { default: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/0035.png", "tinaco-5000": "/img/TINACOS/0036.png", }, Neptuno: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/0035.png", "tinaco-5000": "/img/TINACOS/0036.png", }, NeptunoAPlus: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/0026.png", "tinaco-5000": "/img/TINACOS/0028.png", }, Atlantis: { "tinaco-1100": "/img/TINACOS/atlantis/202.png", "tinaco-2500": "/img/TINACOS/atlantis/203.png", "tinaco-5000": "/img/TINACOS/atlantis/204.png", }, AtlantisMax: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/atlantis/211.png", "tinaco-5000": "/img/TINACOS/atlantis/213.png", }, AtlantisTouch: { "tinaco-1100": "/img/TINACOS/atlantis/202.png", "tinaco-2500": "/img/TINACOS/atlantis/203.png", "tinaco-5000": "/img/TINACOS/atlantis/204.png", }, AtlantisMaxTouch: { "tinaco-2500-1100": "/img/TINACOS/atlantis/210.png", "tinaco-5000-2500": "/img/TINACOS/atlantis/212.png", "tinaco-2500": "/img/TINACOS/atlantis/211.png", "tinaco-5000": "/img/TINACOS/atlantis/213.png", }, };
const TINACO_ALCALINA_IMAGES = { default: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/alcalina/207.png", "tinaco-5000": "/img/TINACOS/0036-alcalina.png", }, Neptuno: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/alcalina/231.png", "tinaco-5000": "/img/TINACOS/alcalina/232.png", }, NeptunoAPlus: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/alcalina/221.png", "tinaco-5000": "/img/TINACOS/alcalina/223.png", }, Atlantis: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/atlantis/207.png", "tinaco-5000": "/img/TINACOS/atlantis/208.png", }, AtlantisMax: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/atlantis/216.png", "tinaco-5000": "/img/TINACOS/atlantis/218.png", }, AtlantisTouch: { "tinaco-1100": "/img/TINACOS/atlantis/206.png", "tinaco-2500": "/img/TINACOS/atlantis/207.png", "tinaco-5000": "/img/TINACOS/atlantis/208.png", }, AtlantisMaxTouch: { "tinaco-2500-1100": "/img/TINACOS/atlantis/216.png", "tinaco-5000-2500": "/img/TINACOS/atlantis/217.png", "tinaco-2500": "/img/TINACOS/atlantis/216.png", "tinaco-5000": "/img/TINACOS/atlantis/218.png", }, };
const MODEL_DEFAULT_IMAGES = { AtlantisTouch: "/img/TINACOS/atlantis/201.png", AtlantisMaxTouch: "/img/TINACOS/atlantis/209.png", Atlantis: "/img/TINACOS/atlantis/201.png", AtlantisMax: "/img/TINACOS/atlantis/209.png", };
const AGUA_ALCALINA_DEFAULT_IMAGES = { AtlantisTouch: "/img/TINACOS/atlantis/205.png", AtlantisMaxTouch: "/img/TINACOS/atlantis/214.png", Atlantis: "/img/TINACOS/atlantis/205.png", AtlantisMax: "/img/TINACOS/atlantis/214.png", };
const ATLANTIS_SECONDARY_IMAGES = { Atlantis: "/img/vending/ATLANTIS300MAX.png", AtlantisMax: "/img/vending/ATLANTIS300MAX.png", AtlantisTouch: "/img/vending/atlantistouchvending.jpg", AtlantisMaxTouch: "/img/vending/atlantistouchvending.jpg", };
const ATLANTIS_SECONDARY_ALCALINA_IMAGES = {};

async function main() {
  console.log("Iniciando el proceso de semilla...");

  // 1. Limpiar datos antiguos del configurador para evitar conflictos
  console.log("Limpiando tablas del configurador...");
  await prisma.configurationImage.deleteMany({});
  await prisma.modelExtra.deleteMany({});
  await prisma.extra.deleteMany({});
  await prisma.machineModel.deleteMany({});
  console.log("Tablas limpiadas.");

  // 2. Crear todos los MachineModel
  console.log("Creando modelos de máquinas...");
  const modelData = Object.keys(extrasPorMaquina).map(slug => {
      let name = slug.replace(/([A-Z])/g, ' $1').trim(); // 'NeptunoAPlus' -> 'Neptuno A Plus'
      if (slug === 'NeptunoAPlus') name = 'Neptuno A-Plus';
      if (slug === 'Vending5') name = 'Vending 5 Productos';
      if (slug === 'Vending8') name = 'Vending 8 Productos';

      return {
          slug: slug,
          name: name,
          supportsTinacos: !['Vending5', 'Vending8'].includes(slug),
          isAtlantis: slug.toLowerCase().includes('atlantis'),
      };
  });
  await prisma.machineModel.createMany({ data: modelData });
  console.log(`${modelData.length} modelos de máquina creados.`);

  // 3. Recopilar y crear todos los Extras únicos
  console.log("Creando extras...");
  const allExtrasMap = new Map();
  Object.values(extrasPorMaquina).flat().forEach(extra => {
      if (!allExtrasMap.has(extra.id)) {
          allExtrasMap.set(extra.id, {
              code: extra.id,
              name: extra.nombre,
              description: extra.descripcion || '',
              basePrice: extra.precio,
              isTinaco: extra.id.includes('tinaco'),
              tinacoKey: extra.id.includes('tinaco') ? extra.id : null,
              tinacoCapacityLiters: extra.id.includes('1100') ? 1100 : (extra.id.includes('2500') ? 2500 : (extra.id.includes('5000') ? 5000 : null)),
          });
      }
  });
  const extrasData = Array.from(allExtrasMap.values());
  await prisma.extra.createMany({ data: extrasData });
  console.log(`${extrasData.length} extras creados.`);

  // 4. Crear las asociaciones ModelExtra
  console.log("Asociando extras a modelos...");
  const allDbModels = await prisma.machineModel.findMany();
  const allDbExtras = await prisma.extra.findMany();

  for (const model of allDbModels) {
      const extrasForThisModel = extrasPorMaquina[model.slug] || [];
      for (const extra of extrasForThisModel) {
          const dbExtra = allDbExtras.find(e => e.code === extra.id);
          if (dbExtra) {
              await prisma.modelExtra.create({
                  data: {
                      modelId: model.id,
                      extraId: dbExtra.id,
                      priceOverride: extra.precio, // Usamos el precio específico de la asociación
                  }
              });
          }
      }
  }
  console.log("Asociaciones creadas.");

  // 5. Crear las imágenes de configuración
  console.log("Creando imágenes de configuración...");
  const imageCreationPromises = [];

  const processImageObject = (imgObject, context, onlyWhenAlcalina = false) => {
    for (const [modelSlug, urlOrSubObject] of Object.entries(imgObject)) {
        const model = allDbModels.find(m => m.slug === modelSlug);
        if (!model) continue;
        
        if (typeof urlOrSubObject === 'string') { // Caso: MODEL_DEFAULT_IMAGES
            imageCreationPromises.push(prisma.configurationImage.create({ data: { modelId: model.id, url: urlOrSubObject, context, alt: `${model.name} ${context}`, onlyWhenAlcalina } }));
        } else { // Caso: TINACO_IMAGES
            for (const [tinacoCode, url] of Object.entries(urlOrSubObject)) {
                const tinacoExtra = allDbExtras.find(e => e.code === tinacoCode);
                imageCreationPromises.push(prisma.configurationImage.create({ data: { modelId: model.id, tinacoExtraId: tinacoExtra?.id, url, context, alt: `${model.name} con ${tinacoExtra?.name || tinacoCode}`, onlyWhenAlcalina } }));
            }
        }
    }
  };

  processImageObject(TINACO_IMAGES, 'TINACO');
  processImageObject(TINACO_ALCALINA_IMAGES, 'TINACO_ALCALINA', true);
  processImageObject(MODEL_DEFAULT_IMAGES, 'MODEL_BASE');
  processImageObject(AGUA_ALCALINA_DEFAULT_IMAGES, 'MODEL_BASE_ALCALINA', true);
  processImageObject(ATLANTIS_SECONDARY_IMAGES, 'SECONDARY');
  processImageObject(ATLANTIS_SECONDARY_ALCALINA_IMAGES, 'SECONDARY_ALCALINA', true);
  
  await Promise.all(imageCreationPromises);
  console.log(`${imageCreationPromises.length} imágenes de configuración creadas.`);

  // --- MANTENER LA SEMILLA DE ADMINS Y USUARIOS DE PRUEBA ---
  console.log("Creando/actualizando usuarios administradores...");
  const admins = [
    { email: "admin@tutienda.com", name: "Maximiliano de la Torre", password: "admin123" },
    { email: "e.axel12@gmail.com", name: "Axel", password: "administrador123" },
    { email: "rivehect5@gmail.com", name: "Hector", password: "admin123" },
  ];
  for (const admin of admins) {
    const hash = await bcrypt.hash(admin.password, 10);
    await prisma.adminUser.upsert({ where: { email: admin.email }, update: {}, create: { email: admin.email, name: admin.name, passwordHash: hash } });
  }
  console.log(`${admins.length} administradores procesados.`);
  
  console.log("Proceso de semilla completado con éxito.");
}

main()
  .catch((e) => {
    console.error("Ha ocurrido un error durante el proceso de semilla:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });