const fs = require("fs");
const path = require("path");

exports.deleteAllFiles = function (folderPath) {
  // Read the contents of the directory
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Iterate over the files in the directory
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Check if the path is a file (not a directory)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isFile()) {
          // Delete the file
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log(`Deleted: ${filePath}`);
            }
          });
        }
      });
    });
  });
};
