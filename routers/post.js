const router = require("express").Router();
const verifyToken = require("./verifyToken");
const file = require("../models/File");
const mongoose = require("mongoose");
const fs = require("fs");
const pagination = 24;
const Auth = require("../auth");
const e = require("express");
const musicCat = [];
const wallCat = [];

router.get("/", verifyToken, (req, res) => {
  res.json({ post: { title: "title", description: "description" } });
});

router.post("/userDownload", (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  console.log("userDownload");

  file.find({ userId: userId }).then((files, notFound) => {
    console.log(files);
    console.log(notFound);
    let download = 0;
    let downloadCount = 0;
    let upload = 0;

    if (files.length > 0) {
      upload = files.length;
      files.map((post) => {
        download += post.downloads;
      });
      res.status(200).send({ download: download, upload: upload });
    } else {
      res.status(500).send({ download: download, upload: upload });
    }
  });
});

router.post("/all", async (req, res) => {
  let _id = req.body._id;
  let find = {};
  if (_id !== 0) {
    find = { _id: { $lt: mongoose.Types.ObjectId(_id) } };
  }
  file
    .find(find)
    .sort({ _id: -1 })
    .limit(pagination)
    .then((files) => {
      if (files.length > 0) {
        res
          .status(200)
          .json({ files: files, isLast: files.length < pagination });
      } else {
        res.status(200).json({ message: "No Record Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.post("/ringtones", async (req, res) => {
  let _id = req.body._id;
  let find = { types: "music" };
  if (_id !== 0) {
    find = { ...find, _id: { $lt: mongoose.Types.ObjectId(_id) } };
  }
  file
    .find(find)
    .sort({ _id: -1 })
    .limit(pagination)
    .then((files) => {
      if (files.length > 0) {
        res
          .status(200)
          .json({ files: files, isLast: files.length < pagination });
      } else {
        res.status(200).json({ message: "No Record Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.post("/wallpaper", async (req, res) => {
  let _id = req.body._id;
  let find = { types: "image" };
  if (_id !== 0) {
    find = { ...find, _id: { $lt: mongoose.Types.ObjectId(_id) } };
  }
  file
    .find(find)
    .sort({ _id: -1 })
    .limit(pagination)
    .then((files) => {
      if (files.length > 0) {
        res
          .status(200)
          .json({ files: files, isLast: files.length < pagination });
      } else {
        res.status(200).json({ message: "No Record Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.post("/findInRingtones", async (req, res) => {
  let pageNum = req.body.pageNum;
  const searchTerm = req.body.searchTerm;
  file
    .find({
      $or: [
        { fileOriginName: { $regex: searchTerm, $options: "i" } },
        { fileTags: { $in: [searchTerm] } },
        { userName: { $regex: searchTerm, $options: "i" } },
      ],
      $and: [{ types: "music" }],
    })
    .sort({ _id: -1 })
    .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then((files) => {
      if (files.length > 0) {
        res
          .status(200)
          .json({ files: files, isLast: files.length < pagination });
      } else {
        res.status(200).json({ message: "No Record Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.post("/findInWallpapers", async (req, res) => {
  console.log("call");
  let pageNum = req.body.pageNum;
  const searchTerm = req.body.searchTerm;
  file
    .find({
      $or: [
        { fileOriginName: { $regex: searchTerm, $options: "i" } },
        { fileTags: { $in: [searchTerm] } },
        { userName: { $regex: searchTerm, $options: "i" } },
      ],
      $and: [{ types: "image" }],
    })
    .sort({ _id: -1 })
    .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then((files) => {
      if (files.length > 0) {
        res
          .status(200)
          .json({ files: files, isLast: files.length < pagination });
      } else {
        res.status(200).json({ message: "No Record Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.post("/findRelatedWallpapers", (req, res) => {
  try {
    console.log("findRelatedWallpapers");
    let pageNum = req.body.pageNum;
    const tags = JSON.parse(req.body.tags);
    console.log(tags);
    file
      .find({ fileTags: { $in: tags }, types: "image" })
      .sort({ _id: -1 })
      .skip((pageNum - 1) * pagination)
      .limit(pagination)
      .then((files) => {
        console.log("run");
        if (files.length > 0) {
          res
            .status(200)
            .json({ files: files, isLast: files.length < pagination });
        } else {
          res.status(200).json({ message: "No Record Found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error });
      });
  } catch (error) {
    console.log(error);
  }
});

router.post("/find", async (req, res) => {
  let pageNum = req.body.pageNum;
  const searchTerm = req.body.searchTerm;
  file
    .find({
      $or: [
        { fileOriginName: { $regex: searchTerm, $options: "i" } },
        { fileTags: { $in: [searchTerm] } },
        { userName: { $regex: searchTerm, $options: "i" } },
      ],
    })
    .sort({ _id: -1 })
    .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then((files) => {
      if (files.length > 0) {
        res
          .status(200)
          .json({ files: files, isLast: files.length < pagination });
      } else {
        res.status(200).json({ message: "No Record Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.post("/byuser", verifyToken, async (req, res) => {
  let pageNum = req.body.pageNum;

  file
    .find({
      userId: req.user._id,
    })
    .sort({ _id: -1 })
    .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then((files) => {
      if (files.length > 0) {
        res
          .status(200)
          .json({ files: files, isLast: files.length < pagination });
      } else {
        res.status(200).json({ message: "No Record Found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.post("/getpost", async (req, res) => {
  try {
    const itemId = req.body.itemId;

    const result = await file.findOne({
      _id: itemId,
    });
    if (result) {
      res.status(200).json({ post: result, status: 200 });
    } else {
      res.status(204).json({ msg: "Something Went Wrong Try Again" });
    }
  } catch {
    res.status(204).json({ msg: "Something Went Wrong Try Again" });
  }
});

router.post("/plusDownload", async (req, res) => {
  const result = await file.findOneAndUpdate(
    { _id: req.body.postId },
    { $inc: { downloads: 1 } },
    { new: true }
  );
  if (result) {
    res.status(200).json({ ...result, status: 200 });
  } else {
    res.status(204).json({ msg: "Something Went Wrong Try Again" });
  }
});

router.post("/delete", verifyToken, async (req, res) => {
  const id = req.body.id;
  const result = await file.findByIdAndDelete({
    _id: id,
  });
  const path = `${__dirname}/../../front-end/public/uploads/${result.types}/${result.fileName}`;

  try {
    fs.unlinkSync(path);
    //file removed
  } catch (err) {}
  if (result) {
    res.status(200).json({ result: result });
  } else {
    res.status(204).json({ msg: "Something Went Wrong Try Again" });
  }
});

router.post("/seoItems", (req, res) => {
  file.find({}).then((result, error) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: error });
    }
  });
});

router.get("/music", (req, res) => {
  res.send({ msg: "musix test" });
});

module.exports = router;
