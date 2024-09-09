const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");

exports.deleteSingleFile = async function (filePath, fileName) {
  if (fs.existsSync(filePath)) {
    // Delete the file
    return fs.unlinkSync(filePath);
  } else {
    // return next(new AppError(`File ${fileName} not found`, 404));
    throw Error(`File ${fileName} not found`);
  }
};

exports.deleteAllFiles = async function (folderPath) {
  try {
    // await fs.unlink(folderPath);
    await fsPromise.rm(folderPath, { recursive: true, force: true });
  } catch (error) {}
};
