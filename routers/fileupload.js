const router = require("express").Router();
const jwt = require("jsonwebtoken");
const File = require("../models/File");
var mongoose = require("mongoose");

var extensionLists = {}; //Create an object for all extension lists
// var video = ['m4v', 'avi', 'mpg', 'mp4', 'webm']
var video = [];
var image = ["jpg", "gif", "bmp", "png", "jpeg", "ico"];
var music = ["wav", "mp3", "aac", "ogg"];

// One validation function for all file types
function isValidFileType(fName, fType) {
  return extensionLists[fType].indexOf(fName.split(".").pop()) > -1;
}

router.post("/upload", async (req, res) => {
  console.log("upload ", req);
  if (req.files == null) {
    return res.status(403).json({ message: "no files uploaded" });
  }

  const file = req.files.file;
  const fileOriginName = req.body.fileOriginName;
  const fileTags = req.body.fileTag.split(",");
  const userName = req.body.userName;
  const jwtToken = req.header("auth-token");
  console.log("file", file);
  console.log(req.body);

  jwt.verify(jwtToken, process.env.JSON_SECRET, function (error, decoded) {
    console.log("err", error);
    if (!error) {
      let fileType = file.name.split(".").pop().toLowerCase();

      let newFileName = mongoose.Types.ObjectId() + "." + fileType;
      console.log("1", req.body.fileType);

      if (req.body.fileType == "image") {
        fileType = "image";
      } else if (req.body.fileType == "video") {
        fileType = "video";
      } else if (req.body.fileType == "audio") {
        fileType = "music";
      } else {
        fileType = undefined;
        return res
          .status(403)
          .json({ message: "please select valid media image" });
      }
      console.log("2", fileType);

      file.mv(`uploads/${fileType}/${newFileName}`, async (err) => {
        if (err) {
          return res.status(403).json({ msg: err });
        }

        const newFile = new File({
          fileName: newFileName,
          userId: decoded,
          types: fileType,
          size: file.size,
          fileOriginName: fileOriginName,
          userName,
          fileTags,
        });
        let savedFile;
        try {
          savedFile = await newFile.save();
        } catch (error) {
          res.status(403).send(error);
        }

        res.json({
          filename: newFileName,
          filepath: `${fileType}/${newFileName}`,
          savedFile: savedFile,
        });
      });
    } else {
      return res.status(401).json({ msg: "you are not valid user" });
    }
    // err
    // decoded undefined
  });
});

module.exports = router;
