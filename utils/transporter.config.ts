import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PWD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

export default transporter;
