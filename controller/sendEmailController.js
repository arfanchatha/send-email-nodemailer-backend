const fs = require("fs");
const path = require("path");
const util = require("util");
const sendEmail = require("../sendEmail");
const AppError = require("../errorController/appError");
const { deleteAllFiles } = require("./deleteFilesController");

const readdir = util.promisify(fs.readdir); // Promisify fs.readdir

exports.sendEmails = async (req, res, next) => {
  const userInputData = { ...req.body };
  console.log(userInputData);

  const dirName = userInputData.tempId;

  const directoryPath = `${__dirname}/../attachments/${dirName}`;

  try {
    const files = await readdir(directoryPath);

    const message = [];

    for (const file of files) {
      
        // const recipient = path.basename(file, ".pdf"); // Extract email from filename

        const ext = path.extname(file);
        const recipient = path.basename(file, ext);
        const attachmentPath = path.join(directoryPath, file);

        try {
          const result = await sendEmail(
            recipient,

            attachmentPath,
            userInputData
          );
          if (`${result}`.startsWith("Invalid")) {
            throw new Error(result);
          }
          message.push(recipient);
        } catch (err) {
          return next(
            new AppError(
              message.length > 0
                ? `Email sent to ${message.length}: ${message} and  ${err.message} and after that`
                : `${err.message} and failed sending after that`,
              400
            )
          );
        }
      
    }

    deleteAllFiles(directoryPath);

    res.status(200).json({
      status: "success",
      message: `${message}. Uploaded files are deleted` ?? "Email Sent",
      data: { recipient: message },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      // data: { sent: message },
      error: err.message,
    });
  }
};
