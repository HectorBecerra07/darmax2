// Archivo: Step4Summary.jsx
import React from "react";
import jsPDF from "jspdf";

const BRAND_BLUE = "#5188C9";
const BRAND_TEAL = "#03A4A4";

const caracteristicasPorModelo = {
  Atlantis: [
    "500 garrafones por mes",
    "Filtrado por carbón activado",
    "Sistema UV incluido",
    "Bajo consumo energético",
    "Bomba 3/4 HP en acero inoxidable",
    "Presurizador automático",
    "Filtro de lecho profundo con gravas, arenas sílicas y zeolita (NSF)",
    "Filtro de carbón activado (NSF)",
    "Filtro suavizador con resina catiónica (NSF)",
    "Tanque de salmuera",
    'Portafiltro 10" Slim con cartucho polyspun',
    "Lámpara UV de 16 LPM con balastro en acero inoxidable",
    "Generador de ozono + ventury 3/4",
    "Despachador automático 4 modalidades (1L, 4L, 10L, 20L)",
    "Sensor de flujo, enjuague de garrafón y luz interna",
    "Pantalla con sistema de botones y sensado de litros",
    "Monedero antirrobo con sistema de cambio",
    "Vinil personalizable",
  ],
  AtlantisMax: [
    "800 garrafones por mes",
    "Ósmosis inversa con bomba multietapas especial",
    "Filtro lecho profundo + carbón + suavizador (NSF)",
    '2 portafiltros polyspun (20” y 10” Slim)',
    "UV de 16 LPM + generador de ozono + ventury 3/4",
    "Despachador automático 4 modalidades",
    "Pantalla de botones, sensor de flujo y luz interna",
    "Monedero antirrobo con cambio",
    "Vinil personalizable",
  ],
  AtlantisTouch: [
    "500 garrafones por mes",
    "Sistema completo de purificación + UV + ozono",
    "Gabinete de acero grado alimenticio",
    "Pantalla TOUCH interactiva de 8 pulgadas",
    "Despachador con 4 modalidades (1L, 4L, 10L, 20L)",
    "Sensado de litros, enjuague de garrafón",
    "Sensor de flujo, luz interna, 2 solenoides",
    "Monedero antirrobo con cambio",
    "Dispensador de tapas",
    "Marco en acero inoxidable",
    "Sistema de verificación de fallas",
    "Vinil personalizable contra luz UV",
  ],
  AtlantisMaxTouch: [
    "800 garrafones por mes",
    "Ósmosis inversa de alta producción",
    "Pantalla TOUCH interactiva de 8 pulgadas",
    "Gabinete de acero grado alimenticio",
    "Filtro lecho profundo, carbón activado y suavizador (NSF)",
    "UV 16 LPM + ozono + ventury",
    '2 portafiltros polyspun (20” y 10” Slim)',
    "Despachador automático 4 modalidades",
    "Monedero antirrobo con cambio",
    "Sensado de litros, luz interna, fallas, dispensador de tapas",
    "Vinil UV personalizado",
  ],
  Neptuno: [
    "Bomba de 1/2 hp",
    "Presurizador automático",
    "Filtro de lecho profundo 10x54 (gravas, arenas sílicas, zeolita con certificación NSF)",
    "Filtro de carbón activado 10x54 (certificación NSF)",
    "Filtro suavizador 10x54 con resina catiónica (NSF), válvula manual 5 pasos",
    "Tanque de salmuera",
    'Portafiltro 10” Slim con cartucho polyspun',
    "Lámpara UV de 16 LPM con balastro en acero inoxidable",
    "Ventury de 3/4",
    "Generador de ozono",
    "Tarja de acero inoxidable (2 lavados internos, 2 externos, 2 llenados)",
  ],
  NeptunoAPlus: [
    "Bomba de 1/2 hp",
    "Presurizador automático",
    "Filtro de lecho profundo 10x54 (gravas, arenas sílicas, zeolita con certificación NSF)",
    "Filtro de carbón activado 10x54 (certificación NSF)",
    "Filtro suavizador 10x54 con resina catiónica (NSF), válvula manual 5 pasos",
    "Tanque de salmuera",
    "Filtro alcalino",
    'Portafiltro 10” Slim con cartucho polyspun',
    "Lámpara UV de 16 LPM con balastro en acero inoxidable",
    "Ventury de 3/4",
    "Generador de ozono",
    "Tarja de acero inoxidable (2 lavados internos, 2 externos, 2 llenados)",
  ],
  Vending5: [
    "Para 5 productos de limpieza",
    "Estructura 100% acero inoxidable calibre 18",
    "Vinil con acabado industrial",
    "Mangueras, conexiones, bombas y conectores incluidos",
    "Gabinete de acero inoxidable con llave (protección del dinero)",
    "Pantalla de servicio y botones de servicio",
    "Monedero: acepta monedas de $1, $2, $5 y $10 MXN y da cambio",
    "Registra ventas",
    "Fácil de operar",
    "Pantalla inicial",
    "Sensado de litros",
    "Llenado de 1 litro",
    "Precios de llenado configurables",
    "Luz interna",
    "Asesoría por videollamada para instalación (no incluye instalación)"
  ],
  Vending8: [
    "Para 8 productos de limpieza",
    "Estructura 100% acero inoxidable calibre 18",
    "Vinil con acabado industrial",
    "Mangueras, conexiones, bombas y conectores incluidos",
    "Gabinete de acero inoxidable con llave (protección del dinero)",
    "Pantalla de servicio y botones de servicio",
    "Monedero: acepta monedas de $1, $2, $5 y $10 MXN y da cambio",
    "Registra ventas",
    "Fácil de operar",
    "Pantalla inicial",
    "Sensado de litros",
    "Llenado de 1 litro",
    "Precios de llenado configurables",
    "Luz interna",
    "Asesoría por videollamada para instalación (no incluye instalación)"
  ],
};

