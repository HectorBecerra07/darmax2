// server/utils/mailer.js
import nodemailer from "nodemailer";

console.log("GMAIL_USER:", process.env.GMAIL_USER); // Debug log to check env var

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/**
 * Sends an email.
 * @param {Object} mailOptions - The mail options.
 * @param {string} mailOptions.to - The recipient's email address.
 * @param {string} mailOptions.subject - The subject of the email.
 * @param {string} mailOptions.html - The HTML content of the email.
 */
export const sendEmail = async ({ to, subject, html }) => {
  console.log("Enviando correo a:", to); // Log for verification

  await transporter.sendMail({
    from: `"Darmax" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
