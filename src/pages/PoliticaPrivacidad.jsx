import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const PoliticaPrivacidad = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad | Darmax Agua</title>
        <meta
          name="description"
          content="Conoce nuestra Política de Privacidad. En Darmax Agua nos comprometemos a proteger tus datos personales."
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-800 px-6 py-8 text-white text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              POLÍTICA DE PRIVACIDAD
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
                Responsable del tratamiento
              </h2>
              <p className="leading-relaxed">
                DARMAX AGUA es responsable del uso y protección de sus datos
                personales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                Datos recabados
              </h2>
              <p className="leading-relaxed">
                Datos de identificación, contacto, domicilio y datos necesarios para
                facturación y entrega.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                Finalidad
              </h2>
              <p className="leading-relaxed">
                Los datos personales serán utilizados para fines comerciales,
                administrativos, logísticos y de atención al cliente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                Derechos ARCO
              </h2>
              <p className="leading-relaxed">
                El titular podrá ejercer sus derechos de Acceso, Rectificación,
                Cancelación u Oposición enviando solicitud al correo{" "}
                <a
                  href="mailto:darmaxagua@gmail.com"
                  className="text-sky-600 hover:text-sky-800 font-medium underline"
                >
                  darmaxagua@gmail.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                Transferencia de datos
              </h2>
              <p className="leading-relaxed">
                Los datos no serán compartidos con terceros sin consentimiento,
                salvo obligación legal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-sky-500 pb-1 inline-block">
                Modificaciones
              </h2>
              <p className="leading-relaxed">
                DARMAX AGUA se reserva el derecho de modificar esta política en
                cualquier momento.
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PoliticaPrivacidad;
