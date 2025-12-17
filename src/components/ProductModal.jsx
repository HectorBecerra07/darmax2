import React, { useState, useEffect, useRef } from "react";
import { useCarrito } from "../context/CarritoContext";
import toast from "react-hot-toast";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const ProductModal = ({ show, onClose, producto: productoInicial }) => {
  const { carrito, agregarProducto } = useCarrito();
  const [modalProduct, setModalProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    if (show && productoInicial) {
      setIsLoading(true);
      const fetchProductDetails = async () => {
        try {
          const res = await fetch(`${API_URL}/api/productos/${productoInicial.id}`);
          if (!res.ok) {
            throw new Error("No se pudo cargar la información completa del producto.");
          }
          const fullProductData = await res.json();
          setModalProduct(fullProductData);
          setSelectedImage(fullProductData.imagen || (fullProductData.imagenes?.[0]?.url || null));
        } catch (e) {
          console.error("Error al cargar detalles del producto, usando datos iniciales:", e);
          setModalProduct(productoInicial); // Fallback to initial prop data
          setSelectedImage(productoInicial.imagen || (productoInicial.imagenes?.[0]?.url || null));
        } finally {
          setIsLoading(false);
          setQuantity(1);
          setActiveTab("description");
        }
      };
      fetchProductDetails();
    }
  }, [show, productoInicial]);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    const img = imageContainerRef.current.querySelector("img");
    if (img) img.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleMouseLeave = () => {
    if (!imageContainerRef.current) return;
    const img = imageContainerRef.current.querySelector("img");
    if (img) img.style.transformOrigin = "center center";
  };
  
  if (!show) return null;

  // Render logic starts here
  const renderContent = () => {
    if (isLoading || !modalProduct) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#24d4da] rounded-full animate-spin" />
        </div>
      );
    }

    const itemEnCarrito = carrito.find((item) => item.id === modalProduct.id);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const stockEfectivo = (modalProduct.stock ?? 0) - cantidadEnCarrito;

    const imageList = [];
    if (modalProduct?.imagen) {
      imageList.push({ url: modalProduct.imagen, id: 'main' });
    }
    if (modalProduct?.imagenes && Array.isArray(modalProduct.imagenes)) {
      modalProduct.imagenes.forEach(img => {
        if (img.url) imageList.push({ url: img.url, id: img.id });
      });
    }
    const allProductImages = imageList.filter((img, index, self) =>
      index === self.findIndex((t) => t.url === img.url)
    );
    
    const handleIncrease = () => {
      if (quantity < stockEfectivo) setQuantity(q => q + 1);
      else toast.error("No hay más stock disponible.");
    };
  
    const handleDecrease = () => {
      if (quantity > 1) setQuantity(q => q - 1);
    };

    const handleAddToCart = () => {
      if (stockEfectivo <= 0) {
        toast.error("Este producto está agotado.");
        return;
      }
      if (quantity > stockEfectivo) {
        toast.error(`Solo puedes agregar ${stockEfectivo} unidades de este producto.`);
        return;
      }
      agregarProducto(modalProduct, quantity);
      toast.success(
        <div className="flex items-center gap-3">
          <img src={modalProduct.imagen || "https://via.placeholder.com/40"} alt={modalProduct.nombre} className="h-8 w-8 rounded-full object-cover" />
          <span>{quantity} x {modalProduct.nombre} añadido(s) al carrito</span>
        </div>
      );
      onClose();
    };

    return (
      <>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-20">
          <FaTimes size={22} />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div ref={imageContainerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="bg-gray-100 rounded-xl aspect-square overflow-hidden group mb-4">
              <img src={selectedImage || "https://via.placeholder.com/400x400"} alt={modalProduct.nombre} className="rounded-lg object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-150" />
            </div>
            {allProductImages.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allProductImages.map((img, index) => (
                  <img
                    key={img.id || index}
                    src={img.url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`h-16 w-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${selectedImage === img.url ? 'border-[#24d4da] scale-105' : 'border-transparent hover:border-gray-300'}`}
                    onClick={() => setSelectedImage(img.url)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">{modalProduct.nombre}</h2>
            <p className="text-2xl font-bold text-[#24d4da] mt-2">MXN ${Number(modalProduct.precio).toFixed(2)}</p>
            <div className="mt-4 border-b border-gray-200">
              <nav className="-mb-px flex gap-6" aria-label="Tabs">
                <button onClick={() => setActiveTab("description")} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base transition-colors ${activeTab === "description" ? "border-[#24d4da] text-[#24d4da]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                  Descripción
                </button>
                <button onClick={() => setActiveTab("details")} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base transition-colors ${activeTab === "details" ? "border-[#24d4da] text-[#24d4da]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                  Detalles
                </button>
              </nav>
            </div>
            <div className="mt-4 text-gray-600 text-sm leading-relaxed flex-grow min-h-[150px]">
              {activeTab === "description" ? (
                <p>{modalProduct.descripcion || "No hay descripción disponible."}</p>
              ) : (
                <div className="space-y-2">
                  <p>Disponibles: <span className={`font-medium ${stockEfectivo <= 0 ? "text-red-500" : "text-gray-800"}`}>{stockEfectivo}</span></p>
                  {modalProduct.pesoKg && <p>Peso: <span className="font-medium text-gray-800">{modalProduct.pesoKg} kg</span></p>}
                  {modalProduct.largoCm && <p>Largo: <span className="font-medium text-gray-800">{modalProduct.largoCm} cm</span></p>}
                  {modalProduct.anchoCm && <p>Ancho: <span className="font-medium text-gray-800">{modalProduct.anchoCm} cm</span></p>}
                  {modalProduct.altoCm && <p>Alto: <span className="font-medium text-gray-800">{modalProduct.altoCm} cm</span></p>}
                </div>
              )}
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-700">Cantidad:</p>
                <div className="flex items-center border border-gray-300 rounded-full">
                  <button onClick={handleDecrease} className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-full disabled:opacity-50" disabled={quantity <= 1}><FaMinus size={12} /></button>
                  <span className="px-4 font-bold text-lg text-gray-800">{quantity}</span>
                  <button onClick={handleIncrease} className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-full disabled:opacity-50" disabled={quantity >= stockEfectivo}><FaPlus size={12} /></button>
                </div>
              </div>
              <button onClick={handleAddToCart} disabled={stockEfectivo <= 0} className={`w-full mt-4 text-white font-bold py-4 px-5 rounded-xl hover:brightness-95 transition-transform transform active:scale-95 ${stockEfectivo <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#24d4da]"}`}>
                {stockEfectivo <= 0 ? "Agotado" : `Añadir ${quantity} al carrito`}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative transition-transform duration-300" onClick={(e) => e.stopPropagation()} style={{ transform: show ? "scale(1)" : "scale(0.95)" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProductModal;
