const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config({ path: "./config.env" });
const {
  deleteUploadedFiles,
  upload,
  uploadFiles,
  createDirectory,
  getUploadedFilesName,
  deletFileWithName,
} = require("./controller/filesController");
const { sendEmails } = require("./controller/sendEmailController");
const AppError = require("./errorController/appError");
const globalErrorHandling = require("./errorController/globalErrorHandling");

app.use(express.json());

app.use(cors());

app.post(
  "/api/v1/uploadfiles/:id",
  createDirectory,
  upload.array("files"),
  uploadFiles
);
app.get("/api/v1/uploadfilesnames/:id", getUploadedFilesName);
app.delete("/api/v1/deleteuploadedfiles/:id", deleteUploadedFiles);
app.delete("/api/v1/deletfilewithname/:id/:filename", deletFileWithName);

app.post("/api/v1/sendemailsfromattachments", sendEmails);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`This route ${req.originalUrl} is not found on server`)
  );
});

app.use(globalErrorHandling);

module.exports = app;
