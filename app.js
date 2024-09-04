const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config({ path: "./config.env" });
const {
  deleteUploadedFiles,
  upload,
  uploadFiles,
} = require("./controller/filesUploadController");
const { sendEmails } = require("./controller/sendEmailController");
const AppError = require("./errorController/appError");
const globalErrorHandling = require("./errorController/globalErrorHandling");

app.use(express.json());

app.use(cors());

app.post("/api/v1/uploadfiles", upload.array("files"), uploadFiles);
app.delete("/api/v1/deleteuploadedfiles", deleteUploadedFiles);

app.post("/api/v1/sendemailsfromattachments", sendEmails);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`This route ${req.originalUrl} is not found on server`)
  );
});

app.use(globalErrorHandling);

module.exports = app;
