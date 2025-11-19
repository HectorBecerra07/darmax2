// server/utils/mailer.js
import nodemailer from "nodemailer";
import { getOrderEmailTemplate } from "../utils/templates/orderEmailTemplate.js";


console.log("GMAIL_USER:", process.env.GMAIL_USER); // 👈 esto debe mostrarse en consola

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendOrderEmail = async ({ to, subject, html }) => {
  console.log("Enviando correo a:", to); // 👈 log para verificar

  await transporter.sendMail({
    from: `"Darmax" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
