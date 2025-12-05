import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// --- DATOS ORIGINALES DE Step3ExtrasConfigurator.jsx (Extras) ---
const hardcodedStep3Extras = {
  Neptuno: [{ id: "tinaco-1100", nombre: "2 Tinacos 1100L", descripcion: "Para almacenamiento", precio: 1100 },{ id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },{ id: "tinaco-5000", nombre: "1 Tinaco 5000L", descripcion: "Para almacenamiento", precio: 10500 },{ id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  NeptunoAPlus: [{ id: "tinaco-1100", nombre: "2 Tinacos 1100L", descripcion: "Para almacenamiento", precio: 1100 },{ id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },{ id: "tinaco-5000", nombre: "2 Tinacos 5000L", precio: 21000 },{ id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  Atlantis: [{ id: "tinaco-1100", nombre: "2 Tinacos 1100L", descripcion: "Para almacenamiento", precio: 1100 },{ id: "tinaco-2500", nombre: "1 Tinaco 2500L", descripcion: "Para almacenamiento", precio: 10500 },{ id: "tinaco-5000", nombre: "1 Tinaco 5000L", precio: 21000 },{ id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  AtlantisMax: [{ id: "tinaco-1100", nombre: "2 Tinacos 1100L", descripcion: "Para almacenamiento", precio: 1100 },{ id: "tinaco-2500", nombre: "2 Tinacos 2500L", descripcion: "Para almacenamiento", precio: 10500 },{ id: "tinaco-5000", nombre: "2 Tinacos 5000L", precio: 21000 },{ id: "agua-alcalina", nombre: "Agua alcalina", descripcion: "Sistema de producción de agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", descripcion: "Plan de mantenimiento anual", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  AtlantisTouch: [{ id: "tinaco-1100", nombre: "1 Tinaco 1100L", precio: 1100 },{ id: "tinaco-2500", nombre: "1 Tinaco 2500L", precio: 10500 },{ id: "tinaco-5000", nombre: "1 Tinaco 5000L", precio: 21000 },{ id: "agua-alcalina", nombre: "Agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  AtlantisMaxTouch: [{ id: "tinaco-2500-1100", nombre: "1 Tinaco 2500L + 1 Tinaco 1100L", precio: 1100 },{ id: "tinaco-2500", nombre: "2 Tinacos 2500L", precio: 10500 },{ id: "tinaco-5000-2500", nombre: "1 Tinaco 5000L + 1 Tinaco 2500L", precio: 1100 },{ id: "agua-alcalina", nombre: "Agua alcalina", precio: 12000 },{ id: "Tramites", nombre: "Permisos, Trámites y Requerimientos", precio: 3500 },{ id: "Kit", nombre: "Insumos anuales", precio: 4500 },{ id: "Plan", nombre: "Plan de mantenimiento ", precio: 4500 },{ id: "Seguro-Anual", nombre: "Seguro Anual", precio: 5800 }],
  Vending5: [{ id: "permisos", nombre: "Permisos y Trámites", precio: 3000 },{ id: "Volantes", nombre: "Volantes publicitarios", precio: 1500 },{ id: "limpieza", nombre: "5 bidones de 20 Litros", precio: 3000 }],
  Vending8: [{ id: "permisos", nombre: "Permisos y Trámites", precio: 3000 },{ id: "Volantes", nombre: "Volantes publicitarios", precio: 1500 },{ id: "limpieza", nombre: "8 bidones de 20 Litros", precio: 3000 },{ id: "Rack", nombre: "Rack para bidones ", precio: 8000 }],
};
const hardcodedImages = { // Agrupación de todas las imágenes hardcodeadas
  TINACO_IMAGES: { default: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/0035.png", "tinaco-5000": "/img/TINACOS/0036.png", }, Neptuno: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/0035.png", "tinaco-5000": "/img/TINACOS/0036.png", }, NeptunoAPlus: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/0026.png", "tinaco-5000": "/img/TINACOS/0028.png", }, Atlantis: { "tinaco-1100": "/img/TINACOS/atlantis/202.png", "tinaco-2500": "/img/TINACOS/atlantis/203.png", "tinaco-5000": "/img/TINACOS/atlantis/204.png", }, AtlantisMax: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/atlantis/211.png", "tinaco-5000": "/img/TINACOS/atlantis/213.png", }, AtlantisTouch: { "tinaco-1100": "/img/TINACOS/atlantis/202.png", "tinaco-2500": "/img/TINACOS/atlantis/203.png", "tinaco-5000": "/img/TINACOS/atlantis/204.png", }, AtlantisMaxTouch: { "tinaco-2500-1100": "/img/TINACOS/atlantis/210.png", "tinaco-5000-2500": "/img/TINACOS/atlantis/212.png", "tinaco-2500": "/img/TINACOS/atlantis/211.png", "tinaco-5000": "/img/TINACOS/atlantis/213.png", }, },
  TINACO_ALCALINA_IMAGES: { default: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/alcalina/207.png", "tinaco-5000": "/img/TINACOS/0036-alcalina.png", }, Neptuno: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/alcalina/231.png", "tinaco-5000": "/img/TINACOS/alcalina/232.png", }, NeptunoAPlus: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/alcalina/221.png", "tinaco-5000": "/img/TINACOS/alcalina/223.png", }, Atlantis: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/atlantis/207.png", "tinaco-5000": "/img/TINACOS/atlantis/208.png", }, AtlantisMax: { "tinaco-1100": "/img/TINACOS/0035.png", "tinaco-2500": "/img/TINACOS/atlantis/216.png", "tinaco-5000": "/img/TINACOS/atlantis/218.png", }, AtlantisTouch: { "tinaco-1100": "/img/TINACOS/atlantis/206.png", "tinaco-2500": "/img/TINACOS/atlantis/207.png", "tinaco-5000": "/img/TINACOS/atlantis/208.png", }, AtlantisMaxTouch: { "tinaco-2500-1100": "/img/TINACOS/atlantis/216.png", "tinaco-5000-2500": "/img/TINACOS/atlantis/217.png", "tinaco-2500": "/img/TINACOS/atlantis/216.png", "tinaco-5000": "/img/TINACOS/atlantis/218.png", }, },
  MODEL_DEFAULT_IMAGES: { AtlantisTouch: "/img/TINACOS/atlantis/201.png", AtlantisMaxTouch: "/img/TINACOS/atlantis/209.png", Atlantis: "/img/TINACOS/atlantis/201.png", AtlantisMax: "/img/TINACOS/atlantis/209.png", },
  AGUA_ALCALINA_DEFAULT_IMAGES: { AtlantisTouch: "/img/TINACOS/atlantis/205.png", AtlantisMaxTouch: "/img/TINACOS/atlantis/214.png", Atlantis: "/img/TINACOS/atlantis/205.png", AtlantisMax: "/img/TINACOS/atlantis/214.png", },
  ATLANTIS_SECONDARY_IMAGES: { Atlantis: "/img/vending/ATLANTIS300MAX.png", AtlantisMax: "/img/vending/ATLANTIS300MAX.png", AtlantisTouch: "/img/vending/atlantistouchvending.jpg", AtlantisMaxTouch: "/img/vending/atlantistouchvending.jpg", },
  ATLANTIS_SECONDARY_ALCALINA_IMAGES: {},
};

// --- DATOS ORIGINALES DE WizardGeneral.jsx ---
const hardcodedWizardGeneralConfiguraciones = {
  Purificadora: [
    { id: "Neptuno", nombre: "Mostrador Tradicional", descripcion: "Agua purificada", precio: 52950 },
    { id: "NeptunoAPlus", nombre: "Mostrador Osmosis inversa", descripcion: "Osmosis inversa", precio: 80950 },
  ],
  Vending: [
    { id: "Atlantis", nombre: "Atlantis", descripcion: "Agua purificada", precio: 54950 },
    { id: "AtlantisMax", nombre: "Atlantis Max", descripcion: "Premium con osmosis inversa", precio: 82000 },
    { id: "AtlantisTouch", nombre: "Atlantis Touch", descripcion: "Agua purificada con pantalla táctil", precio: 64950 },
    { id: "AtlantisMaxTouch", nombre: "Atlantis Max Touch", descripcion: "Premium con osmosis inversa y pantalla táctil", precio: 92950 },
  ],
  "Vending-Limpieza": [
    { id: "Vending5", nombre: "Darmax Clean", descripcion: "Limpieza de 5 productos", precio: 34950 },
    { id: "Vending8", nombre: "Darmax Clean", descripcion: "Limpieza de 8 productos", precio: 44950 },
  ],
};
const hardcodedWizardGeneralImagenesCarrusel = {
  Purificadora: [
    "/img/TINACOS/0035.png",
    "/img/purificadoras/MOSTRADOR%20NEPTUNO%20A-PLUS/PURI%20MAS%20ALCALINA%20PROCS.jpg",
    "/img/purificadoras/MOSTRADOR%20POSEIDON%20PRO/OSMOSIS%20MAS%20ALCALINA%20PROCS.jpg",
  ],
  "Vending-Limpieza": [
    "/img/vending/5productos.jpg",
    "/img/vending/9productos.jpeg",
    "/img/limpieza3.png",
  ],
};
const hardcodedWizardGeneralVENDING_IMAGES = {
  Tradicional: [
    "/img/vending/ATLANTIS300MAX.png",
    "/img/vending/ATLANTIS300MAX.png",
  ],
  Touch: [
    "/img/vending/atlantistouchvending.jpg",
    "/img/vending/TOUCHAGUA.png",
    "/img/vending/TOUCHAGUA.png",
  ],
};
const hardcodedWizardGeneralImagenesCarruselPorModelo = {
  Neptuno: [ "/img/TINACOS/0033.png", ],
  NeptunoAPlus: [ "/img/TINACOS/0024.png", ],
  Atlantis: [ "/img/vending/ATLANTIS300MAX.png", ],
  AtlantisMax: [ "/img/vending/ATLANTIS300MAX.png", ],
  AtlantisTouch: [ "/img/vending/atlantistouchvending.jpg", "/img/vending/TOUCHAGUA.png", ],
  AtlantisMaxTouch: [ "/img/vending/TOUCHAGUA.png", "/img/vending/atlantistouchvending.jpg", ],
  Vending5: ["/img/vending/5productos.jpg", "/img/vending/productoslimpieza5.png"],
  Vending8: ["/img/vending/9productos.jpeg", "/img/vending/productoslimpieza8.png"],
};

// --- DATOS ORIGINALES DE Step2ModelDetails.jsx ---
const hardcodedStep2ModelDetailsCaracteristicasPorModelo = {
  Atlantis: [
    "500 garrafones por mes", "Filtrado por carbón activado", "Sistema UV incluido", "Bajo consumo energético", "Bomba 3/4 HP en acero inoxidable", "Presurizador automático", "Filtro de lecho profundo con gravas, arenas sílicas y zeolita (NSF)", "Filtro de carbón activado (NSF)", "Filtro suavizador con resina catiónica (NSF)", "Tanque de salmuera", 'Portafiltro 10" Slim con cartucho polyspun', "Lámpara UV de 16 LPM con balastro en acero inoxidable", "Generador de ozono + ventury 3/4", "Despachador automático 4 modalidades (1L, 4L, 10L, 20L)", "Sensor de flujo, enjuague de garrafón y luz interna", "Pantalla con sistema de botones y sensado de litros", "Monedero antirrobo con sistema de cambio", "Vinil personalizable",
  ],
  AtlantisMax: [
    "800 garrafones por mes", "Ósmosis inversa con bomba multietapas especial", "Filtro lecho profundo + carbón + suavizador (NSF)", '2 portafiltros polyspun (20” y 10” Slim)', "UV de 16 LPM + generador de ozono + ventury 3/4", "Despachador automático 4 modalidades", "Pantalla de botones, sensor de flujo y luz interna", "Monedero antirrobo con cambio", "Vinil personalizable",
  ],
  AtlantisTouch: [
    "500 garrafones por mes", "Sistema completo de purificación + UV + ozono", "Gabinete de acero grado alimenticio", "Pantalla TOUCH interactiva de 8 pulgadas", "Despachador con 4 modalidades (1L, 4L, 10L, 20L)", "Sensado de litros, enjuague de garrafón", "Sensor de flujo, luz interna, 2 solenoides", "Monedero antirrobo con cambio", "Dispensador de tapas", "Marco en acero inoxidable", "Sistema de verificación de fallas", "Vinil personalizable contra luz UV",
  ],
  AtlantisMaxTouch: [
    "800 garrafones por mes", "Ósmosis inversa de alta producción", "Pantalla TOUCH interactiva de 8 pulgadas", "Gabinete de acero grado alimenticio", "Filtro lecho profundo, carbón activado y suavizador (NSF)", "UV 16 LPM + ozono + ventury", '2 portafiltros polyspun (20” y 10” Slim)', "Despachador automático 4 modalidades", "Monedero antirrobo con cambio", "Sensado de litros, luz interna, fallas, dispensador de tapas", "Vinil UV personalizado",
  ],
  Neptuno: [
    "Bomba de 1/2 hp", "Presurizador automático", "Filtro de lecho profundo 10x54 (gravas, arenas sílicas, zeolita con certificación NSF)", "Filtro de carbón activado 10x54 (certificación NSF)", "Filtro suavizador 10x54 con resina catiónica (NSF), válvula manual 5 pasos", "Tanque de salmuera", 'Portafiltro 10” Slim con cartucho polyspun', "Lámpara UV de 16 LPM con balastro en acero inoxidable", "Ventury de 3/4", "Generador de ozono", "Tarja de acero inoxidable (2 lavados internos, 2 externos, 2 llenados)",
  ],
  NeptunoAPlus: [
    "Bomba de 1/2 hp", "Presurizador automático", "Filtro de lecho profundo 10x54 (gravas, arenas sílicas, zeolita con certificación NSF)", "Filtro de carbón activado 10x54 (certificación NSF)", "Filtro suavizador 10x54 con resina catiónica (NSF), válvula manual 5 pasos", "Tanque de salmuera", "Filtro alcalino", 'Portafiltro 10” Slim con cartucho polyspun', "Lámpara UV de 16 LPM con balastro en acero inoxidable", "Ventury de 3/4", "Generador de ozono", "Tarja de acero inoxidable (2 lavados internos, 2 externos, 2 llenados)",
  ],
  Vending5: [
    "Para 5 productos de limpieza", "Estructura 100% acero inoxidable calibre 18", "Vinil con acabado industrial", "Mangueras, conexiones, bombas y conectores incluidos", "Gabinete de acero inoxidable con llave (protección del dinero)", "Pantalla de servicio y botones de servicio", "Monedero: acepta monedas de $1, $2, $5 y $10 MXN y da cambio", "Registra ventas", "Fácil de operar", "Pantalla inicial", "Sensado de litros", "Llenado de 1 litro", "Precios de llenado configurables", "Luz interna", "Asesoría por videollamada para instalación (no incluye instalación)"
  ],
  Vending8: [
    "Para 8 productos de limpieza", "Estructura 100% acero inoxidable calibre 18", "Vinil con acabado industrial", "Mangueras, conexiones, bombas y conectores incluidos", "Gabinete de acero inoxidable con llave (protección del dinero)", "Pantalla de servicio y botones de servicio", "Monedero: acepta monedas de $1, $2, $5 y $10 MXN y da cambio", "Registra ventas", "Fácil de operar", "Pantalla inicial", "Sensado de litros", "Llenado de 1 litro", "Precios de llenado configurables", "Luz interna", "Asesoría por videollamada para instalación (no incluye instalación)"
  ],
};

// --- DATOS ORIGINALES DE Step0SelectVendingType.jsx ---
const hardcodedStep0SelectVendingTypeOpciones = [
  { id: "Touch", nombre: "Vending Touch", descripcion: "Pantalla digital con sistema moderno.", imagen: "/img/vending/TOUCHAGUA.png", },
  { id: "Tradicional", nombre: "Vending Tradicional", descripcion: "Máquina básica de botones.", imagen: "/img/vending/ATLANTIS300MAX.png", },
];


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
  const modelData = [];

  // Recopilar todos los modelos de las configuraciones hardcodeadas
  const allHardcodedModels = [
    ...(hardcodedWizardGeneralConfiguraciones.Purificadora || []),
    ...(hardcodedWizardGeneralConfiguraciones.Vending || []),
    ...(hardcodedWizardGeneralConfiguraciones["Vending-Limpieza"] || []),
  ];

  for (const modelConfig of allHardcodedModels) {
    const slug = modelConfig.id;
    const name = modelConfig.nombre;
    const description = modelConfig.descripcion;
    const basePrice = modelConfig.precio;
    const features = hardcodedStep2ModelDetailsCaracteristicasPorModelo[slug] || [];
    
    let vendingType = 'NONE';
    if (slug.toLowerCase().includes('atlantis')) {
        if (slug.toLowerCase().includes('touch')) {
            vendingType = 'TOUCH';
        } else {
            vendingType = 'TRADICIONAL';
        }
    } else if (slug.toLowerCase().includes('vending')) {
        vendingType = 'TRADICIONAL'; // Vending de limpieza se considera tradicional por ahora
    }

    modelData.push({
        slug,
        name,
        description,
        basePrice,
        features,
        supportsTinacos: !['Vending5', 'Vending8'].includes(slug),
        isAtlantis: slug.toLowerCase().includes('atlantis'),
        vendingType,
    });
  }

  await prisma.machineModel.createMany({ data: modelData });
  console.log(`${modelData.length} modelos de máquina creados.`);

  // 3. Recopilar y crear todos los Extras únicos
  console.log("Creando extras...");
  const allExtrasMap = new Map();
  Object.values(hardcodedStep3Extras).flat().forEach(extra => { // Usar hardcodedStep3Extras
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
      const extrasForThisModel = hardcodedStep3Extras[model.slug] || []; // Usar hardcodedStep3Extras
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

  const processImageObject = (imgObject, context, onlyWhenAlcalina = false, isSecondary = false) => {
    for (const [modelSlug, urlOrSubObject] of Object.entries(imgObject)) {
        const model = allDbModels.find(m => m.slug === modelSlug);
        if (!model) continue;
        
        const commonData = { modelId: model.id, context, onlyWhenAlcalina, isSecondary };

        if (typeof urlOrSubObject === 'string') { // Caso: MODEL_DEFAULT_IMAGES
            imageCreationPromises.push(prisma.configurationImage.create({ 
                data: { ...commonData, url: urlOrSubObject, alt: `${model.name} ${context}` } 
            }));
        } else { // Caso: TINACO_IMAGES
            for (const [tinacoCode, url] of Object.entries(urlOrSubObject)) {
                const tinacoExtra = allDbExtras.find(e => e.code === tinacoCode);
                imageCreationPromises.push(prisma.configurationImage.create({ 
                    data: { ...commonData, tinacoExtraId: tinacoExtra?.id, url, alt: `${model.name} con ${tinacoExtra?.name || tinacoCode}` } 
                }));
            }
        }
    }
  };

  processImageObject(hardcodedImages.TINACO_IMAGES, 'TINACO');
  processImageObject(hardcodedImages.TINACO_ALCALINA_IMAGES, 'TINACO_ALCALINA', true);
  processImageObject(hardcodedImages.MODEL_DEFAULT_IMAGES, 'MODEL_BASE');
  processImageObject(hardcodedImages.AGUA_ALCALINA_DEFAULT_IMAGES, 'MODEL_BASE_ALCALINA', true);
  processImageObject(hardcodedImages.ATLANTIS_SECONDARY_IMAGES, 'SECONDARY', false, true);
  processImageObject(hardcodedImages.ATLANTIS_SECONDARY_ALCALINA_IMAGES, 'SECONDARY_ALCALINA', true, true);

  // Imágenes de Carrusel para Step0/Step1
  // hardcodedWizardGeneralImagenesCarrusel (general por categoría)
  // hardcodedWizardGeneralVENDING_IMAGES (por tipo de vending)
  // hardcodedWizardGeneralImagenesCarruselPorModelo (por modelo específico)

  // Estas son las que se muestran en el Step1SelectModel como `landingImages`.
  // Necesitamos una manera de agruparlas por tipo de vending o categoría principal.
  // Por ahora, solo seedearé las de `hardcodedWizardGeneralImagenesCarruselPorModelo` con `CAROUSEL` context
  // y las de `hardcodedWizardGeneralImagenesCarrusel` las podemos poner con un context genérico de CATEGORY_CAROUSEL
  // O mejor, una nueva tabla para tipos de vending si se requiere más complejidad.
  // Por el momento, vincularemos las de `hardcodedWizardGeneralImagenesCarruselPorModelo` y
  // `hardcodedWizardGeneralImagenesCarrusel` a los modelos si es posible o como imágenes generales de carrusel.

  // Imágenes de carrusel por modelo
  for (const modelSlug in hardcodedWizardGeneralImagenesCarruselPorModelo) {
      const model = allDbModels.find(m => m.slug === modelSlug);
      if (!model) continue;
      const images = hardcodedWizardGeneralImagenesCarruselPorModelo[modelSlug];
      for (const url of images) {
          imageCreationPromises.push(prisma.configurationImage.create({
              data: {
                  modelId: model.id,
                  context: 'CAROUSEL', // Nuevo contexto
                  url: url,
                  alt: `${model.name} carrusel`,
                  priority: 0,
              }
          }));
      }
  }

  // Imágenes de carrusel generales (por categoría, ej. Purificadora)
  for (const categoryId in hardcodedWizardGeneralImagenesCarrusel) {
      const images = hardcodedWizardGeneralImagenesCarrusel[categoryId];
      // Aquí no hay un modelId directo, así que podríamos asociarlas a un model "dummy" si existiera
      // O simplemente, para las imágenes de Step0/Step1 que son más de "presentación",
      // la lógica del frontend seguirá siendo algo custom o requeriría un modelo Category.
      // Por ahora, mantendremos la lógica del frontend para estos carruseles de categorías.
      // Solo seedearé las que tengan un `modelId`.
  }
  
  // VENDING_IMAGES de WizardGeneral son para el Step0, no tienen modelId directo
  // y se basan en el `vendingType`. Estas quedan hardcodeadas en el frontend por ahora,
  // ya que la estructura actual de ImageContext no las mapea bien sin más cambios en el esquema.


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