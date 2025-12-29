import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const TerminosCondiciones = () => {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones | Darmax Agua</title>
        <meta
          name="description"
          content="Conoce los términos y condiciones de uso y contratación de Darmax Agua. Información sobre productos, pagos, entregas y garantías."
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-800 px-6 py-8 text-white text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              TÉRMINOS Y CONDICIONES DE USO Y CONTRATACIÓN
            </h1>
            <p className="mt-2 text-sky-100 font-medium text-lg">DARMAX AGUA</p>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 text-gray-700 space-y-8"
          >
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                1. Identidad del proveedor
              </h2>
              <p className="leading-relaxed">
                DARMAX AGUA, con domicilio en Calle Boulevard de los Continentes
                número 85, Colonia Bosques de Aragón, C.P. 57170, Municipio de
                Nezahualcóyotl, Estado de México, pone a disposición del público
                los presentes Términos y Condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                2. Aceptación
              </h2>
              <p className="leading-relaxed">
                El acceso y uso del sitio web implica la aceptación expresa, libre e
                informada de los presentes Términos y Condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                3. Productos y servicios
              </h2>
              <p className="leading-relaxed">
                Venta de equipos de purificación de agua, máquinas vending,
                soluciones de limpieza, asesoría técnica y servicios relacionados,
                sujetos a cotización previa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                4. Precios y pagos
              </h2>
              <p className="leading-relaxed">
                Los precios se expresan en pesos mexicanos y podrán incluir
                impuestos conforme a la legislación vigente. El pago se considera
                definitivo una vez confirmado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                5. Entrega e instalación
              </h2>
              <p className="leading-relaxed">
                Los tiempos de entrega son estimados. DARMAX AGUA no será
                responsable por retrasos de terceros ni por instalaciones realizadas
                por personal externo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                6. Garantías
              </h2>
              <p className="leading-relaxed">
                Garantía limitada contra defectos de fabricación. No cubre daños por
                mal uso, instalaciones incorrectas o modificaciones no autorizadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                7. Cancelaciones y devoluciones
              </h2>
              <p className="leading-relaxed">
                No se aceptan devoluciones de productos personalizados o bajo pedido
                especial. Las cancelaciones deberán solicitarse antes del envío.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                8. Responsabilidad
              </h2>
              <p className="leading-relaxed">
                DARMAX AGUA no será responsable por daños indirectos, pérdida de
                ingresos o lucro cesante.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                9. Propiedad intelectual
              </h2>
              <p className="leading-relaxed">
                Todo el contenido, marcas, diseños y logotipos son propiedad
                exclusiva de DARMAX AGUA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                10. Legislación aplicable
              </h2>
              <p className="leading-relaxed">
                Estos términos se rigen por las leyes de los Estados Unidos
                Mexicanos, sometiéndose a los tribunales de Nezahualcóyotl, Estado
                de México.
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TerminosCondiciones;
