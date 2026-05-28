// Archivo: Step4Summary.jsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { MODEL_SPECS } from "../utils/modelSpecs";

const BRAND_BLUE = "#168387"; // Usar el color corporativo

/* Utilidades */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export default function Step4Summary({
  summaryData, // Objeto completo con model, selectedExtras, displayImage, secondaryImage
  onBack,
}) {
  if (!summaryData || !summaryData.model) return null;

  const { model, selectedExtras, displayImage, secondaryImage, summaryString } = summaryData;

  // Obtener características reales del mapeo local si existe para el slug
  const modelData = MODEL_SPECS[model.slug] || {};
  const realFeatures = modelData.specs || model.features || [];
  const realRequirements = modelData.requirements || [];
  const importantNote = modelData.note || "";

  const toMoney = (n) =>
    (Number(n) || 0).toLocaleString("es-MX", { minimumFractionDigits: 0 });

  // Calcular precio de extras seleccionados
  const precioExtras = selectedExtras.reduce(
    (acc, curr) => acc + (curr.priceOverride ?? curr.extra.basePrice),
    0
  );

  const precioBaseModelo = model.basePrice ?? 0;
  const precioTotal = precioBaseModelo + precioExtras;

  /* ====== PDF con tablas y mejor formato ====== */
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
        doc.addImage(templateImage, "PNG", 0, 0, pageW, pageH);
        doc.setFontSize(8);
        doc.setTextColor("#999");
        doc.text(`Página ${pageNumber}`, pageW - 20, pageH - 8, { align: "right" });
      };

      let y = 22; // Subir el título más para que no se encime en el cuadro gris

      const ensureSpace = (need = 8) => {
        if (y + need > pageH - 30) { 
          doc.addPage();
          addHeader(doc.getNumberOfPages());
          y = 45; 
        }
      };

      // Página 1
      addHeader(1);

      // Título con salto de línea y más alto
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor("#000");
      doc.text("DARMAX", pageW / 2, y, { align: "center" });
      y += 10;
      doc.setFontSize(18);
      doc.setTextColor("#666");
      doc.text("Cotización de Equipo", pageW / 2, y, { align: "center" });
      y += 15;

      // Info del Modelo
      doc.setFontSize(14);
      doc.setTextColor("#111");
      doc.text("Modelo seleccionado:", M, y);
      y += 7;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(BRAND_BLUE);
      doc.text(`${model.name}`, M, y);
      doc.text(`$${toMoney(precioBaseModelo)} MXN`, pageW - M, y, { align: "right" });
      y += 8;

      if (model?.description) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor("#444");
        const descLines = doc.splitTextToSize(model.description, pageW - M * 2);
        doc.text(descLines, M, y);
        y += (descLines.length * 5) + 5;
      }

      // Tabla de Especificaciones
      if (realFeatures.length > 0) {
        ensureSpace(20);
        autoTable(doc, {
          startY: y,
          head: [[{ content: 'Especificaciones Técnicas', colSpan: 1 }]],
          body: realFeatures.map(f => [f]),
          theme: 'striped',
          headStyles: { fillColor: BRAND_BLUE, textColor: 255, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 2 },
          margin: { left: M, right: M }
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      // Tabla de Requerimientos
      if (realRequirements.length > 0) {
        ensureSpace(20);
        autoTable(doc, {
          startY: y,
          head: [['Requerimiento', 'Descripción']],
          body: realRequirements.map(r => [r.title, r.desc]),
          theme: 'grid',
          headStyles: { fillColor: "#333", textColor: 255 },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: { 0: { fontStyle: 'bold', width: 40 } },
          margin: { left: M, right: M }
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      // Extras
      if (selectedExtras.length > 0) {
          ensureSpace(20);
          autoTable(doc, {
            startY: y,
            head: [['Extras Adicionales', 'Precio']],
            body: selectedExtras.map(e => [e.extra.name, `$${toMoney(e.priceOverride ?? e.extra.basePrice)} MXN`]),
            theme: 'plain',
            headStyles: { textColor: "#000", fontStyle: 'bold', borderBottom: { width: 0.5, color: '#ccc' } },
            styles: { fontSize: 9 },
            columnStyles: { 1: { halign: 'right' } },
            margin: { left: M, right: M }
          });
          y = doc.lastAutoTable.finalY + 5;
      }

      // Resumen de Totales
      ensureSpace(30);
      y += 5;
      doc.setDrawColor("#eee");
      doc.line(M, y, pageW - M, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor("#555");
      doc.text("Subtotal Equipo:", M, y);
      doc.text(`$${toMoney(precioBaseModelo)} MXN`, pageW - M, y, { align: "right" });
      y += 6;
      doc.text("Total Extras:", M, y);
      doc.text(`$${toMoney(precioExtras)} MXN`, pageW - M, y, { align: "right" });
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor("#000");
      doc.text("Inversión Total:", M, y);
      doc.text(`$${toMoney(precioTotal)} MXN`, pageW - M, y, { align: "right" });
      y += 15;

      // Nota Importante
      if (importantNote) {
        ensureSpace(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor("#d97706"); // Color amber
        doc.text("Nota Importante:", M, y);
        y += 5;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor("#92400e");
        const noteLines = doc.splitTextToSize(importantNote, pageW - M * 2);
        doc.text(noteLines, M, y);
        y += (noteLines.length * 4) + 10;
      }

      // Imágenes si existen
      if (displayImage || secondaryImage) {
          try {
            if (displayImage) {
                ensureSpace(80);
                const pW = 110;
                const pX = (pageW - pW) / 2;
                const img1 = await loadImage(displayImage);
                const img1H = (img1.height / img1.width) * pW;
                doc.addImage(img1, "JPEG", pX, y, pW, img1H);
                y += img1H + 10;
            }
            if (secondaryImage) {
                ensureSpace(60);
                const sW = 70;
                const sX = (pageW - sW) / 2;
                const img2 = await loadImage(secondaryImage);
                const img2H = (img2.height / img2.width) * sW;
                doc.addImage(img2, "JPEG", sX, y, sW, img2H);
                y += img2H + 10;
            }
          } catch (e) { console.error("Error cargando imágenes para PDF:", e); }
      }

      doc.save(`Darmax_Cotizacion_${model.slug}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("No se pudo generar el PDF. Revise la consola.");
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
    <div className="space-y-8 max-w-5xl mx-auto pb-6">
      <h2 className="text-3xl font-bold text-gray-800 tracking-tighter -mt-4 sm:-mt-6">Resumen de tu Configuración</h2>

      <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tighter">{model.name}</h3>
            <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-xs">Configuración Base</p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Inversión Base</span>
            <p className="text-3xl font-black text-[#168387] tracking-tighter">${toMoney(precioBaseModelo)}</p>
          </div>
        </div>

        {model?.description && (
          <p className="text-slate-600 leading-relaxed border-l-4 border-slate-100 pl-4">{model.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="font-bold text-slate-900 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-[#168387] rounded-full" />
               Características Técnicas
            </p>
            <ul className="grid grid-cols-1 gap-2">
              {realFeatures.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
             <p className="font-bold text-slate-900 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-slate-900 rounded-full" />
               Vistas de Equipo
            </p>
            <div className="flex gap-4">
              {displayImage && (
                <div className="flex-1 aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 hover:shadow-lg transition-shadow">
                  <img src={displayImage} alt={model.name} className="max-w-full max-h-full object-contain drop-shadow-xl" />
                </div>
              )}
              {secondaryImage && (
                  <div className="flex-1 aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 hover:shadow-lg transition-shadow">
                      <img src={secondaryImage} alt="Componente" className="max-w-full max-h-full object-contain drop-shadow-xl" />
                  </div>
              )}
            </div>
          </div>
        </div>

        {realRequirements.length > 0 && (
          <div className="pt-6 border-t border-slate-50">
            <p className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-[10px]">Requerimientos de Instalación</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {realRequirements.map((r, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-[#168387] uppercase mb-1">{r.title}</p>
                  <p className="text-xs font-bold text-slate-700">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-lg shadow-slate-200/50 space-y-4">
          <h3 className="font-black text-xl text-slate-900 tracking-tighter uppercase text-sm">Extras Seleccionados</h3>
          {selectedExtras.length > 0 ? (
            <ul className="space-y-3">
              {selectedExtras.map((me) => (
                <li key={me.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-bold text-slate-700">{me.extra.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">${toMoney(me.priceOverride ?? me.extra.basePrice)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-sm italic py-4">No se han añadido componentes adicionales.</p>
          )}
        </div>

        <div className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-xl shadow-cyan-900/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-cyan-400 mb-6">Resumen de Inversión</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm opacity-60">
                <span>Equipo Base</span>
                <span className="font-bold">${toMoney(precioBaseModelo)}</span>
              </div>
              <div className="flex justify-between items-center text-sm opacity-60">
                <span>Total Extras</span>
                <span className="font-bold">${toMoney(precioExtras)}</span>
              </div>
              <div className="pt-4 border-t border-white/10 mt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 block mb-1">Inversión Total Estimada</span>
                <p className="text-4xl font-black tracking-tighter">${toMoney(precioTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {importantNote && (
        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <span className="text-amber-600 font-black">!</span>
          </div>
          <p className="text-sm text-amber-900 font-medium italic leading-relaxed">
            <strong>Nota Importante:</strong> {importantNote}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
        <button
          onClick={onBack}
          className="w-full md:w-auto px-10 py-4 text-slate-500 font-black uppercase tracking-widest text-xs hover:text-slate-900 transition-colors"
        >
          ← Regresar y Editar
        </button>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={generarPDF}
            className="group relative px-10 py-5 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300 text-xs uppercase tracking-widest flex items-center justify-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
            Descargar Cotización Premium
          </button>
          <button
            onClick={enviarWhatsApp}
            className="px-10 py-5 bg-[#25D366] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-green-500/20 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3"
          >
            WhatsApp para Seguimiento
          </button>
        </div>
      </div>
    </div>
  );
}
