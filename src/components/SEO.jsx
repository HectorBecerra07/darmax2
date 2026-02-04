import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * Componente SEO Maestro
 * Maneja Metadatos, Open Graph, Twitter Cards y Schema.org JSON-LD
 */
const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  type = 'website',
  productData = null, // Datos para Schema de Producto
  localBizData = null, // Datos para Schema de Negocio Local específico
  faqData = null // Array de preguntas/respuestas para FAQPage
}) => {
  const { pathname } = useLocation();
  const domain = 'https://darmaxagua.com.mx';
  const canonicalUrl = `${domain}${pathname}`;
  const defaultImage = `${domain}/img/og-image.png`;
  const metaImage = image ? (image.startsWith('http') ? image : `${domain}${image}`) : defaultImage;

  // Construcción de Título Optimizado
  const siteName = 'Darmax Agua';
  const fullTitle = title ? `${title} | ${siteName}` : `Purificadoras y Vending de Agua Rentables | ${siteName}`;
  const metaDesc = description || "Inicia tu negocio de agua purificada con Darmax. Vending machines 24/7, purificadoras comerciales y productos de limpieza. Alta rentabilidad y soporte.";

  // --- SCHEMAS (JSON-LD) ---
  
  // 1. Schema Base (Organization/WebSite)
  const baseSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${domain}/#organization`,
        "name": siteName,
        "url": domain,
        "logo": `${domain}/img/darmaxfoto.png`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+52-56-5375-1129",
          "contactType": "sales",
          "areaServed": "MX"
        }
      },
      {
        "@type": "WebSite",
        "@id": `${domain}/#website`,
        "url": domain,
        "name": siteName,
        "publisher": { "@id": `${domain}/#organization` },
        "inLanguage": "es-MX"
      }
    ]
  };

  // 2. Schema de Producto (Si aplica)
  if (productData) {
    baseSchema['@graph'].push({
      "@type": "Product",
      "name": productData.name,
      "image": metaImage,
      "description": metaDesc,
      "sku": productData.sku || '',
      "brand": {
        "@type": "Brand",
        "name": "Darmax"
      },
      "offers": {
        "@type": "Offer",
        "url": canonicalUrl,
        "priceCurrency": "MXN",
        "price": productData.price,
        "priceValidUntil": "2026-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock"
      }
    });
  }

  // 3. Schema FAQ (Si aplica)
  if (faqData && faqData.length > 0) {
    baseSchema['@graph'].push({
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    });
  }

  // 4. Schema LocalBusiness (Si es una landing local o contacto)
  if (localBizData) {
     baseSchema['@graph'].push({
      "@type": "LocalBusiness",
      "@id": `${domain}/#localbusiness`,
      "name": "Darmax Agua - Sucursal Bosques",
      "image": metaImage,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Blvd. de los Continentes 85, Bosques de Aragón",
        "addressLocality": "Nezahualcóyotl",
        "addressRegion": "MEX",
        "postalCode": "57170",
        "addressCountry": "MX"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "19.4687422",
        "longitude": "-99.0543406"
      },
      "url": canonicalUrl,
      "telephone": "+525653751129",
      "priceRange": "$$"
    });
  }

  return (
    <Helmet>
      {/* Estándar */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={keywords || "purificadoras de agua, vending machines, negocio rentable, franquicia agua, darmax"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_MX" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {/* Datos Estructurados JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
