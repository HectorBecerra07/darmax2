import React from "react";

/**
 * Parsea segmentos con **negrita** y los convierte en etiquetas <strong>
 * eliminando los delimitadores de asteriscos.
 */
export function parseInlineBold(str) {
  if (!str) return null;
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const content = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-slate-800">
          {content}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Formatea texto proveniente de la base de datos que contenga:
 * - Negritas con **texto**
 * - Listas con viñetas que inicien con * o -
 * - Encabezados con ### o ##
 * - Párrafos regulares
 */
export default function FormattedDescription({ text, className = "" }) {
  if (!text) return null;

  // Si no contiene caracteres de formato Markdown, renderizado simple y rápido
  if (!text.includes("**") && !text.includes("*") && !text.includes("#") && !text.includes("\n")) {
    return <p className={`text-slate-500 text-xs sm:text-[13px] leading-relaxed ${className}`}>{text}</p>;
  }

  const lines = text.split(/\r?\n/);
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="my-1.5 space-y-1 pl-4 list-disc marker:text-[#168387] text-xs sm:text-[13px] leading-relaxed"
        >
          {currentList.map((item, idx) => (
            <li key={idx} className="text-slate-600 pl-0.5">
              {parseInlineBold(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    // Encabezados con ### o ##
    if (line.startsWith("###") || line.startsWith("##")) {
      flushList();
      const headingText = line.replace(/^#+\s*/, "");
      elements.push(
        <h5
          key={`h-${idx}`}
          className="font-bold text-slate-800 text-xs sm:text-[13px] mt-2 mb-1"
        >
          {parseInlineBold(headingText)}
        </h5>
      );
      return;
    }

    // Elementos de lista que empiezan con * o -
    if (line.startsWith("* ") || line.startsWith("- ")) {
      const bulletContent = line.slice(2).trim();
      currentList.push(bulletContent);
      return;
    }

    // Párrafo normal
    flushList();
    elements.push(
      <p
        key={`p-${idx}`}
        className="text-slate-500 text-xs sm:text-[13px] leading-relaxed my-1"
      >
        {parseInlineBold(line)}
      </p>
    );
  });

  flushList();

  return (
    <div className={`formatted-description space-y-0.5 ${className}`}>
      {elements}
    </div>
  );
}
