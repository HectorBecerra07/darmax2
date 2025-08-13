import React, { useState, useEffect } from "react";

const LS_CAT = "categorias";

const ModalProductoForm = ({ show, onClose, onSave, producto }) => {
  // Campos base
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState(0);
  const [imagen, setImagen] = useState("");

  // Envíos
  const [pesoKg, setPesoKg] = useState("");
  const [largoCm, setLargoCm] = useState("");
  const [anchoCm, setAnchoCm] = useState("");
  const [altoCm, setAltoCm] = useState("");

  // Categorías dinámicas
  const [categorias, setCategorias] = useState([]);
  const [nuevaCat, setNuevaCat] = useState("");

  // Imagen: URL o Archivo
  const [imgMode, setImgMode] = useState("file"); // "file" | "url"
  const [fileObj, setFileObj] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cs = JSON.parse(localStorage.getItem(LS_CAT)) || [];
    setCategorias(cs);

    if (producto) {
      setNombre(producto.nombre ?? "");
      setPrecio(producto.precio ?? "");
      setCategoria(producto.categoria ?? "");
      setDescripcion(producto.descripcion ?? "");
      setStock(producto.stock ?? 0);
      setImagen(producto.imagen ?? "");
      setPesoKg(producto.pesoKg ?? "");
      setLargoCm(producto.dimensiones?.largoCm ?? "");
      setAnchoCm(producto.dimensiones?.anchoCm ?? "");
      setAltoCm(producto.dimensiones?.altoCm ?? "");
    } else {
      setNombre("");
      setPrecio("");
      setCategoria("");
      setDescripcion("");
      setStock(0);
      setImagen("");
      setPesoKg("");
      setLargoCm("");
      setAnchoCm("");
      setAltoCm("");
    }

    setImgMode("file");
    setFileObj(null);
    setErrors({});
    setNuevaCat("");
  }, [producto, show]);

  if (!show) return null;

  const toNumberOrNull = (v) => {
    if (v === "" || v == null) return null;
    const n = parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });

  const handleImagenFile = (e) => {
    const file = e.target.files?.[0];
    setFileObj(file || null);
  };

  const handleAddCategory = () => {
    const val = (nuevaCat || "").trim();
    if (!val) return;
    const next = Array.from(new Set([...(categorias || []), val]));
    localStorage.setItem(LS_CAT, JSON.stringify(next));
    setCategorias(next);
    setCategoria(val);
    setNuevaCat("");
  };

  const validate = () => {
    const errs = {};
    if (!nombre?.trim()) errs.nombre = "Requerido";
    const precioNum = toNumberOrNull(precio);
    if (precioNum == null || precioNum <= 0) errs.precio = "Precio inválido";
    if (!categoria?.trim()) errs.categoria = "Selecciona o crea una categoría";
    if (stock < 0) errs.stock = "No puede ser negativo";

    const pesoNum = toNumberOrNull(pesoKg);
    if (pesoKg !== "" && (pesoNum == null || pesoNum <= 0)) errs.pesoKg = "Debe ser > 0";

    [["largoCm", largoCm], ["anchoCm", anchoCm], ["altoCm", altoCm]].forEach(([k, v]) => {
      if (v !== "" && v != null) {
        const n = toNumberOrNull(v);
        if (n == null || n <= 0) errs[k] = "Debe ser > 0";
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let imagenFinal = imagen;
    try {
      if (imgMode === "file" && fileObj) {
        imagenFinal = await readFileAsDataURL(fileObj); // DataURL => persiste en LS
      }
    } catch {
      setErrors((prev) => ({ ...prev, imagen: "No se pudo leer el archivo" }));
      return;
    }

    onSave({
      nombre: nombre.trim(),
      precio: toNumberOrNull(precio),
      categoria: categoria.trim(),
      descripcion: descripcion.trim(),
      stock: Number.isFinite(Number(stock)) ? parseInt(stock, 10) : 0,
      imagen: (imagenFinal?.trim?.() ?? imagenFinal) || "",
      pesoKg: toNumberOrNull(pesoKg),
      dimensiones: {
        largoCm: toNumberOrNull(largoCm),
        anchoCm: toNumberOrNull(anchoCm),
        altoCm: toNumberOrNull(altoCm),
      },
    });
  };

  const previewSrc = () => {
    if (imgMode === "file" && fileObj) return URL.createObjectURL(fileObj);
    if (imgMode === "url" && imagen) return imagen;
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[28rem] max-w-full space-y-4 shadow-lg">
        <h3 className="text-lg font-bold">{producto ? "Editar Producto" : "Nuevo Producto"}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            {errors.precio && <p className="text-xs text-red-600 mt-1">{errors.precio}</p>}
          </div>

          {/* Categoría dinámica + crear en el modal */}
          <div>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.categoria && <p className="text-xs text-red-600 mt-1">{errors.categoria}</p>}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Nueva categoría"
                value={nuevaCat}
                onChange={(e) => setNuevaCat(e.target.value)}
                className="flex-1 border rounded p-2"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded px-3"
              >
                Agregar
              </button>
            </div>
          </div>

          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
          />

          <div>
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              min="0"
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              className="w-full border rounded p-2"
              required
            />
            {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
          </div>

          {/* Imagen: URL o Archivo */}
          <div>
            <div className="flex items-center gap-4 text-sm mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="imgMode"
                  value="file"
                  checked={imgMode === "file"}
                  onChange={() => setImgMode("file")}
                />
                Archivo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="imgMode"
                  value="url"
                  checked={imgMode === "url"}
                  onChange={() => setImgMode("url")}
                />
                URL
              </label>
            </div>

            {imgMode === "file" ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenFile}
                className="w-full border rounded p-2"
              />
            ) : (
              <input
                type="url"
                placeholder="https://tu-imagen..."
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                className="w-full border rounded p-2"
              />
            )}

            {previewSrc() && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-1">Vista previa:</p>
                <img src={previewSrc()} alt="preview" className="h-24 w-24 object-cover rounded" />
              </div>
            )}
            {errors.imagen && <p className="text-xs text-red-600 mt-1">{errors.imagen}</p>}
          </div>

          {/* Envíos: peso y dimensiones */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3">
              <label className="text-sm font-medium">Peso (kg)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={pesoKg}
                onChange={(e) => setPesoKg(e.target.value)}
                className="w-full border rounded p-2"
              />
              {errors.pesoKg && <p className="text-xs text-red-600 mt-1">{errors.pesoKg}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Largo (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={largoCm}
                onChange={(e) => setLargoCm(e.target.value)}
                className="w-full border rounded p-2"
              />
              {errors.largoCm && <p className="text-xs text-red-600 mt-1">{errors.largoCm}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Ancho (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={anchoCm}
                onChange={(e) => setAnchoCm(e.target.value)}
                className="w-full border rounded p-2"
              />
              {errors.anchoCm && <p className="text-xs text-red-600 mt-1">{errors.anchoCm}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Alto (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={altoCm}
                onChange={(e) => setAltoCm(e.target.value)}
                className="w-full border rounded p-2"
              />
              {errors.altoCm && <p className="text-xs text-red-600 mt-1">{errors.altoCm}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="text-gray-600">
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded px-4 py-2"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProductoForm;
