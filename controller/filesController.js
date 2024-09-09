const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { deleteAllFiles, deleteSingleFile } = require("./deleteFilesController");
const { getFileNames } = require("./readFilesNames");
const AppError = require("../errorController/appError");

exports.createDirectory = (req, res, next) => {
  const dirName = req.params.id;

  const fullPath = `${__dirname}/../attachments/${dirName}`;

  // Check if the directory exists
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Directory does not exist, create it
      fs.mkdir(fullPath, { recursive: true }, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error creating directory", error: err });
        }
        // Proceed to the next middleware or route handler
        next();
      });
    } else {
      // Directory exists, proceed to the next middleware or route handler
      next();
    }
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirName = req.params.id;

    const fullPath = `${__dirname}/../attachments/${dirName}`;

    cb(null, fullPath); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

exports.upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    // if (path.extname(file.originalname).toLowerCase() !== ".pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    // }
    cb(null, true);
  },
});

exports.uploadFiles = (req, res) => {
  try {
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

exports.deleteUploadedFiles = async (req, res) => {
  try {
    const tempId = req.params.id;
    const folderPath = `${__dirname}/../attachments/${tempId}`;

    deleteAllFiles(folderPath);

    res.status(200).json({
      status: "success",
      message: `All files associated with ID ${tempId} are deleted`,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deletFileWithName = async (req, res, next) => {
  try {
    const tempId = req.params.id;
    const fileName = `${req.params.filename}`;

    const filePath = `${__dirname}/../attachments/${tempId}/${fileName}`;

    await deleteSingleFile(filePath, fileName);

    res.status(200).json({
      status: "success",
      message: `File ${fileName} deleted successfully`,
    });
  } catch (err) {
    // Handle errors, such as permission issues
    return next(new AppError(`Error deleting file: ${err.message}`, 500));
  }
};

exports.getUploadedFilesName = async (req, res) => {
  try {
    const tempId = req.params.id;
    const folderPath = path.join(__dirname, "../attachments", tempId);

    const filesName = await getFileNames(folderPath);
    res.status(200).json({ status: "success", data: { filesName } });
  } catch (err) {
    // res.json(err);
    res.status(200).json({ status: "success", data: { filesName: [] } });

    // Send an error response to the client
    // res.status(404).json({ status: "fail", message: err.message });
  }
};
