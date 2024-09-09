const nodemailer = require("nodemailer");

const mailTransporter = function (host, port, user, pass) {
  return nodemailer.createTransport({
    host: host,
    port: port || 587,
    secure: false,
    auth: {
      user: user,
      pass: pass,
    },
  });
};

module.exports = mailTransporter;
