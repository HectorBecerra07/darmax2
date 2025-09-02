// Archivo: WizardGeneral.jsx

import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import Step0SelectVendingType from "../components/Step0SelectVendingType";
import Step1SelectModel from "../components/Step1SelectModel";
import Step2ModelDetails from "../components/Step2ModelDetails";
import Step3ExtrasConfigurator from "../components/Step3ExtrasConfigurator";
import Step4Summary from "../components/Step4Summary";
import CarouselImages from "../components/CarouselImages";

// 🔒 Precio fijo para conversión a pantalla touch
const TOUCH_UPGRADE_PRICE = 10000;

const imagenesCarrusel = {
  Purificadora: [
    "/img/purificadoras/MOSTRADOR%20NEPTUNO/MOSTRADOR%20DE%20AGUA.jpg",
    "/img/purificadoras/MOSTRADOR%20NEPTUNO%20A-PLUS/PURI%20MAS%20ALCALINA%20PROCS.jpg",
    "/img/purificadoras/MOSTRADOR%20POSEIDON%20PRO/OSMOSIS%20MAS%20ALCALINA%20PROCS.jpg"
  ],
  Vending: [
    "/img/imgvending/vending1.jpeg",
    "/img/imgvending/vending2.webp",
    "/img/imgvending/vending3.jpg"
  ],
  "Vending-Limpieza": [
    "/img/vending/vendinglimpieza.jpg",
    "/img/vending/vendinglimpieza8.jpg",
    "/img/limpieza3.png"
  ],
};

const imagenesCarruselPorModelo = {
  Neptuno: [
    "/img/purificadoras/MOSTRADOR NEPTUNO/MOSTRADORDEAGUA.jpg",
    "/img/purificadoras/MOSTRADOR NEPTUNO/AGUAPURIFICADAPROCS.jpg",
    "/img/purificadoras/MOSTRADOR NEPTUNO/neptuno.png",
  ],
  NeptunoAPlus: [
    "/img/purificadoras/MOSTRADOR NEPTUNO A-PLUS/MOSTRADORDEAGUA2.jpg",
    "/img/purificadoras/MOSTRADOR NEPTUNO A-PLUS/PURIMASALCALINAPROCS.jpg",
    "/img/purificadoras/MOSTRADOR NEPTUNO A-PLUS/NEPTUNOAPLUS.png",
  ],
  PremiumOsmosis: [
    "/img/purificadoras/MOSTRADOR POSEIDON/AGUAOSMOSISPROCS.jpg",
    "/img/purificadoras/MOSTRADOR POSEIDON/MOSTRADORDEAGUA22.jpg",
    "/img/purificadoras/MOSTRADOR POSEIDON/poseidon.png",
  ],
  PoseidonPro: [
    "/img/purificadoras/MOSTRADOR POSEIDON PRO/MOSTRADORDEAGUA23.jpg",
    "/img/purificadoras/MOSTRADOR POSEIDON PRO/OSMOSISMASALCALINAPROCS.jpg",
    "/img/purificadoras/MOSTRADOR POSEIDON PRO/POSEIDONPRO.png",
  ],

  // Vending
  Atlantis: ["/img/imgvending/vending1.jpeg"],
  AtlantisMax: ["/img/imgvending/vending2.webp"],
  Megalodon: ["/img/imgvending/vending3.jpg"],
  MegalodonMax: ["/img/imgvending/vending2.webp"],
  AtlantisTouch: ["/img/imgvending/vending1.jpeg"],
  AtlantisMaxTouch: ["/img/imgvending/vending2.webp"],
  MegalodonTouch: ["/img/imgvending/vending3.jpg"],
  MegalodonMaxTouch: ["/img/imgvending/vending2.webp"],

  // Limpieza
  Vending5: ["/img/vending/vendinglimpieza.jpg"],
  Vending8: ["/img/vending/vendinglimpieza8.jpg", "/img/limpieza3.png"]
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
  const imagenes = imagenesCarrusel[id] || [];
  const [step, setStep] = useState(id === "Vending" ? 0 : 1);
  const [vendingType, setVendingType] = useState(id !== "Vending" ? "None" : null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [extraTouchPrice, setExtraTouchPrice] = useState(0);
  const [extrasPrice, setExtrasPrice] = useState(0);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

  const modelos = configuraciones[id]?.filter((modelo) => {
    if (id !== "Vending") return true;
    const esTouch = modelo.id.toLowerCase().includes("touch");
    return vendingType === "Touch" ? esTouch : !esTouch;
  }) || [];

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
              setVendingType(type);
              setSelectedModel(null);
              setSelectedExtras([]);
              // 👇 Si eligen "Touch", fijamos el precio extra en 10,000
              setExtraTouchPrice(type === "Touch" ? TOUCH_UPGRADE_PRICE : 0);
              setStep(1);
            }}
          />
        </div>
      )}

      {step === 1 && (
        <>
          <div className="space-y-10">
            <CarouselImages images={imagenes} />
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
          <CarouselImages images={imagenesCarruselPorModelo[selectedModel.id] || imagenes} />
          <div>
            <Step2ModelDetails
              modelo={selectedModel}
              vendingType={vendingType}
              // 🔒 Al avanzar, reforzamos el precio fijo si es Touch
              onNext={() => {
                setExtraTouchPrice(vendingType === "Touch" ? TOUCH_UPGRADE_PRICE : 0);
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
              const totalExtras = extrasSeleccionados.reduce((acc, curr) => acc + (curr.precio || 0), 0);
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
