import sgMail from '@sendgrid/mail';
import { config } from './config.js';
sgMail.setApiKey(config.sendgridKey);

export async function sendMail(to, subject, html) {
  const msg = { to, from: config.mailFrom, subject, html };
  await sgMail.send(msg);
}