/* Utilidades */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function hexToRgb(hex) {
  const s = hex.replace("#", "");
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function Step4Summary({
  modelo,
  extras,
  extraTouchPrice,
  extrasPrice,
  onBack,
}) {
  if (!modelo) return null;

  const toMoney = (n) =>
    (Number(n) || 0).toLocaleString("es-MX", { minimumFractionDigits: 0 });

  const precioExtras =
    typeof extrasPrice === "number"
      ? extrasPrice
      : extras.reduce((acc, curr) => acc + (curr.precio || 0), 0);

  const precioTotal =
    Number(modelo.precio || 0) + Number(extraTouchPrice || 0) + Number(precioExtras || 0);

  const caracteristicas = caracteristicasPorModelo[modelo.id] || [];

  /* ====== PDF con líneas que no tocan el logo + líneas inferiores ====== */
  const generarPDF = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const M = 15;

    // Carga logo
    const logo = await loadImage("/img/darmax-logo.png");
    const LOGO_W = 30;
    const LOGO_H = (logo.height / logo.width) * LOGO_W;

    // Dibuja cabecera/lineas para cada página
    const addHeader = (pageNumber = 1) => {
      // Logo
      doc.addImage(logo, "PNG", M, 10, LOGO_W, LOGO_H);

      // Info derecha
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor("#111");
      doc.text("DARMAX Agua y Tecnología", pageW - M, 14, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor("#444");
      doc.text("darmaxagua@gmail.com | 55 1965 5369", pageW - M, 20, { align: "right" });

      // === Líneas superiores SIN tocar el logo ===
      const GAP = 8; // separa las líneas del borde derecho del logo
      const xStartTop = M + LOGO_W + GAP;
      const rgbB = hexToRgb(BRAND_BLUE);
      const rgbT = hexToRgb(BRAND_TEAL);

      doc.setDrawColor(rgbB.r, rgbB.g, rgbB.b);
      doc.setLineWidth(1.2);
      doc.line(xStartTop, 32, pageW - M, 32);

      doc.setDrawColor(rgbT.r, rgbT.g, rgbT.b);
      doc.setLineWidth(0.8);
      doc.line(xStartTop, 35, pageW - M, 35);

      // === Líneas inferiores (al pie) ===
      const yBot1 = pageH - 20;
      const yBot2 = pageH - 17;

      doc.setDrawColor(rgbB.r, rgbB.g, rgbB.b);
      doc.setLineWidth(1.2);
      doc.line(M, yBot1, pageW - M, yBot1);

      doc.setDrawColor(rgbT.r, rgbT.g, rgbT.b);
      doc.setLineWidth(0.8);
      doc.line(M, yBot2, pageW - M, yBot2);

      // Número de página
      doc.setFontSize(9);
      doc.setTextColor("#888");
      doc.text(`Página ${pageNumber}`, pageW - M, pageH - 8, { align: "right" });
    };

    let y = 45; // contenido
    const maxWidth = pageW - M * 2;

    const ensureSpace = (need = 8) => {
      if (y + need > pageH - 25) {
        doc.addPage();
        addHeader(doc.getNumberOfPages());
        y = 45;
      }
    };

    const writeTitle = (text) => {
      ensureSpace(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor("#111");
      doc.text(text, pageW / 2, y, { align: "center" });
      y += 10;
    };

    const writeH2 = (text) => {
      ensureSpace(9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13.5);
      doc.setTextColor("#111");
      doc.text(text, M, y);
      y += 7;
    };

    const write = (text, { bold = false, size = 12 } = {}) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor("#111");
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        ensureSpace(6);
        doc.text(line, M, y);
        y += 6;
      });
      y += 2;
    };

    const writeBullets = (items) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      items.forEach((it) => {
        const lines = doc.splitTextToSize(`• ${it}`, maxWidth);
        lines.forEach((line) => {
          ensureSpace(6);
          doc.text(line, M, y);
          y += 6;
        });
        y += 2;
      });
      y += 2;
    };

    // Página 1
    addHeader(1);

    writeTitle("DARMAX | Cotización");

    writeH2("Modelo seleccionado:");
    write(`${modelo.nombre} — $${toMoney(modelo.precio)} MXN`, { bold: true });
    if (modelo?.descripcion) write(modelo.descripcion);

    if (caracteristicas.length > 0) {
      writeH2("Características del modelo:");
      writeBullets(caracteristicas);
    }

    writeH2("Extras seleccionados:");
    if (extras.length > 0) {
      writeBullets(extras.map((e) => `${e.nombre} — $${toMoney(e.precio)} MXN`));
    } else {
      write("No seleccionaste extras.");
    }

    writeH2("Resumen de precio:");
    write(`Precio Base: $${toMoney(modelo.precio)} MXN`);
    if (extraTouchPrice) write(`Touch: $${toMoney(extraTouchPrice)} MXN`);
    write(`Extras: $${toMoney(precioExtras)} MXN`);
    write(`Total: $${toMoney(precioTotal)} MXN`, { bold: true });

    // Agradecimiento
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#888");
    doc.text(
      "Gracias por tu preferencia — DARMAX Agua y Tecnología",
      pageW / 2,
      pageH - 8,
      { align: "center" }
    );

    doc.save("Darmax_Cotizacion.pdf");
  };

  const enviarWhatsApp = () => {
    const numero = "5519655369";
    const mensaje =
      `Hola DARMAX, ya generé mi cotización.\n` +
      `Modelo: ${modelo.nombre}\n` +
      `Total: $${toMoney(precioTotal)} MXN\n` +
      `¿Me apoyan con seguimiento?`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800">Resumen de tu Configuración</h2>

      <div className="p-6 border rounded-xl space-y-3">
        <h3 className="font-semibold text-xl">Modelo Seleccionado</h3>
        <p>
          {modelo.nombre} — $
          {toMoney(modelo.precio)} MXN
        </p>
        {modelo?.descripcion && (
          <p className="text-slate-600">{modelo.descripcion}</p>
        )}
      </div>

      {caracteristicas.length > 0 && (
        <div className="p-6 border rounded-xl space-y-3">
          <h3 className="font-semibold text-xl">Características</h3>
          <ul className="list-disc pl-5 space-y-1">
            {caracteristicas.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-6 border rounded-xl space-y-3">
        <h3 className="font-semibold text-xl">Extras Seleccionados</h3>
        {extras.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {extras.map((e) => (
              <li key={e.id}>
                {e.nombre} — ${toMoney(e.precio)} MXN
              </li>
            ))}
          </ul>
        ) : (
          <p>No seleccionaste extras.</p>
        )}
      </div>

      <div className="p-6 border rounded-xl space-y-2">
        <h3 className="font-semibold text-xl">Resumen de Precio</h3>
        <p>Precio Base: ${toMoney(modelo.precio)} MXN</p>
        {!!extraTouchPrice && <p>Touch: ${toMoney(extraTouchPrice)} MXN</p>}
        <p>Extras: ${toMoney(precioExtras)} MXN</p>
        <p className="font-bold text-2xl text-black">
          Total: ${toMoney(precioTotal)} MXN
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-800 rounded-lg px-6 py-3 hover:bg-gray-400"
        >
          ← Regresar
        </button>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={generarPDF}
            className="bg-black text-white rounded-lg px-6 py-3 hover:opacity-90 w-full"
          >
            Descargar Cotización PDF
          </button>
          <button
            onClick={enviarWhatsApp}
            className="bg-green-500 text-white rounded-lg px-6 py-3 hover:opacity-90 w-full"
          >
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
