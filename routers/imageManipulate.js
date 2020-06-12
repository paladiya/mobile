const sharp = require('sharp')
const router = require('express').Router()
const path = require('path')

router.get('/resize/:imageId', (req, res) => {
  console.log(req.params.imageId)
  console.log(req.params.imageId.split('.'))
  sharp(path.join(__dirname, `/../uploads/image/${req.params.imageId}`))
    .resize({
      width: 200,
      height: 300,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy
    })
    .toBuffer()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router
