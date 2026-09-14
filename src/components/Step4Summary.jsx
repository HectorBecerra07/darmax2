// Archivo: Step4Summary.jsx
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { MODEL_SPECS } from "../utils/modelSpecs";
import { useUser } from "../context/UserContext";
import {
  DocumentTextIcon,
  CheckBadgeIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  QrCodeIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

const BRAND_BLUE = "#168387";
const BACKEND_COTIZACIONES_URL = "/api/cotizaciones";
const EXTERNAL_COTIZACIONES_FALLBACK_URL =
  import.meta.env.VITE_COTIZACIONES_API_URL ||
  "https://ventas-darmax-gestion.vercel.app/api/external/cotizaciones";
const WHATSAPP_PHONE = "525519655369";

/* Utilidades */
const loadImageAsDataUrl = (src, maxDim = 1200, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        let { naturalWidth: width, naturalHeight: height } = img;
        if (!width || !height) {
          width = img.width || 800;
          height = img.height || 600;
        }

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Fondo blanco para manejar transparencias y evitar fondo negro en JPEG
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({ dataUrl, width, height });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });

export default function Step4Summary({
  summaryData, // Objeto completo con model, selectedExtras, displayImage, secondaryImage
  onBack,
}) {
  const { user, token } = useUser();

  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    cp: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cotizacionResult, setCotizacionResult] = useState(null);
  const [quotaError, setQuotaError] = useState(null);

  // Precargar datos del usuario autenticado si existen
  useEffect(() => {
    if (user) {
      setCliente((prev) => ({
        nombre: prev.nombre || user.nombre || user.name || "",
        telefono: prev.telefono || user.telefono || user.phone || "",
        correo: prev.correo || user.email || user.correo || "",
        cp: prev.cp || user.cp || user.codigoPostal || "",
      }));
    }
  }, [user]);

  if (!summaryData || !summaryData.model) return null;

  const { model, selectedExtras, displayImage, secondaryImage } = summaryData;

  // Caracteristicas reales del modelo
  const modelData = MODEL_SPECS[model.slug] || {};
  const realFeatures = modelData.specs || model.features || [];
  const realRequirements = modelData.requirements || [];
  const importantNote = modelData.note || "";

  const toMoney = (n) =>
    (Number(n) || 0).toLocaleString("es-MX", { minimumFractionDigits: 0 });

  // Calcular precios
  const precioExtras = selectedExtras.reduce(
    (acc, curr) => acc + (curr.priceOverride ?? curr.extra.basePrice),
    0
  );

  const precioBaseModelo = model.basePrice ?? 0;
  const precioTotal = precioBaseModelo + precioExtras;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  /* Registrar cotizacion en el servidor Darmax con limite mensual */
  const handleRegistrarCotizacion = async (e) => {
    e.preventDefault();
    setQuotaError(null);

    if (!cliente.nombre.trim()) {
      toast.error("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!cliente.telefono.trim() || cliente.telefono.replace(/\D/g, "").length < 10) {
      toast.error("Por favor ingresa un número de teléfono válido (al menos 10 dígitos).");
      return;
    }
    if (!cliente.correo.trim() || !cliente.correo.includes("@")) {
      toast.error("Por favor ingresa un correo electrónico válido.");
      return;
    }
    if (!cliente.cp.trim() || cliente.cp.trim().length < 4) {
      toast.error("Por favor ingresa tu código postal (CP).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        cliente: {
          nombre: cliente.nombre.trim(),
          telefono: cliente.telefono.trim(),
          correo: cliente.correo.trim(),
          cp: cliente.cp.trim(),
        },
        costos: {
          modeloNombre: model.name || "Equipo Darmax",
          modelo: Number(precioBaseModelo),
        },
        extrasSeleccionados: (selectedExtras || []).map((me) => ({
          id: String(me.extra?.id || me.id || ""),
          name: String(me.extra?.name || me.name || "Extra"),
          basePrice: Number(me.priceOverride ?? me.extra?.basePrice ?? 0),
        })),
        diasValidez: 7,
        nombreAsesor: "Configurador Web",
      };

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let response = await fetch(BACKEND_COTIZACIONES_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      // Si se alcanzo el limite de 3 cotizaciones mensuales
      if (response.status === 429) {
        const errorData = await response.json();
        const msg =
          errorData.message ||
          "Has alcanzado el límite de 3 cotizaciones este mes. Contáctanos directamente por WhatsApp para asistencia personalizada.";
        setQuotaError(msg);
        toast.error("Límite mensual de 3 cotizaciones alcanzado.");
        return;
      }

      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        // Fallback a API externa en caso de no disponibilidad temporal
        const fallbackRes = await fetch(EXTERNAL_COTIZACIONES_FALLBACK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await fallbackRes.json();
        if (!fallbackRes.ok || !data.success) {
          throw new Error(data.message || "Error al registrar la cotización en el servidor.");
        }
      }

      if (!data.success) {
        throw new Error(data.message || "Error al registrar la cotización en el servidor.");
      }

      setCotizacionResult(data);
      toast.success(`¡Cotización #${data.folio || ""} generada con éxito! Enviamos los detalles a tu correo.`);

      // Desplazar suavemente hacia el ticket de confirmacion
      setTimeout(() => {
        document.getElementById("ticket-cotizacion")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error al registrar cotizacion:", error);
      toast.error(error.message || "Hubo un error al generar tu cotización. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Generar enlace de WhatsApp con formato limpio y compatible */
  const buildWhatsAppUrl = () => {
    const folioText = cotizacionResult?.folio ? `#${cotizacionResult.folio}` : "Web";

    const bloques = [
      "¡Hola DARMAX! Acabo de generar mi cotización en el sitio web.",
      `Número de Cotización: ${folioText}\nCliente: ${cliente.nombre}\nTeléfono: ${cliente.telefono}\nCódigo Postal: ${cliente.cp}`,
      `Modelo: ${model.name} ($${toMoney(precioBaseModelo)} MXN)`,
    ];

    if (selectedExtras.length > 0) {
      const lineasExtras = selectedExtras.map((me) => {
        const nombreExtra = me.extra?.name || me.name || "Componente extra";
        const precioExtra = me.priceOverride ?? me.extra?.basePrice ?? 0;
        return `- ${nombreExtra}: $${toMoney(precioExtra)} MXN`;
      });
      bloques.push(`Extras Seleccionados:\n${lineasExtras.join("\n")}`);
    }

    bloques.push(`Inversión Total Estimada: $${toMoney(precioTotal)} MXN`);
    bloques.push("¿Me apoyarían con el seguimiento y detalles de entrega de mi equipo?");

    const mensajeCompleto = bloques.join("\n\n");
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(mensajeCompleto)}`;
  };

  const enviarWhatsApp = () => {
    window.open(buildWhatsAppUrl(), "_blank");
  };

  /* ====== PDF local con formato original ====== */
  const generarPDF = async () => {
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const M = 15;

      let templateData = null;
      try {
        templateData = await loadImageAsDataUrl("/img/Plantillas/coti_dar.jpg", 1200, 0.75);
      } catch (err) {
        console.warn("No se pudo cargar la plantilla de fondo para el PDF:", err);
      }

      const addHeader = (pageNumber = 1) => {
        if (templateData?.dataUrl) {
          doc.addImage(templateData.dataUrl, "JPEG", 0, 0, pageW, pageH, "bg_template", "FAST");
        }
        doc.setFontSize(8);
        doc.setTextColor("#999");
        doc.text(`Página ${pageNumber}`, pageW - 20, pageH - 8, { align: "right" });
      };

      let y = 22;

      const ensureSpace = (need = 8) => {
        if (y + need > pageH - 30) {
          doc.addPage();
          addHeader(doc.getNumberOfPages());
          y = 45;
        }
      };

      addHeader(1);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor("#000");
      doc.text("DARMAX", pageW / 2, y, { align: "center" });
      y += 10;
      doc.setFontSize(18);
      doc.setTextColor("#666");
      doc.text(
        cotizacionResult?.folio ? `Cotización #${cotizacionResult.folio}` : "Cotización de Equipo",
        pageW / 2,
        y,
        { align: "center" }
      );
      y += 15;

      // Info del Cliente si existe
      if (cliente.nombre) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(BRAND_BLUE);
        doc.text(`Cliente: ${cliente.nombre}`, M, y);
        if (cliente.cp) {
          doc.text(`C.P.: ${cliente.cp}`, pageW - M, y, { align: "right" });
        }
        y += 6;
      }

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
        y += descLines.length * 5 + 5;
      }

      if (realFeatures.length > 0) {
        ensureSpace(20);
        autoTable(doc, {
          startY: y,
          head: [[{ content: "Especificaciones Técnicas", colSpan: 1 }]],
          body: realFeatures.map((f) => [f]),
          theme: "striped",
          headStyles: { fillColor: BRAND_BLUE, textColor: 255, fontStyle: "bold" },
          styles: { fontSize: 9, cellPadding: 2 },
          margin: { left: M, right: M },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      if (realRequirements.length > 0) {
        ensureSpace(20);
        autoTable(doc, {
          startY: y,
          head: [["Requerimiento", "Descripción"]],
          body: realRequirements.map((r) => [r.title, r.desc]),
          theme: "grid",
          headStyles: { fillColor: "#333", textColor: 255 },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: { 0: { fontStyle: "bold", width: 40 } },
          margin: { left: M, right: M },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      if (selectedExtras.length > 0) {
        ensureSpace(20);
        autoTable(doc, {
          startY: y,
          head: [["Extras Adicionales", "Precio"]],
          body: selectedExtras.map((e) => [
            e.extra.name,
            `$${toMoney(e.priceOverride ?? e.extra.basePrice)} MXN`,
          ]),
          theme: "plain",
          headStyles: { textColor: "#000", fontStyle: "bold", borderBottom: { width: 0.5, color: "#ccc" } },
          styles: { fontSize: 9 },
          columnStyles: { 1: { halign: "right" } },
          margin: { left: M, right: M },
        });
        y = doc.lastAutoTable.finalY + 5;
      }

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
      doc.text("Inversión Total Estimada:", M, y);
      doc.text(`$${toMoney(precioTotal)} MXN`, pageW - M, y, { align: "right" });
      y += 15;

      if (importantNote) {
        ensureSpace(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor("#d97706");
        doc.text("Nota Importante:", M, y);
        y += 5;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor("#92400e");
        const noteLines = doc.splitTextToSize(importantNote, pageW - M * 2);
        doc.text(noteLines, M, y);
        y += noteLines.length * 4 + 10;
      }

      if (displayImage || secondaryImage) {
        if (displayImage) {
          try {
            const img1 = await loadImageAsDataUrl(displayImage, 800, 0.8);
            const pW = 110;
            const img1H = (img1.height / img1.width) * pW;
            ensureSpace(img1H + 15);
            const pX = (pageW - pW) / 2;
            doc.addImage(img1.dataUrl, "JPEG", pX, y, pW, img1H, undefined, "FAST");
            y += img1H + 10;
          } catch (e) {
            console.error("Error cargando imagen principal para PDF:", e);
          }
        }
        if (secondaryImage) {
          try {
            const img2 = await loadImageAsDataUrl(secondaryImage, 800, 0.8);
            const sW = 70;
            const img2H = (img2.height / img2.width) * sW;
            ensureSpace(img2H + 15);
            const sX = (pageW - sW) / 2;
            doc.addImage(img2.dataUrl, "JPEG", sX, y, sW, img2H, undefined, "FAST");
            y += img2H + 10;
          } catch (e) {
            console.error("Error cargando imagen secundaria para PDF:", e);
          }
        }
      }

      doc.save(
        cotizacionResult?.folio
          ? `Darmax_Cotizacion_${cotizacionResult.folio}.pdf`
          : `Darmax_Cotizacion_${model.slug}.pdf`
      );
      toast.success("Cotización descargada con éxito");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("No se pudo generar el PDF. Revise la consola.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-4 sm:-mt-6">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#168387] block mb-1">
            Paso Final del Configurador
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
            Resumen de tu Configuración
          </h2>
        </div>
        <button
          onClick={onBack}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition"
        >
          ← Regresar y Modificar
        </button>
      </div>

      {/* Tarjeta de Especificaciones del Modelo */}
      <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tighter">{model.name}</h3>
            <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-xs">Configuración Seleccionada</p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Inversión Base</span>
            <p className="text-3xl font-black text-[#168387] tracking-tighter">${toMoney(precioBaseModelo)}</p>
          </div>
        </div>

        {model?.description && (
          <p className="text-slate-600 leading-relaxed border-l-4 border-slate-100 pl-4 text-sm font-medium">
            {model.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-1.5 h-5 bg-[#168387] rounded-full" />
              Características Técnicas
            </p>
            <ul className="grid grid-cols-1 gap-2">
              {realFeatures.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#24d4da] mt-1.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="w-1.5 h-5 bg-slate-900 rounded-full" />
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
          <div className="pt-6 border-t border-slate-100">
            <p className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-[10px]">
              Requerimientos de Instalación
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {realRequirements.map((r, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-[#168387] uppercase mb-1">{r.title}</p>
                  <p className="text-xs font-bold text-slate-700">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Extras y Resumen de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 sm:p-7 bg-white border border-slate-100 rounded-[2.5rem] shadow-lg shadow-slate-200/50 space-y-4">
          <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs">
            Extras Adicionales ({selectedExtras.length})
          </h3>
          {selectedExtras.length > 0 ? (
            <ul className="space-y-2.5">
              {selectedExtras.map((me) => (
                <li
                  key={me.id}
                  className="flex justify-between items-center p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#168387]" />
                    <span className="text-sm font-bold text-slate-700">{me.extra?.name || me.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    ${toMoney(me.priceOverride ?? me.extra?.basePrice)} MXN
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-sm italic py-4">No se han añadido componentes adicionales.</p>
          )}
        </div>

        <div className="p-7 sm:p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl shadow-cyan-950/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <h3 className="font-black text-xs uppercase tracking-[0.25em] text-[#24d4da] mb-6">
              Resumen de Inversión
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm text-slate-300">
                <span>Equipo Base</span>
                <span className="font-bold text-white">${toMoney(precioBaseModelo)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-300">
                <span>Total Extras</span>
                <span className="font-bold text-white">${toMoney(precioExtras)}</span>
              </div>
              <div className="pt-4 border-t border-white/10 mt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#24d4da] block mb-1">
                  Inversión Total Estimada
                </span>
                <p className="text-4xl font-black tracking-tighter text-white">${toMoney(precioTotal)}</p>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  *Fletes y viáticos a cotizar según tu ubicación
                </span>
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

      {/* =========================================================
          SECCIÓN DEL FORMULARIO Y TICKET DE COTIZACIÓN
      ========================================================= */}
      {!cotizacionResult ? (
        <div className="p-8 sm:p-10 bg-gradient-to-br from-cyan-50/70 via-white to-teal-50/50 border-2 border-cyan-100 rounded-[2.5rem] shadow-xl shadow-cyan-900/5 space-y-6">
          <div className="max-w-2xl">
            <span className="text-[#168387] text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] block mb-1">
              Tu Cotización
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ingresa tus Datos para Generar tu Cotización
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mt-2">
              Se generará tu número de cotización con el desglose de tu equipo para que puedas guardarlo y darle seguimiento directo con nuestros asesores.
            </p>
          </div>

          {quotaError && (
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 font-bold text-amber-800">
                  !
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-950">
                    Límite mensual de 3 cotizaciones alcanzado
                  </h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    {quotaError}
                  </p>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const msg = encodeURIComponent(
                      `¡Hola DARMAX! Rebasé el límite de cotizaciones mensuales en la web y me interesa cotizar: ${model.name}. ¿Podrían brindarme asesoría personalizada?`
                    );
                    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, "_blank");
                  }}
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md shadow-green-600/20 transition-all"
                >
                  <span>Contactar Asesor por WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleRegistrarCotizacion} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-[#168387]" />
                  Nombre Completo *
                </label>
                <input
                  required
                  type="text"
                  name="nombre"
                  value={cliente.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej. Carlos Mendoza"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da] focus:border-[#24d4da] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <PhoneIcon className="w-3.5 h-3.5 text-[#168387]" />
                  Teléfono / WhatsApp *
                </label>
                <input
                  required
                  type="tel"
                  name="telefono"
                  value={cliente.telefono}
                  onChange={handleInputChange}
                  placeholder="Ej. 55 1234 5678"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da] focus:border-[#24d4da] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <EnvelopeIcon className="w-3.5 h-3.5 text-[#168387]" />
                  Correo Electrónico *
                </label>
                <input
                  required
                  type="email"
                  name="correo"
                  value={cliente.correo}
                  onChange={handleInputChange}
                  placeholder="carlos@gmail.com"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da] focus:border-[#24d4da] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#168387]" />
                  Código Postal (CP) *
                </label>
                <input
                  required
                  type="text"
                  name="cp"
                  maxLength={5}
                  value={cliente.cp}
                  onChange={handleInputChange}
                  placeholder="Ej. 03100"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da] focus:border-[#24d4da] transition-all shadow-sm"
                />
              </div>

            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-medium">
                *Tus datos serán utilizados únicamente para generar tu cotización y dar seguimiento personalizado.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#24d4da] to-[#168387] text-white font-black rounded-2xl shadow-xl shadow-cyan-600/20 hover:shadow-cyan-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs uppercase tracking-widest flex items-center justify-center gap-3 shrink-0 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    <span>Generar Cotización y Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* VISTA DEL TICKET DE COTIZACIÓN CONFIRMADA */
        <div
          id="ticket-cotizacion"
          className="relative p-8 sm:p-12 bg-white border-2 border-[#24d4da] rounded-[2.5rem] shadow-2xl shadow-cyan-900/10 space-y-8 overflow-hidden"
        >
          {/* Fondo decorativo con textura sutil */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-50 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />

          {/* Encabezado del Ticket */}
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-dashed border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#24d4da] to-[#168387] text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <CheckBadgeIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#168387] block">
                  Cotización Registrada con Éxito
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">
                  Ticket de Cotización
                </h3>
              </div>
            </div>

            {/* Badge de Número de Cotización */}
            <div className="text-left sm:text-right bg-cyan-50 border border-cyan-200/80 px-5 py-3 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#168387] block">
                Número de Cotización
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tighter">
                #{cotizacionResult.folio}
              </span>
            </div>
          </div>

          {/* Aviso al usuario para guardar su número de cotización */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3.5 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
              !
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-950">
                Guarda tu número de cotización: <span className="font-black text-slate-900">#{cotizacionResult.folio}</span>
              </p>
              <p className="text-[11px] sm:text-xs text-amber-800 font-medium mt-0.5">
                Deberás proporcionar este número a tu asesor para cualquier consulta o para dar seguimiento a tu cotización.
              </p>
            </div>
          </div>

          {/* Detalles del Cliente y del Equipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Datos del Cliente
              </h4>
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#168387]" /> {cliente.nombre}
                </p>
                <p className="text-slate-600 font-medium flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-[#168387]" /> {cliente.telefono}
                </p>
                <p className="text-slate-600 font-medium flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-[#168387]" /> {cliente.correo}
                </p>
                <p className="text-slate-600 font-medium flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-[#168387]" /> C.P. {cliente.cp}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Resumen de Equipo
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>{model.name}</span>
                  <span>${toMoney(precioBaseModelo)} MXN</span>
                </div>
                {selectedExtras.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Extras Incluidos ({selectedExtras.length}):
                    </span>
                    {selectedExtras.map((me) => (
                      <div key={me.id} className="flex justify-between text-xs text-slate-600">
                        <span className="truncate pr-2">• {me.extra?.name || me.name}</span>
                        <span className="font-semibold">${toMoney(me.priceOverride ?? me.extra?.basePrice)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center font-black text-slate-950 text-base">
                  <span>Inversión Total:</span>
                  <span className="text-[#168387]">${toMoney(precioTotal)} MXN</span>
                </div>
              </div>
            </div>

          </div>

          {/* Enlace a Cotización Digital en linea (Comentado temporalmente) */}
          {/*
          {cotizacionResult.publicUrl && (
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/80 border border-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-6 h-6 text-[#168387] shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Tu cotización digital está disponible en línea
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Puedes consultar o compartir tu cotización oficial en cualquier momento con este enlace.
                  </span>
                </div>
              </div>

              <a
                href={cotizacionResult.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-white border-2 border-[#168387] text-[#168387] text-xs font-black uppercase tracking-wider hover:bg-[#168387] hover:text-white transition-all duration-300 flex items-center gap-2 shrink-0 shadow-sm"
              >
                <span>Ver PDF en Línea</span>
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </div>
          )}
          */}

          {/* Recordatorio de consulta en perfil (Comentado temporalmente) */}
          {/*
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-xs text-slate-600 font-medium">
              Tu cotización con folio <strong>#{cotizacionResult.folio}</strong> ha sido guardada. Puedes consultarla en cualquier momento desde tu <strong>Perfil de Cliente</strong>.
            </span>
            <a
              href="/perfil"
              className="text-xs font-black text-[#168387] uppercase tracking-wider hover:underline shrink-0"
            >
              Ver en Mi Perfil →
            </a>
          </div>
          */}

          {/* Acciones del Ticket: WhatsApp y Descargas */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => setCotizacionResult(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-black uppercase tracking-wider transition-colors"
            >
              ← Modificar Datos o Recotizar
            </button>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <button
                onClick={generarPDF}
                className="flex-1 sm:flex-none px-6 py-4 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>

              <button
                onClick={enviarWhatsApp}
                className="flex-[2] sm:flex-none px-8 py-4 rounded-2xl bg-[#25D366] text-white text-xs font-black uppercase tracking-widest hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-green-600/20"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Enviar Cotización a Asesor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
