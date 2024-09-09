const fs = require("fs").promises;

exports.getFileNames = async (directory) => {
  try {
    // Check if the directory exists
    await fs.access(directory);

    // Read the directory contents
    const files = await fs.readdir(directory);
    return files;
  } catch (error) {
    // Throw a specific error to be handled by the caller
    if (error.code === "ENOENT") {
      throw new Error("Directory does not exist");
    } else if (error.code === "EACCES") {
      throw new Error("Access denied to the directory");
    } else {
      // return [];
      throw new Error("Error reading the directory: " + error.message);
    }
  }
};

//exports.getFileNames= function (directory) {
//   return new Promise((resolve, reject) => {
//     fs.readdir(directory, (err, files) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(files);
//       }
//     });
//   });
// }
