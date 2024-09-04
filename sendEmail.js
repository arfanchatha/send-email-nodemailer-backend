// const nodemailer = require("nodemailer");
const path = require("path");

const mailTransporter = require("./mailTransporter");

const sendEmail = async function (
  recipient,
  // subject,
  // body,
  attachmentPath,
  userInputData
) {
  // Configure your SMTP server settings
  const { host, port, user, pass, subject, body } = userInputData;
  const transporter = mailTransporter(host, port, user, pass);

  // const transporter = nodemailer.createTransport({
  //   host: process.env.GMAIL_HOST,
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: process.env.GMAIL_USERNAME,
  //     pass: process.env.GMAIL_PASSWORD,
  //   },
  // });

  // Function to send email
  const mailOptions = {
    from: "NAME@gmail.com",
    to: recipient,
    subject: subject,
    text: body,
    attachments: [
      {
        filename: path.basename(attachmentPath),
        path: attachmentPath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Failed to send email to ${recipient}.`);
  }
};

module.exports = sendEmail;
