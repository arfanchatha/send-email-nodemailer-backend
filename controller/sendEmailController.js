const fs = require("fs");
const path = require("path");
const util = require("util");
const sendEmail = require("../sendEmail");
const AppError = require("../errorController/appError");
const { deleteAllFiles } = require("./deleteAllFilesController");

const readdir = util.promisify(fs.readdir); // Promisify fs.readdir

exports.sendEmails = async (req, res, next) => {
  const userInputData = { ...req.body };

  // Directory containing files
  const directoryPath = `${__dirname}/../attachments`;

  try {
    // Read files from the directory
    const files = await readdir(directoryPath);

    const message = [];

    // Iterate over files and send emails
    for (const file of files) {
      if (path.extname(file) === ".pdf") {
        const recipient = path.basename(file, ".pdf"); // Extract email from filename
        const attachmentPath = path.join(directoryPath, file);
        // const { subject } = userInputData;
        // const { body } = userInputData;

        try {
          await sendEmail(
            recipient,
            // subject,
            // body,
            attachmentPath,
            userInputData
          );
          message.push(recipient);
        } catch (err) {
          return next(new AppError(err, 400));
        }
      }
    }
    deleteAllFiles(directoryPath);

    res.status(200).json({
      status: "success",
      message:
        `Email sent to ${message}. Uploaded files are deleted` ?? "Email Sent",
    });
  } catch (err) {
    // console.error("Error reading directory or sending emails:", err);
    res.status(400).json({
      status: "fail",
      error: `"Error reading directory or sending emails:", ${err}`,
    });
  }
};
