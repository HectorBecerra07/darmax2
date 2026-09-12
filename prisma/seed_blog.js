import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Restaurando las 3 publicaciones originales en la BD...');

  const posts = [
    {
      title: "Guía definitiva: Cómo iniciar tu negocio de agua purificada en 2026",
      slug: "como-iniciar-negocio-agua-purificada",
      excerpt: "Descubre los pasos esenciales, requisitos legales y la inversión necesaria para montar una planta purificadora exitosa.",
      author: "Maximiliano R.",
      category: "Emprendimiento",
      image: "/img/purificadoras/purificadora-negocio.jpeg",
      published: true,
      blocks: [
        { id: "b1", type: "highlight", content: "¿Sabías que el consumo de agua limpia no es una tendencia, sino una necesidad diaria que no se detiene? En 2026, el negocio del agua purificada se consolida como uno de los modelos más estables y rentables de México." },
        { id: "b2", type: "paragraph", content: "Iniciar una purificadora hoy no es solo vender garrafones; es construir una infraestructura de bienestar que, bien ejecutada, se convierte en un activo que genera ingresos constantes y escalables." },
        { id: "b3", type: "heading", content: "1. Investigación de Mercado: Tu Brújula al Éxito", accent: "cyan" },
        { id: "b4", type: "paragraph", content: "Antes de invertir un solo peso, necesitas entender el terreno. Muchos cometen el error de buscar zonas 'sin competencia', pero la verdadera oportunidad está en otro lado." },
        { id: "b5", type: "tip", content: "No busques zonas vacías. Busca zonas donde la competencia actual sea mediocre, lenta o descuidada. Ahí es donde tú vas a brillar." },
        { id: "b6", type: "heading", content: "2. Requisitos Legales: Blindaje desde el Día Uno", accent: "teal" },
        { id: "b7", type: "paragraph", content: "Para dormir tranquilo, tu negocio debe estar blindado. En México, el camino es claro pero exige atención al detalle:" },
        { id: "b8", type: "list", content: "COFEPRIS: Tu aviso de funcionamiento es tu acta de nacimiento comercial.\nUso de Suelo: La validación municipal de que tu local es apto para purificación.\nNormas Sanitarias: El estándar que garantiza que tu agua es la mejor de la colonia." },
        { id: "b9", type: "heading", content: "3. Elección del Equipo: Donde se Define tu Marca", accent: "cyan" },
        { id: "b10", type: "paragraph", content: "La calidad de tu agua es tu mejor publicidad. Si el agua sabe bien y es pura, el cliente regresa. Si no, perdiste una inversión." },
        { id: "b11", type: "heading", content: "4. Factor Vending: Dinero mientras Duermes", accent: "teal" },
        { id: "b12", type: "paragraph", content: "El modelo de 2026 exige automatización. Un sistema vending 24/7 permite que tu negocio venda sin personal y a toda hora. Es la diferencia entre tener un trabajo y tener un activo financiero." },
        { id: "b13", type: "heading", content: "5. Rentabilidad: ¿Cuánto ganarás realmente?", accent: "cyan" },
        { id: "b14", type: "paragraph", content: "Hablemos de números fríos. Un garrafón promedio se vende en $15 MXN, pero producirlo te cuesta apenas unos $3 a $5 MXN. La ganancia bruta es del 60% al 70%." },
        { id: "b15", type: "heading", content: "6. Estrategia 2026: El Triángulo de Hierro", accent: "teal" },
        { id: "b16", type: "paragraph", content: "El éxito hoy se basa en tres pilares: Mostrador Tradicional para generar confianza, Vending 24/7 para dar servicio y Productos Premium (como el agua alcalina) para maximizar el margen de utilidad." }
      ],
      content: `<p class="text-xl font-medium italic text-slate-500 mb-8 border-l-4 border-cyan-500 pl-4">¿Sabías que el consumo de agua limpia no es una tendencia, sino una necesidad diaria que no se detiene? En 2026, el negocio del agua purificada se consolida como uno de los modelos más estables y rentables de México.</p><p class="text-slate-600 leading-relaxed mb-6">Iniciar una purificadora hoy no es solo vender garrafones; es construir una infraestructura de bienestar que, bien ejecutada, se convierte en un activo que genera ingresos constantes y escalables.</p><h2 class="border-l-8 border-cyan-500 pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">1. Investigación de Mercado: Tu Brújula al Éxito</h2><p class="text-slate-600 leading-relaxed mb-6">Antes de invertir un solo peso, necesitas entender el terreno. Muchos cometen el error de buscar zonas 'sin competencia', pero la verdadera oportunidad está en otro lado.</p><div class="bg-cyan-50 p-6 rounded-2xl border border-cyan-100 my-8"><h4 class="font-black text-cyan-900 mb-2">💡 Tip clave de Darmax:</h4><p class="text-cyan-800 text-sm italic">No busques zonas vacías. Busca zonas donde la competencia actual sea mediocre, lenta o descuidada. Ahí es donde tú vas a brillar.</p></div><h2 class="border-l-8 border-[#168387] pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">2. Requisitos Legales: Blindaje desde el Día Uno</h2><p class="text-slate-600 leading-relaxed mb-6">Para dormir tranquilo, tu negocio debe estar blindado. En México, el camino es claro pero exige atención al detalle:</p><ul class="space-y-3 mb-8 list-disc pl-6 text-slate-600"><li>COFEPRIS: Tu aviso de funcionamiento es tu acta de nacimiento comercial.</li><li>Uso de Suelo: La validación municipal de que tu local es apto para purificación.</li><li>Normas Sanitarias: El estándar que garantiza que tu agua es la mejor de la colonia.</li></ul><h2 class="border-l-8 border-cyan-500 pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">3. Elección del Equipo: Donde se Define tu Marca</h2><p class="text-slate-600 leading-relaxed mb-6">La calidad de tu agua es tu mejor publicidad. Si el agua sabe bien y es pura, el cliente regresa. Si no, perdiste una inversión.</p><h2 class="border-l-8 border-[#168387] pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">4. Factor Vending: Dinero mientras Duermes</h2><p class="text-slate-600 leading-relaxed mb-6">El modelo de 2026 exige automatización. Un sistema vending 24/7 permite que tu negocio venda sin personal y a toda hora. Es la diferencia entre tener un trabajo y tener un activo financiero.</p><h2 class="border-l-8 border-cyan-500 pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">5. Rentabilidad: ¿Cuánto ganarás realmente?</h2><p class="text-slate-600 leading-relaxed mb-6">Hablemos de números fríos. Un garrafón promedio se vende en $15 MXN, pero producirlo te cuesta apenas unos $3 a $5 MXN. La ganancia bruta es del 60% al 70%.</p><h2 class="border-l-8 border-[#168387] pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">6. Estrategia 2026: El Triángulo de Hierro</h2><p class="text-slate-600 leading-relaxed mb-6">El éxito hoy se basa en tres pilares: Mostrador Tradicional para generar confianza, Vending 24/7 para dar servicio y Productos Premium (como el agua alcalina) para maximizar el margen de utilidad.</p>`
    },
    {
      title: "Vending 24/7: El secreto de los ingresos pasivos con productos de limpieza",
      slug: "rentabilidad-vending-productos-limpieza",
      excerpt: "¿Es rentable una máquina vending de detergentes? Analizamos el mercado y los costos operativos de este modelo innovador.",
      author: "Darmax Team",
      category: "Vending",
      image: "/img/vending/5productos.jpg",
      published: true,
      blocks: [
        { id: "v1", type: "paragraph", content: "Vender detergente, cloro y suavizante a granel a través de máquinas automáticas es una tendencia creciente que combina ecología con alta rentabilidad." },
        { id: "v2", type: "heading", content: "¿Por qué es rentable?", accent: "cyan" },
        { id: "v3", type: "paragraph", content: "El costo de los insumos químicos por litro es muy bajo comparado con el precio de venta al público. Además, eliminas el costo del envase, lo que atrae a clientes que buscan ahorrar y cuidar el medio ambiente reutilizando sus propios bidones." },
        { id: "v4", type: "heading", content: "Operación Automatizada", accent: "teal" },
        { id: "v5", type: "paragraph", content: "A diferencia de una tienda física, una vending de limpieza no requiere empleados. Solo necesitas reabastecer los tanques periódicamente y retirar las ganancias del monedero." }
      ],
      content: `<p class="text-slate-600 leading-relaxed mb-6">Vender detergente, cloro y suavizante a granel a través de máquinas automáticas es una tendencia creciente que combina ecología con alta rentabilidad.</p><h2 class="border-l-8 border-cyan-500 pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">¿Por qué es rentable?</h2><p class="text-slate-600 leading-relaxed mb-6">El costo de los insumos químicos por litro es muy bajo comparado con el precio de venta al público. Además, eliminas el costo del envase, lo que atrae a clientes que buscan ahorrar y cuidar el medio ambiente reutilizando sus propios bidones.</p><h2 class="border-l-8 border-[#168387] pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">Operación Automatizada</h2><p class="text-slate-600 leading-relaxed mb-6">A diferencia de una tienda física, una vending de limpieza no requiere empleados. Solo necesitas reabastecer los tanques periódicamente y retirar las ganancias del monedero.</p>`
    },
    {
      title: "Ósmosis Inversa vs. Agua Alcalina: ¿Qué prefieren los clientes?",
      slug: "osmosis-inversa-vs-agua-alcalina",
      excerpt: "Comparamos ambas tecnologías para que decidas cuál es la mejor opción para tu zona y tipo de mercado.",
      author: "Erick J.",
      category: "Tecnología",
      image: "/img/vending/TOUCHAGUA.png",
      published: true,
      blocks: [
        { id: "o1", type: "highlight", content: "Imagina que estás a punto de abrir las puertas de tu propia purificadora. Tienes el local, las ganas y el mercado... pero surge la duda que separa a los negocios que sobreviven de los que dominan: ¿Ósmosis inversa o Agua Alcalina?" },
        { id: "o2", type: "paragraph", content: "Esta no es solo una pregunta técnica; es el corazón de tu estrategia comercial. En el mundo del agua purificada, la respuesta no es blanco o negro, sino una escala de grises que, bien entendida, se traduce en billetes en tu caja registradora." },
        { id: "o3", type: "heading", content: "La Ósmosis Inversa: Tu Motor Imparable", accent: "cyan" },
        { id: "o4", type: "paragraph", content: "Si tu purificadora fuera un edificio, la ósmosis inversa sería los cimientos. Es el proceso más confiable y el 'estándar de oro' en la industria." },
        { id: "o5", type: "list", content: "Pureza Extrema: Elimina hasta el 99% de contaminantes, sales y bacterias.\nSabor de Cristal: Al reducir metales pesados, el agua recupera esa ligereza que el cliente ama." },
        { id: "o6", type: "heading", content: "Agua Alcalina: El Salto al Estatus Premium", accent: "teal" },
        { id: "o7", type: "paragraph", content: "Aquí es donde el juego cambia. Si la ósmosis es el motor, el agua alcalina es el acabado de lujo. Se trata de elevar el pH por encima de 8.5 después de la purificación." },
        { id: "o8", type: "list", content: "Valor Percibido: Los clientes la asocian con bienestar, balance y salud.\nRentabilidad: Muchos de nuestros socios venden el garrafón alcalino a 1.5x o incluso 2x el precio del normal." },
        { id: "o9", type: "heading", content: "El Duelo de Perfiles: ¿Qué buscan ellos?", accent: "cyan" },
        { id: "o10", type: "paragraph", content: "Para ganar, debes conocer a tus personajes: El Tradicional busca precio (Ósmosis), mientras que El Consciente busca bienestar (Alcalina)." }
      ],
      content: `<p class="text-xl font-medium italic text-slate-500 mb-8 border-l-4 border-cyan-500 pl-4">Imagina que estás a punto de abrir las puertas de tu propia purificadora. Tienes el local, las ganas y el mercado... pero surge la duda que separa a los negocios que sobreviven de los que dominan: ¿Ósmosis inversa o Agua Alcalina?</p><p class="text-slate-600 leading-relaxed mb-6">Esta no es solo una pregunta técnica; es el corazón de tu estrategia comercial. En el mundo del agua purificada, la respuesta no es blanco o negro, sino una escala de grises que, bien entendida, se traduce en billetes en tu caja registradora.</p><h2 class="border-l-8 border-cyan-500 pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">La Ósmosis Inversa: Tu Motor Imparable</h2><p class="text-slate-600 leading-relaxed mb-6">Si tu purificadora fuera un edificio, la ósmosis inversa sería los cimientos. Es el proceso más confiable y el 'estándar de oro' en la industria.</p><ul class="space-y-3 mb-8 list-disc pl-6 text-slate-600"><li>Pureza Extrema: Elimina hasta el 99% de contaminantes, sales y bacterias.</li><li>Sabor de Cristal: Al reducir metales pesados, el agua recupera esa ligereza que el cliente ama.</li></ul><h2 class="border-l-8 border-[#168387] pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">Agua Alcalina: El Salto al Estatus Premium</h2><p class="text-slate-600 leading-relaxed mb-6">Aquí es donde el juego cambia. Si la ósmosis es el motor, el agua alcalina es el acabado de lujo. Se trata de elevar el pH por encima de 8.5 después de la purificación.</p><ul class="space-y-3 mb-8 list-disc pl-6 text-slate-600"><li>Valor Percibido: Los clientes la asocian con bienestar, balance y salud.</li><li>Rentabilidad: Muchos de nuestros socios venden el garrafón alcalino a 1.5x o incluso 2x el precio del normal.</li></ul><h2 class="border-l-8 border-cyan-500 pl-6 py-3 text-2xl md:text-3xl font-black text-slate-900 bg-slate-50 rounded-r-2xl mt-16 mb-8 shadow-sm">El Duelo de Perfiles: ¿Qué buscan ellos?</h2><p class="text-slate-600 leading-relaxed mb-6">Para ganar, debes conocer a tus personajes: El Tradicional busca precio (Ósmosis), mientras que El Consciente busca bienestar (Alcalina).</p>`
    }
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`✅ Restaurado: ${post.title}`);
  }

  console.log('✨ ¡Contenido original restaurado con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
