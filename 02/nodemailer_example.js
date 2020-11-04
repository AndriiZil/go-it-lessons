const nodemailer = require("nodemailer");

const { error } = require('dotenv').config();

if (error) {
    throw new Error(error);
}


async function main() {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  const msg = await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: "andrii.zilnyk@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?",
  });

  console.log("Message sent: ", msg);

}

main().catch(console.error);
