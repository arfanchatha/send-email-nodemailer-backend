// const nodemailer = require("nodemailer");
const path = require("path");

const mailTransporter = require("./mailTransporter");
const AppError = require("./errorController/appError");
const { deleteSingleFile } = require("./controller/deleteFilesController");

const sendEmail = async function (
  recipient,
  // subject,
  // body,
  attachmentPath,
  userInputData,
  next
) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Configure your SMTP server settings
  const { host, port, user, pass, subject, cc, body } = userInputData;
  const transporter = mailTransporter(host, port, user, pass);

  // Function to send email
  const mailOptions = {
    from: "NAME@gmail.com",
    to: recipient,
    subject: subject,
    text: body,
    cc: cc,
    attachments: [
      {
        filename: path.basename(attachmentPath),
        path: attachmentPath,
      },
    ],
  };

  if (!emailRegex.test(recipient)) {
    // throw new Error(
    return `Invalid recipient email ${recipient}.`;

    // );
  }
  try {
    const result = await transporter.sendMail(mailOptions);

    if (result.rejected.length > 0) {
      throw new Error(`Email to recipient ${recipient} is invalid`);
    }
    deleteSingleFile(attachmentPath);
  } catch (err) {
    console.log(err);
    throw new Error(new AppError(`Failed to send email to ${recipient}`, 400));

    // next(new AppError(`${err} Failed to send email to ${recipient}`));
  }
};

module.exports = sendEmail;
