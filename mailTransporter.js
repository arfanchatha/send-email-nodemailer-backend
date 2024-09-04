const nodemailer = require("nodemailer");

const mailTransporter = function (host, port = 587, user, pass) {
  console.log(port);
  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: false,
    auth: {
      user: user,
      pass: pass,
    },
  });
};

module.exports = mailTransporter;
