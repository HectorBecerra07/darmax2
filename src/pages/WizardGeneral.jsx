// WizardGeneral.jsx
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Step0SelectVendingType from "../components/Step0SelectVendingType";
import Step1SelectModel from "../components/Step1SelectModel";
import Step2ModelDetails from "../components/Step2ModelDetails";
import Step3ExtrasConfigurator from "../components/Step3ExtrasConfigurator";
import Step4Summary from "../components/Step4Summary";
import CarouselImages from "../components/CarouselImages";

/* =========================
   IMÁGENES BASE POR CATEGORÍA
   (Purificadora y Vending-Limpieza se quedan igual)
========================= */
const imagenesCarrusel = {
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



const VENDING_IMAGES = {
  Tradicional: [
    "/img/vending/ATLANTIS300MAX.png",       // Atlantis / AtlantisMax tradicionales
    "/img/vending/ATLANTIS300MAX.png",
  ],
  Touch: [
    "/img/vending/atlantistouchvending.jpg",  // AtlantisTouch
    "/img/vending/TOUCHAGUA.png",             // AtlantisMaxTouch (o genérica touch)
    "/img/vending/TOUCHAGUA.png", 
  ],
};


const imagenesCarruselPorModelo = {
  // Tradicionales
  Neptuno: [
    "/img/TINACOS/0033.png",
  ],
  NeptunoAPlus: [
    "/img/TINACOS/0024.png",
  ],

  Atlantis: [
    "/img/vending/ATLANTIS300MAX.png",
  ],
  AtlantisMax: [
    "/img/vending/ATLANTIS300MAX.png",
  ],
  // Touch
  AtlantisTouch: [
    "/img/vending/atlantistouchvending.jpg",
    "/img/vending/TOUCHAGUA.png",
  ],
  AtlantisMaxTouch: [
    "/img/vending/TOUCHAGUA.png",
    "/img/vending/atlantistouchvending.jpg",
  ],
  // Limpieza (por si usas estos ids de modelo)
  Vending5: ["/img/vending/5productos.jpg", "/img/vending/productoslimpieza5.png"],
  Vending8: ["/img/vending/9productos.jpeg", "/img/vending/productoslimpieza8.png"],
};

const configuraciones = {
  Purificadora: [
    { id: "Neptuno", nombre: "Mostrador Tardicional", descripcion: "Agua purificada", precio: 52950 },
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

export default function WizardGeneral() {
  const { id } = useParams();
  const [step, setStep] = useState(id === "Vending" ? 0 : 1);
  const [vendingType, setVendingType] = useState(id !== "Vending" ? "None" : null); // "Tradicional" | "Touch" | null
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [extraTouchPrice, setExtraTouchPrice] = useState(0);
  const [extrasPrice, setExtrasPrice] = useState(0);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

  const modelos =
    configuraciones[id]?.filter((m) => {
      if (id !== "Vending") return true;
      const esTouch = m.id.toLowerCase().includes("touch");
      return vendingType === "Touch" ? esTouch : !esTouch;
    }) || [];

  /* =========================
     IMÁGENES PARA EL PASO 1
     - Si NO es Vending: usa categoria normal
     - Si es Vending:
        * antes de elegir tipo → muestra una mezcla (Tradicional + Touch)
        * si eligen Tradicional → solo tradicionales
        * si eligen Touch → solo touch
  ========================= */
  const landingImages = useMemo(() => {
    if (id !== "Vending") return imagenesCarrusel[id] || [];
    if (vendingType === "Tradicional") return VENDING_IMAGES.Tradicional;
    if (vendingType === "Touch") return VENDING_IMAGES.Touch;
    // antes de elegir: muestra algo de ambos
    return [...VENDING_IMAGES.Tradicional, ...VENDING_IMAGES.Touch];
  }, [id, vendingType]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
    >
      {id === "Vending" && step === 0 && (
        <div className="col-span-2">
          <Step0SelectVendingType
            onSelect={(type) => {
              setVendingType(type);          // "Tradicional" | "Touch"
              setSelectedModel(null);
              setSelectedExtras([]);
              setExtraTouchPrice(type === "Touch" ? 10000 : 0); // tu lógica existente
              setStep(1);
            }}
          />
        </div>
      )}

      {step === 1 && (
        <>
          <div className="space-y-10">
            {/* ⬇️ Aquí ya se respeta touch vs tradicional */}
            <CarouselImages images={landingImages} />
          </div>
          <div>
            <Step1SelectModel
              modelos={modelos}
              vendingType={vendingType}
              onSelect={setSelectedModel}
              onNext={nextStep}
            />
          </div>
        </>
      )}

      {step === 2 && selectedModel && (
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* ⬇️ Por modelo: si no hay, usa lo que se mostró en landing */}
          <CarouselImages
            images={imagenesCarruselPorModelo[selectedModel.id] || landingImages}
          />
          <div>
            <Step2ModelDetails
              modelo={selectedModel}
              vendingType={vendingType}
              onNext={(extraTouch) => {
                setExtraTouchPrice(extraTouch);
                nextStep();
              }}
              onBack={prevStep}
            />
          </div>
        </div>
      )}

      {step === 3 && selectedModel && (
        <div className="col-span-2">
          <Step3ExtrasConfigurator
            selectedModelId={selectedModel.id}
            onSelect={(extrasSeleccionados) => {
              setSelectedExtras(extrasSeleccionados);
              const totalExtras = extrasSeleccionados.reduce(
                (acc, curr) => acc + (curr.precio || 0),
                0
              );
              setExtrasPrice(totalExtras);
            }}
            onNext={nextStep}
            onBack={prevStep}
          />
        </div>
      )}

      {step === 4 && (
        <div className="col-span-2">
          <Step4Summary
            modelo={selectedModel}
            extras={selectedExtras}
            extraTouchPrice={extraTouchPrice}
            extrasPrice={extrasPrice}
            onBack={prevStep}
          />
        </div>
      )}
    </motion.div>
  );
}
