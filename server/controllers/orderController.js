import { sendOrderEmail } from "../utils/mailer.js";
import { getOrderEmailTemplate } from "../utils/templates/orderEmailTemplate.js";

export const createOrder = async (req, res) => {
  const order = req.body;

  const html = getOrderEmailTemplate({
    name: order.name,
    orderId: order.id,
    date: order.date,
    total: order.total,
    product: order.product,
    url: `https://tusitio.com/pedidos/${order.id}`
  });

  await sendOrderEmail({
    to: order.email,
    subject: `Pedido #${order.id} confirmado`,
    html,
  });

  res.json({ ok: true });
};
