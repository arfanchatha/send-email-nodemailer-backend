const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { deleteAllFiles } = require("./deleteAllFilesController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "attachments/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (path.extname(file.originalname).toLowerCase() !== ".pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

exports.uploadFiles = (req, res) => {
  try {
    // `req.files` contains information about the uploaded files
    const files = req.files;
    res.status(200).json({
      message: "Files uploaded successfully!",
      files: files.map((file) => ({
        filename: file.originalname,
        path: file.path,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create 'uploads' directory if it doesn't exist
const uploadDir = "attachments";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

exports.deleteUploadedFiles = (req, res) => {
  // Read the contents of the directory
  try {
    const folderPath = `${__dirname}/../attachments`;
    deleteAllFiles(folderPath);
    res.status(204).json({ status: "deleted" });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
