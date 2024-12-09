import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.zeptomail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PWD,
  },
});

export default transporter;
