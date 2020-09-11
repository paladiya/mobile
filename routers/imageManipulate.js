const sharp = require("sharp");
const path = require("path");
const router = require("express").Router();

// router.get("/resize/:imageId", (req, res) => {
//   sharp(path.join(__dirname, `/../uploads/image/${req.params.imageId}`))
//     .toFormat("webp")
//     .resize(250, 300)
//     // .webp({ lossless: true, quality: 50, alphaQuality: 50, force: false })
//     .toBuffer()
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {});
// });

module.exports = router;
