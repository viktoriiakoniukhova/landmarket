const nodemailer = require("nodemailer");

const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.LM_EMAIL,
    pass: process.env.LM_PASSWORD,
  },
};

const send = async (data) => {
  const transporter = nodemailer.createTransport(config);
  const result = await transporter.sendMail(data);
  return result.accepted[0];
};

module.exports = { send };
