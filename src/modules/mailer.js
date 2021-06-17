const path = require("path")
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "19a5e33b1ef2b9",
      pass: "8be596d877f4dc"
    }
});

module.exports = transport;