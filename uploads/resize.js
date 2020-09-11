const path = require("path");
const fs = require("fs");
//joining path of directory
const directoryPath = path.join(__dirname, "image");
//passsing directoryPath and callback function
const sharp = require("sharp");

fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(async (file, index) => {
    // Do whatever you want to do with the file
    if (index != 0) {
      await sharp(path.join(__dirname, `/../uploads/image/${file}`))
        .resize(250, 300, { kernel: "cubic" })
        .toFile(path.join(__dirname, `/../uploads/resize/${file}`), function (
          imgError
        ) {
          if (imgError) {
            console.log(imgError);
          }
        });
    }
  });
});
