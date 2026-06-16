import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: env.smtp.from,
    to: env.smtp.contactTo,
    replyTo: data.email,
    subject: `Website inquiry: ${data.subject}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      '',
      data.message,
    ].join('\n'),
  });
}
