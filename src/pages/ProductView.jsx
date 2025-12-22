import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import toast from "react-hot-toast";
import { FaPlus, FaMinus, FaShoppingCart, FaCheckCircle, FaTimesCircle, FaCube, FaWeightHanging, FaRulerCombined } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const API_URL = import.meta.env.VITE_API_URL;

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { carrito, agregarProducto } = useCarrito();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos/${id}`);
        if (!res.ok) {
          throw new Error("No se pudo cargar la información del producto.");
        }
        const fullProductData = await res.json();
        setProduct(fullProductData);
        setSelectedImage(fullProductData.imagen || (fullProductData.imagenes?.[0]?.url || null));
      } catch (e) {
        console.error("Error al cargar detalles del producto:", e);
        toast.error("Producto no encontrado.");
        navigate("/productos");
      } finally {
        setIsLoading(false);
        setQuantity(1);
        setActiveTab("description");
      }
    };
    fetchProductDetails();
  }, [id, navigate]);

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

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-20 h-20 border-8 border-gray-200 border-t-[#24d4da] rounded-full animate-spin" />
      </div>
    );
  }

  const itemEnCarrito = carrito.find((item) => item.id === product.id);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
  const stockEfectivo = (product.stock ?? 0) - cantidadEnCarrito;

  const imageList = [];
  if (product?.imagen) {
    imageList.push({ url: product.imagen, id: 'main' });
  }
  if (product?.imagenes && Array.isArray(product.imagenes)) {
    product.imagenes.forEach(img => {
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
    agregarProducto(product, quantity);
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src={product.imagen || "https://via.placeholder.com/40"}
                alt={product.nombre}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                ¡Añadido al carrito!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {quantity} x {product.nombre}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#24d4da] hover:text-[#007377] focus:outline-none focus:ring-2 focus:ring-[#24d4da]"
          >
            Cerrar
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Helmet>
        <title>{`${product.nombre} - Darmax`}</title>
        <meta name="description" content={product.descripcion || `Detalles del producto ${product.nombre}`} />
      </Helmet>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-gray-700">Inicio</Link>
            <span className="mx-2">/</span>
            <Link to="/productos" className="hover:text-gray-700">Productos</Link>
            {product.categoria && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-800">{product.categoria.nombre}</span>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {allProductImages.length > 1 && (
                <div className="flex md:flex-col gap-3 justify-center md:justify-start">
                  {allProductImages.map((img, index) => (
                    <div
                      key={img.id || index}
                      className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${selectedImage === img.url ? 'border-[#24d4da] shadow-md' : 'border-transparent hover:border-gray-300'}`}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div ref={imageContainerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden group shadow-lg">
                <img src={selectedImage || "https://via.placeholder.com/600x600"} alt={product.nombre} className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-125" />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-wider text-[#007377]">{product.categoria?.nombre || 'Categoría'}</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-1">{product.nombre}</h1>
              <span className="text-xs text-gray-500 mt-2">ID de producto: #{product.id}</span>
              
              <p className="text-4xl font-black text-[#24d4da] mt-4">
                ${Number(product.precio).toFixed(2)} <span className="text-2xl text-gray-500 font-medium">MXN</span>
              </p>

              <div className="mt-6">
                {stockEfectivo > 0 ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <FaCheckCircle />
                    <span>Disponible ({stockEfectivo} en stock)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    <FaTimesCircle />
                    <span>Agotado</span>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4">
                  <p className="text-base font-medium text-gray-800">Cantidad:</p>
                  <div className="flex items-center border border-gray-200 rounded-full shadow-sm bg-white">
                    <button onClick={handleDecrease} className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled={quantity <= 1}><FaMinus size={14} /></button>
                    <span className="px-6 font-bold text-xl text-gray-900 select-none">{quantity}</span>
                    <button onClick={handleIncrease} className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled={quantity >= stockEfectivo}><FaPlus size={14} /></button>
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart} 
                  disabled={stockEfectivo <= 0} 
                  className="w-full flex items-center justify-center gap-3 bg-[#24d4da] text-white font-bold py-4 px-6 rounded-xl text-lg transition-all transform hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                  <FaShoppingCart />
                  <span>{stockEfectivo <= 0 ? "Producto Agotado" : `Añadir al carrito`}</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-10">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex gap-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab("description")} className={`shrink-0 py-4 px-1 border-b-2 font-semibold text-base transition-colors ${activeTab === "description" ? "border-[#24d4da] text-[#007377]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                      Descripción
                    </button>
                    <button onClick={() => setActiveTab("details")} className={`shrink-0 py-4 px-1 border-b-2 font-semibold text-base transition-colors ${activeTab === "details" ? "border-[#24d4da] text-[#007377]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                      Detalles Técnicos
                    </button>
                  </nav>
                </div>
                <div className="mt-6 text-gray-600 text-sm leading-relaxed min-h-[120px]">
                  {activeTab === "description" ? (
                    <div className="prose prose-sm max-w-none text-gray-600">{product.descripcion || "No hay descripción disponible para este producto."}</div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FaCube className="text-gray-400" size={20}/>
                        <span className="font-semibold text-gray-800">Dimensiones:</span>
                        <span className="text-gray-700">{[product.largoCm, product.anchoCm, product.altoCm].every(Boolean) ? `${product.largoCm}cm x ${product.anchoCm}cm x ${product.altoCm}cm` : 'No especificado'}</span>
                      </div>
                       <div className="flex items-center gap-3">
                        <FaWeightHanging className="text-gray-400" size={20}/>
                        <span className="font-semibold text-gray-800">Peso:</span>
                        <span className="text-gray-700">{product.pesoKg ? `${product.pesoKg} kg` : 'No especificado'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductView;
