const sharp = require('sharp')
const router = require('express').Router()
const path = require('path')

router.get('/resize/:imageId', (req, res) => {
  sharp(path.join(__dirname, `../uploads/image/${req.params.imageId}`))
    .webp({ lossless: true, quality: 60, alphaQuality: 80, force: false })
    .toBuffer()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router
