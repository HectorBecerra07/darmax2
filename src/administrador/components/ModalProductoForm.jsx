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
  // State for all form fields
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState(0);
  const [imagen, setImagen] = useState(""); // Main image URL
  const [additionalImages, setAdditionalImages] = useState([]); // Array of { id?: Int, url: String }
  const [newAdditionalImageUrl, setNewAdditionalImageUrl] = useState(""); // For new image URL input
  const [newAddImgMode, setNewAddImgMode] = useState("url"); // New state for additional image input mode
  const [newAddFileObj, setNewAddFileObj] = useState(null); // New state for additional image file object

  const [pesoKg, setPesoKg] = useState("");
  const [largoCm, setLargoCm] = useState("");
  const [anchoCm, setAnchoCm] = useState("");
  const [altoCm, setAltoCm] = useState("");
  const [imgMode, setImgMode] = useState("file");
  const [fileObj, setFileObj] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || "");
      setPrecio(producto.precio ?? "");
      setCategoriaId(producto.categoriaId ?? "");
      setDescripcion(producto.descripcion || "");
      setStock(producto.stock ?? 0);
      setImagen(producto.imagen || "");
      setAdditionalImages(producto.imagenes?.map(img => ({ id: img.id, url: img.url })) || []);
      setPesoKg(producto.pesoKg ?? "");
      setLargoCm(producto.largoCm ?? "");
      setAnchoCm(producto.anchoCm ?? "");
      setAltoCm(producto.altoCm ?? "");
    } else {
      // Reset form for new product
      setNombre("");
      setPrecio("");
      setCategoriaId("");
      setDescripcion("");
      setStock(0);
      setImagen("");
      setAdditionalImages([]);
      setPesoKg("");
      setLargoCm("");
      setAnchoCm("");
      setAltoCm("");
    }
    // Reset modal-specific state
    setImgMode("file");
    setFileObj(null);
    setNewAdditionalImageUrl("");
    setErrors({});
    setIsSubmitting(false);
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

  const handleAddAdditionalImage = async () => { // Make it async
    let imageUrlToAdd = "";

    if (newAddImgMode === "url") {
      imageUrlToAdd = newAdditionalImageUrl.trim();
    } else if (newAddImgMode === "file" && newAddFileObj) {
      try {
        imageUrlToAdd = await readFileAsDataURL(newAddFileObj);
      } catch (error) {
        toast.error("Error al leer el archivo de imagen.");
        return;
      }
    }

    if (imageUrlToAdd && !additionalImages.some(img => img.url === imageUrlToAdd)) {
      setAdditionalImages(prev => [...prev, { url: imageUrlToAdd }]);
      setNewAdditionalImageUrl(""); // Clear URL input
      setNewAddFileObj(null);      // Clear file object
      // Reset radio to URL after adding to simplify next addition
      setNewAddImgMode("url");
    } else if (imageUrlToAdd) {
      toast.error("Esta imagen ya está en la galería o el campo está vacío.");
    }
  };

  const handleRemoveAdditionalImage = (indexToRemove) => {
    setAdditionalImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  const validate = () => {
    const errs = {};
    if (!nombre?.trim()) errs.nombre = "Requerido";
    if (toNumberOrNull(precio) == null || toNumberOrNull(precio) <= 0) errs.precio = "Precio inválido";
    if (!categoriaId) errs.categoriaId = "Selecciona una categoría";
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
        categoriaId: parseInt(categoriaId),
        descripcion: descripcion.trim(),
        stock: Number.isFinite(Number(stock)) ? parseInt(stock, 10) : 0,
        imagen: imagenFinal || null, // Ensure null if empty
        pesoKg: toNumberOrNull(pesoKg),
        largoCm: toNumberOrNull(largoCm),
        anchoCm: toNumberOrNull(anchoCm),
        altoCm: toNumberOrNull(altoCm),
        imagenes: additionalImages.map(img => ({ url: img.url })), // Send only URLs
      };

      const url = producto ? `${API_URL}/api/productos/${producto.id}` : `${API_URL}/api/productos`;
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
    if (producto?.imagen && !fileObj) return producto.imagen;
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-[28rem] max-w-full space-y-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold">{producto ? "Editar Producto" : "Nuevo Producto"}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nombre */}
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border rounded p-2 mt-1" required />
            {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
          </div>

          {/* Precio */}
          <div>
            <label className="text-sm font-medium text-gray-700">Precio</label>
            <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full border rounded p-2 mt-1" required />
            {errors.precio && <p className="text-xs text-red-600 mt-1">{errors.precio}</p>}
          </div>

          {/* Categoría */}
          <div>
            <label className="text-sm font-medium text-gray-700">Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full border rounded p-2 mt-1" required>
              <option value="">Selecciona una categoría</option>
              {(categoriasExistentes || []).map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errors.categoriaId && <p className="text-xs text-red-600 mt-1">{errors.categoriaId}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full border rounded p-2 mt-1" rows="3" />
          </div>

          {/* Stock */}
          <div>
            <label className="text-sm font-medium text-gray-700">Stock</label>
            <input type="number" placeholder="Stock" value={stock} min="0" onChange={(e) => setStock(parseInt(e.target.value) || 0)} className="w-full border rounded p-2 mt-1" required />
            {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
          </div>

          {/* Imagen Principal */}
          <div className="pt-2 border-t mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Imagen Principal del Producto</label>
            <div className="flex items-center gap-4 text-sm mb-2">
              <label className="flex items-center gap-2"><input type="radio" name="imgMode" value="file" checked={imgMode === "file"} onChange={() => setImgMode("file")} /> Archivo</label>
              <label className="flex items-center gap-2"><input type="radio" name="imgMode" value="url" checked={imgMode === "url"} onChange={() => setImgMode("url")} /> URL</label>
            </div>
            {imgMode === "file" ? (
              <input type="file" accept="image/*" onChange={handleImagenFile} className="w-full border rounded p-2" />
            ) : (
              <input type="url" placeholder="https://tu-imagen-principal..." value={imagen} onChange={(e) => setImagen(e.target.value)} className="w-full border rounded p-2" />
            )}
            {previewSrc() && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-1">Vista previa:</p>
                <img src={previewSrc()} alt="preview" className="h-24 w-24 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Galería de Imágenes Adicionales */}
          <div className="pt-2 border-t mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Galería de Imágenes Adicionales</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {additionalImages.map((img, index) => (
                <div key={img.id || img.url} className="relative group">
                  <img src={img.url} alt={`Adicional ${index + 1}`} className="h-24 w-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-5 h-5"
                    title="Eliminar imagen"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {/* New input section for additional images */}
            <div>
              <div className="flex items-center gap-4 text-sm mb-2">
                <label className="flex items-center gap-2"><input type="radio" name="newAddImgMode" value="url" checked={newAddImgMode === "url"} onChange={() => setNewAddImgMode("url")} /> URL</label>
                <label className="flex items-center gap-2"><input type="radio" name="newAddImgMode" value="file" checked={newAddImgMode === "file"} onChange={() => setNewAddImgMode("file")} /> Archivo</label>
              </div>
              <div className="flex gap-2">
                {newAddImgMode === "url" ? (
                  <input
                    type="url"
                    placeholder="URL de imagen adicional (ej: https://img.com/prod2.jpg)"
                    className="w-full border rounded p-2"
                    value={newAdditionalImageUrl}
                    onChange={(e) => setNewAdditionalImageUrl(e.target.value)}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border rounded p-2"
                    onChange={(e) => setNewAddFileObj(e.target.files?.[0] || null)}
                  />
                )}
                <button
                  type="button"
                  onClick={handleAddAdditionalImage}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1 text-sm flex-shrink-0"
                >
                  + Añadir
                </button>
              </div>
              {newAddImgMode === "file" && newAddFileObj && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Vista previa:</p>
                  <img src={URL.createObjectURL(newAddFileObj)} alt="preview" className="h-16 w-16 object-cover rounded" />
                </div>
              )}
            </div>
          </div>


          {/* Envíos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t mt-4">
            <div className="col-span-2 md:col-span-3"><label className="text-sm font-medium text-gray-700">Datos de Envío (Opcional)</label></div>
            <div>
              <label className="text-xs font-medium text-gray-600">Peso (kg)</label>
              <input type="number" step="0.01" min="0" value={pesoKg} onChange={(e) => setPesoKg(e.target.value)} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Largo (cm)</label>
              <input type="number" step="0.1" min="0" value={largoCm} onChange={(e) => setLargoCm(e.target.value)} className="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Ancho (cm)</label>
              <input type="number" step="0.1" min="0" value={anchoCm} onChange={(e) => setAnchoCm(e.target.value)} className="w-full border rounded p-2 mt-1" />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-medium text-gray-600">Alto (cm)</label>
              <input type="number" step="0.1" min="0" value={altoCm} onChange={(e) => setAltoCm(e.target.value)} className="w-full border rounded p-2 mt-1" />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100" disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-4 py-2 disabled:bg-gray-400" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProductoForm;
