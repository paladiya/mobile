const sharp = require('sharp')
const router = require('express').Router()
const path = require('path')

router.get('/resize/:imageId', (req, res) => {
  console.log(req.params.imageId)
  console.log(req.params.imageId.split('.'))
  sharp(path.join(__dirname, `/../uploads/image/${req.params.imageId}`))
    .toFormat('webp')
    .resize(300, 300)
    .webp({ lossless: true, quality: 50, alphaQuality: 50, force: false })
    .toBuffer()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router
