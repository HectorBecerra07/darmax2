// src/components/BundleSummaryStep.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { MODEL_SPECS } from "../utils/modelSpecs";
import { useUser } from "../context/UserContext";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
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
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const BRAND_BLUE = "#168387";
const BACKEND_COTIZACIONES_URL = "/api/cotizaciones";
const EXTERNAL_COTIZACIONES_FALLBACK_URL =
  import.meta.env.VITE_COTIZACIONES_API_URL ||
  "https://ventas-darmax-gestion.vercel.app/api/external/cotizaciones";
const WHATSAPP_PHONE = "525519655369";

const toMoney = (n) =>
  (Number(n) || 0).toLocaleString("es-MX", { minimumFractionDigits: 0 });

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

export default function BundleSummaryStep({
  bundleId,
  bundleConfig,
  extrasConfig,
  bundleBasePrice,
  onBack,
  onEditStep,
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
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [hasDismissedNotice, setHasDismissedNotice] = useState(false);

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

  // Modal de aviso al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (hasDismissedNotice) return;
      if (window.scrollY > 250) {
        setShowNoticeModal(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasDismissedNotice]);

  const handleCloseNoticeModal = () => {
    setShowNoticeModal(false);
    setHasDismissedNotice(true);
  };

  const bundleNameReadable = useMemo(() => {
    if (bundleId?.toLowerCase().includes("duo")) return "Paquete Dúo Emprendedor";
    if (bundleId?.toLowerCase().includes("tridente")) return "Paquete Tridente";
    if (bundleId?.toLowerCase().includes("megalodon")) return "Paquete Megalodón";
    return `Paquete ${bundleId || ""}`;
  }, [bundleId]);

  // Consolidar todos los extras de todas las máquinas
  const allExtrasList = useMemo(() => {
    const list = [];
    Object.entries(extrasConfig).forEach(([modelType, group]) => {
      if (group && group.selectedExtras) {
        group.selectedExtras.forEach((extra) => {
          list.push({
            ...extra,
            modelType,
          });
        });
      }
    });
    return list;
  }, [extrasConfig]);

  const totalExtrasPrice = useMemo(() => {
    return allExtrasList.reduce((acc, curr) => {
      return acc + (curr.priceOverride ?? curr.extra?.basePrice ?? 0);
    }, 0);
  }, [allExtrasList]);

  const precioTotalFinal = bundleBasePrice + totalExtrasPrice;

  const regalosPaquete = [
    "Materiales de instalación en PVC cédula 40 (hasta 10 metros incluidos).",
    "Instalación técnica certificada con fijación mediante espárragos y ángulos reforzados.",
    "Capacitación completa: lavado de tinacos, cambio de cartuchos, retro-lavados y acceso al blog privado de videos.",
    "Servicio post-venta y asignación de un asesor personalizado permanente al concluir tu compra.",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  /* Registrar cotizacion en el servidor */
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
          modeloNombre: bundleNameReadable,
          modelo: Number(bundleBasePrice),
        },
        extrasSeleccionados: allExtrasList.map((me) => ({
          id: String(me.extra?.id || me.id || ""),
          name: `${me.extra?.name || me.name || "Extra"} (${me.modelType || "Paquete"})`,
          basePrice: Number(me.priceOverride ?? me.extra?.basePrice ?? 0),
        })),
        diasValidez: 7,
        nombreAsesor: "Configurador de Paquetes Web",
      };

      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let response = await fetch(BACKEND_COTIZACIONES_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        const errorData = await response.json();
        const msg =
          errorData.message ||
          "Has alcanzado el límite mensual de cotizaciones. Contáctanos por WhatsApp para asistencia directa.";
        setQuotaError(msg);
        toast.error("Límite mensual alcanzado.");
        return;
      }

      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        const fallbackRes = await fetch(EXTERNAL_COTIZACIONES_FALLBACK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await fallbackRes.json();
        if (!fallbackRes.ok || !data.success) {
          throw new Error(data.message || "Error al registrar la cotización.");
        }
      }

      if (!data.success) {
        throw new Error(data.message || "Error al registrar la cotización.");
      }

      setCotizacionResult(data);
      toast.success(`¡Cotización #${data.folio || ""} generada con éxito!`);

      setTimeout(() => {
        document.getElementById("ticket-cotizacion-bundle")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error al registrar cotización:", error);
      toast.error(error.message || "Hubo un error al generar tu cotización.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Generar enlace de WhatsApp con formato para paquetes */
  const buildWhatsAppUrl = () => {
    const folioText = cotizacionResult?.folio ? `#${cotizacionResult.folio}` : "Web";
    const bloques = [
      `¡Hola DARMAX! Acabo de configurar mi ${bundleNameReadable} en el sitio web.`,
      `Cotización: ${folioText}\nCliente: ${cliente.nombre || "Interesado"}\nTeléfono: ${cliente.telefono || "No especificado"}\nCódigo Postal: ${cliente.cp || "Por confirmar"}`,
      `📦 Inversión Base del Combo: $${toMoney(bundleBasePrice)} MXN`,
      `Equipos Incluidos:\n• Vending de Agua: ${bundleConfig.vendingAgua?.name || "Seleccionado"}` +
        (bundleConfig.mostrador ? `\n• Purificadora Mostrador: ${bundleConfig.mostrador?.name}` : "") +
        (bundleConfig.vendingLimpieza ? `\n• Vending Limpieza: ${bundleConfig.vendingLimpieza?.name}` : ""),
    ];

    if (allExtrasList.length > 0) {
      const lineas = allExtrasList.map((e) => {
        const nombre = e.extra?.name || e.name || "Extra";
        const precio = e.priceOverride ?? e.extra?.basePrice ?? 0;
        return `- ${nombre}: $${toMoney(precio)} MXN`;
      });
      bloques.push(`Extras Adicionales:\n${lineas.join("\n")}`);
    }

    bloques.push(`💰 Inversión Total Estimada: $${toMoney(precioTotalFinal)} MXN`);
    bloques.push("¿Me apoyarían con el seguimiento de entrega y fecha de instalación de mi paquete?");

    const mensajeCompleto = bloques.join("\n\n");
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(mensajeCompleto)}`;
  };

  const enviarWhatsApp = () => {
    window.open(buildWhatsAppUrl(), "_blank");
  };

  /* Generar PDF oficial multipágina para el paquete */
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
        cotizacionResult?.folio
          ? `Cotización #${cotizacionResult.folio} — ${bundleNameReadable}`
          : `Cotización de ${bundleNameReadable}`,
        pageW / 2,
        y,
        { align: "center" }
      );
      y += 15;

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

      // Detalle de equipos en el paquete
      const machines = [
        { label: "Vending de Agua", model: bundleConfig.vendingAgua, extras: extrasConfig.vendingAgua?.selectedExtras || [] },
        ...(bundleConfig.mostrador ? [{ label: "Purificadora Mostrador", model: bundleConfig.mostrador, extras: extrasConfig.mostrador?.selectedExtras || [] }] : []),
        ...(bundleConfig.vendingLimpieza ? [{ label: "Vending de Limpieza", model: bundleConfig.vendingLimpieza, extras: extrasConfig.vendingLimpieza?.selectedExtras || [] }] : []),
      ];

      for (const item of machines) {
        if (!item.model) continue;
        ensureSpace(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor("#111");
        doc.text(`${item.label}: ${item.model.name}`, M, y);
        y += 6;

        const modelSpecsData = MODEL_SPECS[item.model.slug] || {};
        const specs = modelSpecsData.specs || item.model.features || [];

        if (specs.length > 0) {
          ensureSpace(20);
          autoTable(doc, {
            startY: y,
            head: [[{ content: `Especificaciones — ${item.model.name}`, colSpan: 1 }]],
            body: specs.map((s) => [s]),
            theme: "striped",
            headStyles: { fillColor: BRAND_BLUE, textColor: 255, fontStyle: "bold" },
            styles: { fontSize: 8.5, cellPadding: 1.5 },
            margin: { left: M, right: M },
          });
          y = doc.lastAutoTable.finalY + 6;
        }

        if (item.extras.length > 0) {
          ensureSpace(15);
          autoTable(doc, {
            startY: y,
            head: [[`Extras para ${item.model.name}`, "Precio"]],
            body: item.extras.map((e) => [
              e.extra?.name || e.name || "Extra",
              `$${toMoney(e.priceOverride ?? e.extra?.basePrice ?? 0)} MXN`,
            ]),
            theme: "plain",
            headStyles: { textColor: "#333", fontStyle: "bold", borderBottom: { width: 0.5, color: "#ccc" } },
            styles: { fontSize: 8.5 },
            columnStyles: { 1: { halign: "right" } },
            margin: { left: M + 4, right: M },
          });
          y = doc.lastAutoTable.finalY + 8;
        }
      }

      // Regalos del Paquete
      ensureSpace(20);
      autoTable(doc, {
        startY: y,
        head: [[{ content: "Beneficios y Regalos Incluidos en el Paquete", colSpan: 1 }]],
        body: regalosPaquete.map((r) => [`• ${r}`]),
        theme: "striped",
        headStyles: { fillColor: "#0f766e", textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 8.5, cellPadding: 2 },
        margin: { left: M, right: M },
      });
      y = doc.lastAutoTable.finalY + 10;

      // Resumen Financiero
      ensureSpace(30);
      doc.setDrawColor("#eee");
      doc.line(M, y, pageW - M, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor("#555");
      doc.text("Inversión Base del Combo:", M, y);
      doc.text(`$${toMoney(bundleBasePrice)} MXN`, pageW - M, y, { align: "right" });
      y += 6;
      doc.text("Total Extras Adicionales:", M, y);
      doc.text(`$${toMoney(totalExtrasPrice)} MXN`, pageW - M, y, { align: "right" });
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor("#000");
      doc.text("Inversión Total del Paquete:", M, y);
      doc.text(`$${toMoney(precioTotalFinal)} MXN`, pageW - M, y, { align: "right" });
      y += 15;

      doc.save(`Darmax_Cotizacion_${bundleId}.pdf`);
      toast.success("Cotización del paquete descargada con éxito");
    } catch (error) {
      console.error("Error al generar PDF del paquete:", error);
      toast.error("No se pudo generar el PDF. Revise la consola.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pt-4 sm:pt-6 lg:pt-8 pb-8 font-montserrat not-italic text-left">
      {/* Cabecera del Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-1.5 block">
            Configuración Finalizada
          </span>
          <h2 className="font-montserrat not-italic text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-[#031638]">
            Resumen de tu{" "}
            <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
              {bundleNameReadable}
            </span>
          </h2>
        </div>
        <button
          onClick={onBack}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition cursor-pointer"
        >
          ← Regresar y Modificar
        </button>
      </div>

      {/* Desglose de Equipos del Paquete */}
      <div className="space-y-4">
        {/* 1. Vending de Agua */}
        {bundleConfig.vendingAgua && (
          <div className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#168387] block mb-1">
                  Equipo 1 • Despacho Automático de Agua
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {bundleConfig.vendingAgua.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {bundleConfig.vendingAgua.description || "Vending de alta rentabilidad 24/7"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(0)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#168387] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                <span>Cambiar Vending</span>
              </button>
            </div>

            {/* Extras de Vending de Agua */}
            {extrasConfig.vendingAgua?.selectedExtras?.length > 0 && (
              <div className="pt-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Extras Configurados para Vending de Agua:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {extrasConfig.vendingAgua.selectedExtras.map((me) => (
                    <div
                      key={me.id}
                      className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl text-xs"
                    >
                      <span className="font-bold text-slate-700 truncate pr-2">
                        {me.extra?.name || me.name}
                      </span>
                      <span className="font-black text-slate-900 shrink-0">
                        ${toMoney(me.priceOverride ?? me.extra?.basePrice)} MXN
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Purificadora Mostrador (si aplica) */}
        {bundleConfig.mostrador && (
          <div className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#168387] block mb-1">
                  Equipo 2 • Purificadora de Mostrador Incluida
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {bundleConfig.mostrador.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tecnología de purificación en mostrador emparejada con tu vending de agua.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-xs font-black uppercase tracking-wider shrink-0 border border-teal-200/60">
                Incluido en Paquete
              </span>
            </div>
          </div>
        )}

        {/* 3. Vending de Limpieza */}
        {bundleConfig.vendingLimpieza && (
          <div className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#168387] block mb-1">
                  Equipo {bundleConfig.mostrador ? "3" : "2"} • Despacho de Productos de Limpieza
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {bundleConfig.vendingLimpieza.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {bundleConfig.vendingLimpieza.description || "Diversificación y alta demanda"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(bundleConfig.mostrador ? 3 : 2)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-[#168387] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                <span>Cambiar Vending Limpieza</span>
              </button>
            </div>

            {/* Extras de Vending de Limpieza */}
            {extrasConfig.vendingLimpieza?.selectedExtras?.length > 0 && (
              <div className="pt-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Extras Configurados para Vending de Limpieza:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {extrasConfig.vendingLimpieza.selectedExtras.map((me) => (
                    <div
                      key={me.id}
                      className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl text-xs"
                    >
                      <span className="font-bold text-slate-700 truncate pr-2">
                        {me.extra?.name || me.name}
                      </span>
                      <span className="font-black text-slate-900 shrink-0">
                        ${toMoney(me.priceOverride ?? me.extra?.basePrice)} MXN
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Regalos Incluidos en el Paquete */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/50 border border-teal-100 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-teal-100/80 pb-3">
          <p className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
            <span className="w-1.5 h-5 bg-[#24d4da] rounded-full" />
            Beneficios y Regalos Incluidos en tu Paquete:
          </p>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-600/10 text-teal-700 text-[10px] font-black uppercase tracking-wider shrink-0">
            100% Bonificado
          </span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {regalosPaquete.map((regalo, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <div className="w-4 h-4 rounded-full bg-teal-100 text-[#168387] flex items-center justify-center shrink-0 mt-0.5">
                <CheckIcon className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{regalo}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Resumen de Inversión y Acciones Inmediatas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 sm:p-7 bg-white border border-slate-100 rounded-[2.5rem] shadow-lg shadow-slate-200/50 space-y-4">
          <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs">
            Desglose Financiero del Paquete
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-700">Precio Base del Paquete (con descuento combo)</span>
              <span className="text-sm font-black text-slate-900">${toMoney(bundleBasePrice)} MXN</span>
            </div>
            <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-sm font-bold text-slate-700">Total Extras Adicionales ({allExtrasList.length})</span>
              <span className="text-sm font-black text-slate-900">${toMoney(totalExtrasPrice)} MXN</span>
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl shadow-cyan-950/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10 space-y-4">
            <h3 className="font-black text-xs uppercase tracking-[0.25em] text-[#24d4da]">
              Inversión Total
            </h3>
            <p className="text-4xl font-black tracking-tighter text-white">${toMoney(precioTotalFinal)}</p>
            <span className="text-[10px] text-slate-400 font-medium block">
              *Fletes y viáticos a cotizar según tu ubicación
            </span>

            {/* Acciones inmediatas */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={generarPDF}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Descargar Cotización PDF</span>
              </button>
              <button
                type="button"
                onClick={enviarWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-600/30"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Enviar a Asesor por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario Opcional para Registrar Cotización */}
      {!cotizacionResult ? (
        <div className="p-8 sm:p-10 bg-gradient-to-br from-cyan-50/70 via-white to-teal-50/50 border-2 border-cyan-100 rounded-[2.5rem] shadow-xl shadow-cyan-900/5 space-y-6">
          <div className="max-w-2xl">
            <span className="text-[#168387] text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] block mb-1">
              Registro Oficial (Opcional)
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ingresa tus Datos para Generar tu Cotización
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mt-2">
              Si deseas registrar tu paquete en nuestro sistema para obtener tu número de folio oficial y que un asesor prepare tu orden de compra directamente, completa tus datos a continuación. O si lo prefieres, puedes descargar tu PDF o enviar tu cotización por WhatsApp arriba sin necesidad de registrarte.
            </p>
          </div>

          {quotaError && (
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 space-y-3">
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                {quotaError}
              </p>
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
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da] transition-all shadow-sm"
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
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da] transition-all shadow-sm"
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
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da] transition-all shadow-sm"
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
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da] transition-all shadow-sm"
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
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#24d4da] to-[#168387] text-white font-black rounded-2xl shadow-xl shadow-cyan-600/20 hover:shadow-cyan-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs uppercase tracking-widest flex items-center justify-center gap-3 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    <span>Generar Cotización y Folio</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* VISTA CONFIRMADA DEL TICKET CON FOLIO */
        <div
          id="ticket-cotizacion-bundle"
          className="relative p-8 sm:p-12 bg-white border-2 border-[#24d4da] rounded-[2.5rem] shadow-2xl shadow-cyan-900/10 space-y-8 overflow-hidden"
        >
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-dashed border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 text-[#168387] flex items-center justify-center shrink-0">
                <CheckBadgeIcon className="w-8 h-8 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#168387] block mb-0.5">
                  Cotización de Paquete Registrada
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Folio #{cotizacionResult.folio}
                </h3>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                Inversión Total
              </span>
              <p className="text-2xl sm:text-3xl font-black text-[#168387] tracking-tight">
                ${toMoney(precioTotalFinal)} MXN
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <button
              onClick={() => setCotizacionResult(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              ← Modificar Datos o Recotizar
            </button>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <button
                onClick={generarPDF}
                className="flex-1 sm:flex-none px-6 py-4 rounded-2xl border-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>

              <button
                onClick={enviarWhatsApp}
                className="flex-[2] sm:flex-none px-8 py-4 rounded-2xl bg-[#25D366] text-white text-xs font-black uppercase tracking-widest hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-green-600/20 cursor-pointer"
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

      {/* Modal de Aviso de Requisitos */}
      <AnimatePresence>
        {showNoticeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseNoticeModal}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 z-10"
            >
              <button
                type="button"
                onClick={handleCloseNoticeModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <InformationCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#168387] block">
                    Avisos de Instalación
                  </span>
                  <h4 className="text-lg font-bold text-slate-900">
                    Información Importante del Paquete
                  </h4>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                Antes de agendar la fecha de instalación de tu paquete, deberás enviar a tu asesor las evidencias fotográficas de los requerimientos de tu local cumplidos (muro, tomas eléctricas e hidráulicas).
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseNoticeModal}
                  className="px-6 py-2.5 rounded-xl bg-[#168387] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#126b6e] transition cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
