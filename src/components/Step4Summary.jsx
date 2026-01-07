// Archivo: Step4Summary.jsx
import React from "react";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

const BRAND_BLUE = "#5188C9";
const BRAND_TEAL = "#03A4A4";

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
  summaryData, // Objeto completo con model, selectedExtras, displayImage, secondaryImage
  onBack,
}) {
  if (!summaryData || !summaryData.model) return null;

  const { model, selectedExtras, displayImage, secondaryImage, summaryString } = summaryData;

  const toMoney = (n) =>
    (Number(n) || 0).toLocaleString("es-MX", { minimumFractionDigits: 0 });

  // Calcular precio de extras seleccionados
  const precioExtras = selectedExtras.reduce(
    (acc, curr) => acc + (curr.priceOverride ?? curr.extra.basePrice),
    0
  );

  const precioBaseModelo = model.basePrice ?? 0;

  const precioTotal = precioBaseModelo + precioExtras;

  /* ====== PDF con líneas que no tocan el logo + líneas inferiores ====== */
  const generarPDF = async () => {
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const M = 15;

      // Carga la plantilla de fondo
      const templateImage = await loadImage("/img/Plantillas/coti_dar.jpg");

      // Dibuja cabecera/plantilla para cada página
      const addHeader = (pageNumber = 1) => {
        // Añade la plantilla como fondo
        doc.addImage(templateImage, "PNG", 0, 0, pageW, pageH);

        // Número de página (opcional, si no está en la plantilla)
        doc.setFontSize(9);
        doc.setTextColor("#888");
        doc.text(`Página ${pageNumber}`, pageW / 2, pageH - 8, { align: "center" });
      };

      let y = 45; // Ajustar la 'y' inicial para el contenido, dejando espacio para el encabezado de la plantilla
      const maxWidth = pageW - M * 2;

      const ensureSpace = (need = 8) => {
        // Ajustar el límite inferior para no sobreescribir el pie de página de la plantilla
        if (y + need > pageH - 25) { 
          doc.addPage();
          addHeader(doc.getNumberOfPages());
          y = 45; // Reiniciar 'y' en la nueva página
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
      write(`${model.name} — $${toMoney(precioBaseModelo)} MXN`, { bold: true });
      if (model?.description) write(model.description);

      if (model.features && model.features.length > 0) {
        writeH2("Características del modelo:");
        writeBullets(model.features);
      } 

      if (selectedExtras.length > 0) {
          writeH2("Extras seleccionados:");
          writeBullets(selectedExtras.map((me) => `${me.extra.name} — $${toMoney(me.priceOverride ?? me.extra.basePrice)} MXN`));
      } else {
          write("No seleccionaste extras.");
      }
      
      if (displayImage) {
          ensureSpace(80);
          try {
            const img = await loadImage(displayImage);
            const imgWidth = 100;
            const imgHeight = (img.height / img.width) * imgWidth;
            try {
                doc.addImage(img, "JPEG", M, y, imgWidth, imgHeight);
            } catch (addImgError) {
                console.error("Error adding image to PDF:", addImgError);
                write("  [Error al renderizar imagen]", { size: 9, bold: false });
            }
            y += imgHeight + 5;
          } catch (imgError) {
            console.error("Could not load image:", imgError);
            write("  [Imagen no disponible]", { size: 9, bold: false });
          }
      }

      writeH2("Resumen de precio:");
      write(`Precio Base: $${toMoney(precioBaseModelo)} MXN`);
      write(`Extras: $${toMoney(precioExtras)} MXN`);
      write(`Total: $${toMoney(precioTotal)} MXN`, { bold: true });

      doc.save("Darmax_Cotizacion.pdf");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("No se pudo generar el PDF. Revise la consola para más detalles.");
    }
  };

  const enviarWhatsApp = () => {
    const numero = "5519655369";
    const mensaje =
      `Hola DARMAX, ya generé mi cotización.\n` +
      `Modelo: ${model.name}\n` +
      `Total: $${toMoney(precioTotal)} MXN\n` +
      `¿Me apoyan con seguimiento?`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800">Resumen de tu Configuración</h2>

      <div className="p-6 border rounded-xl space-y-4">
        <h3 className="font-semibold text-xl text-gray-800">Modelo Seleccionado</h3>
        <p className="text-gray-700">
          <span className="font-medium">{model.name}</span> — $
          {toMoney(precioBaseModelo)} MXN
        </p>
        {model?.description && (
          <p className="text-slate-600">{model.description}</p>
        )}

        <p className="text-sm font-medium text-gray-700 mb-2">Vistas Previas:</p>
        <div className="flex flex-col md:flex-row gap-4">
          {displayImage && (
            <div className="w-full md:w-1/2">
              <img src={displayImage} alt={model.name} className="w-full h-48 object-contain border rounded-lg p-2" />
            </div>
          )}
          {secondaryImage && (
              <div className="w-full md:w-1/2">
                  <img src={secondaryImage} alt={`${model.name} componente adicional`} className="w-full h-48 object-contain border rounded-lg p-2" />
              </div>
          )}
        </div>

        {model.features && model.features.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold text-gray-800 mb-2">Características:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {model.features.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>


      <div className="p-6 border rounded-xl space-y-3">
        <h3 className="font-semibold text-xl text-gray-800">Extras Seleccionados</h3>
        {selectedExtras.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {selectedExtras.map((me) => (
              <li key={me.id}>
                {me.extra.name} — ${toMoney(me.priceOverride ?? me.extra.basePrice)} MXN
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No seleccionaste extras.</p>
        )}
      </div>

      <div className="p-6 border rounded-xl space-y-2">
        <h3 className="font-semibold text-xl text-gray-800">Resumen de Precio</h3>
        <p className="text-gray-700">Precio Base: ${toMoney(precioBaseModelo)} MXN</p>
        <p className="text-gray-700">Extras: ${toMoney(precioExtras)} MXN</p>
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
