const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const { deleteAllFiles } = require("./deleteAllFiles");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// Configure your SMTP server settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Directory containing files
const directoryPath = `${__dirname}/attachments`;

// Function to send email
async function sendEmail(recipient, subject, body, attachmentPath) {
  const mailOptions = {
    from: "chatha.arfan@gmail.com",
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
    console.log(`Email sent to ${recipient}`);
    deleteAllFiles(directoryPath);
  } catch (error) {
    deleteAllFiles(directoryPath);
    console.error(`Failed to send email to ${recipient}:`, error.message);
  }
}

// Read files from the directory and send emails
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Unable to read directory:", err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === ".pdf") {
      // Modify this if you're using different file types
      const recipient = path.basename(file, ".pdf"); // Extract email from filename
      const attachmentPath = path.join(directoryPath, file);
      const subject = "Salary Transferred";
      const body = "Salary for the month of Aug-24 \n HR";

      sendEmail(recipient, subject, body, attachmentPath);
    }
  });
});
