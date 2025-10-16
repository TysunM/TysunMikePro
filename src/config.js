import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  sendgridKey: process.env.SENDGRID_API_KEY,
  mailFrom: process.env.MAIL_FROM,
  baseUrl: process.env.BASE_URL
};
