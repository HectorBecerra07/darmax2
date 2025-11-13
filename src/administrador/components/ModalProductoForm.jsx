import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ModalProductoForm = ({
  show,
  onClose,
  onSaveSuccess,
  producto,
  categoriasExistentes,
}) => {
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
  const [imgMode, setImgMode] = useState("file");
  const [fileObj, setFileObj] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Cargar categorías desde el prop
    setCategorias(categoriasExistentes || []);

    if (producto) {
      setNombre(producto.nombre ?? "");
      setPrecio(producto.precio ?? "");
      setCategoria(producto.categoria?.nombre ?? ""); // Ajustado para objeto
      setDescripcion(producto.descripcion ?? "");
      setStock(producto.stock ?? 0);
      setImagen(producto.imagen ?? "");
      setPesoKg(producto.pesoKg ?? "");
      setLargoCm(producto.largoCm ?? ""); // Ajustado
      setAnchoCm(producto.anchoCm ?? ""); // Ajustado
      setAltoCm(producto.altoCm ?? "");   // Ajustado
    } else {
      // Resetear formulario para nuevo producto
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

    // Resetear estado del modal
    setImgMode("file");
    setFileObj(null);
    setErrors({});
    setNuevaCat("");
    setIsSubmitting(false);
  }, [producto, show, categoriasExistentes]);

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
    if (!val || categorias.find(c => c.nombre === val)) return;
    // Solo agrega a la UI local para seleccionarla. El backend la creará.
    setCategorias([...categorias, { id: `new_${val}`, nombre: val }]);
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
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    let toastId;
    try {
      toastId = toast.loading(producto ? "Actualizando..." : "Creando...");

      let imagenFinal = imagen;
      if (imgMode === "file" && fileObj) {
        imagenFinal = await readFileAsDataURL(fileObj);
      }

      const productData = {
        nombre: nombre.trim(),
        precio: toNumberOrNull(precio),
        categoria: categoria.trim(),
        descripcion: descripcion.trim(),
        stock: Number.isFinite(Number(stock)) ? parseInt(stock, 10) : 0,
        imagen: imagenFinal || "",
        pesoKg: toNumberOrNull(pesoKg),
        largoCm: toNumberOrNull(largoCm),
        anchoCm: toNumberOrNull(anchoCm),
        altoCm: toNumberOrNull(altoCm),
      };

      const url = producto
        ? `${API_URL}/api/productos/${producto.id}`
        : `${API_URL}/api/productos`;
      
      const method = producto ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en el servidor");
      }

      toast.dismiss(toastId);
      onSaveSuccess();

    } catch (error) {
      console.error(error);
      if (toastId) toast.dismiss(toastId);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewSrc = () => {
    if (imgMode === "file" && fileObj) return URL.createObjectURL(fileObj);
    if (imgMode === "url" && imagen) return imagen;
    if (producto?.imagen) return producto.imagen;
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[28rem] max-w-full space-y-4 shadow-lg">
        <h3 className="text-lg font-bold">{producto ? "Editar Producto" : "Nuevo Producto"}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre */}
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

          {/* Precio */}
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

          {/* Categoría */}
          <div>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
            {errors.categoria && <p className="text-xs text-red-600 mt-1">{errors.categoria}</p>}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="O crea una nueva categoría"
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

          {/* Descripción */}
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
          />

          {/* Stock */}
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

          {/* Imagen */}
          <div>
            {/* ... (resto del JSX de imagen sin cambios) ... */}
          </div>

          {/* Envíos */}
          <div className="grid grid-cols-3 gap-2">
            {/* ... (resto del JSX de envíos sin cambios) ... */}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="text-gray-600" disabled={isSubmitting}>
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded px-4 py-2 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProductoForm;
