const router = require('express').Router()
const verifyToken = require('./verifyToken')
const file = require('../models/File')
const mongoose = require('mongoose')
const fs = require('fs')
const pagination = 24
const Auth = require('../auth')
const musicCat = []
const wallCat = []

router.get('/', verifyToken, (req, res) => {
  res.json({ post: { title: 'title', description: 'description' } })
})

router.post('/all', async (req, res) => {
  console.log('all = ', req.body)

  let pageNum = req.body.pageNum
  let _id = req.body._id
  if (_id === 0) {
    file
      .find({})
      .sort({ _id: -1 })
      .limit(pagination)
      .then(files => {
        console.log('files ', files.length)

        if (files.length > 0) {
          res
            .status(200)
            .json({ files: files, isLast: files.length < pagination })
        } else {
          res.status(200).json({ message: 'No Record Found' })
        }
      })
      .catch(error => {
        console.log('catch', error)
        res.status(500).json({ message: error })
      })
  }
  // if (req.body._id) {
  //   console.log(req.body._id)
  //   _id = req.body._id
  // } else {
  //   _id = false
  // }

  file
    .find({ _id: { $lt: mongoose.Types.ObjectId(_id) } })
    .sort({ _id: -1 })
    // .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then(files => {
      console.log('files ', files.length)

      if (files.length > 0) {
        res
          .status(200)
          .json({ files: files, isLast: files.length < pagination })
      } else {
        res.status(200).json({ message: 'No Record Found' })
      }
    })
    .catch(error => {
      console.log('catch', error)
      res.status(500).json({ message: error })
    })
})

router.post('/ringtones', async (req, res) => {
  let pageNum = req.body.pageNum

  file
    .find({ types: 'music' })
    .sort({ _id: -1 })
    .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then(files => {
      console.log('files ', files.length)

      if (files.length > 0) {
        res.status(200).json({ files: files })
      } else {
        res.status(200).json({ message: 'No Record Found' })
      }
    })
    .catch(error => {
      console.log('catch', error)
      res.status(500).json({ message: error })
    })
})

router.post('/wallpaper', async (req, res) => {
  let pageNum = req.body.pageNum

  file
    .find({ types: 'image' })
    .sort({ _id: -1 })
    .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then(files => {
      console.log('files ', files.length)

      if (files.length > 0) {
        res.status(200).json({ files: files })
      } else {
        res.status(200).json({ message: 'No Record Found' })
      }
    })
    .catch(error => {
      console.log('catch', error)
      res.status(500).json({ message: error })
    })
})

router.post('/find', async (req, res) => {
  console.log(req.body.searchTerm)
  let pageNum = req.body.pageNum
  const searchTerm = req.body.searchTerm
  file
    .find({
      $or: [
        { fileOriginName: { $regex: searchTerm, $options: 'i' } },
        { fileTags: { $in: [searchTerm] } },
        { userName: { $regex: searchTerm, $options: 'i' } }
      ]
    })
    .sort({ _id: -1 })
    .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then(files => {
      console.log('files ', files.length)

      if (files.length > 0) {
        res.status(200).json({ files: files })
      } else {
        res.status(200).json({ message: 'No Record Found' })
      }
    })
    .catch(error => {
      console.log('catch', error)
      res.status(500).json({ message: error })
    })
})

router.post('/byuser', verifyToken, async (req, res) => {
  console.log('byuser', req.user)
  let pageNum = req.body.pageNum

  file
    .find({
      userId: req.user._id
    })
    .sort({ _id: -1 })
    .skip((pageNum - 1) * pagination)
    .limit(pagination)
    .then(files => {
      console.log('files ', files.length)

      if (files.length > 0) {
        res.status(200).json({ files: files })
      } else {
        res.status(200).json({ message: 'No Record Found' })
      }
    })
    .catch(error => {
      console.log('catch', error)
      res.status(500).json({ message: error })
    })
})

router.post('/getpost', async (req, res) => {
  try {
    const itemId = req.body.itemId

    const result = await file.findOne({
      _id: itemId
    })
    console.log(result)
    if (result) {
      res.status(200).json({ post: result, status: 200 })
    } else {
      res.status(204).json({ msg: 'Something Went Wrong Try Again' })
    }
  } catch {
    res.status(204).json({ msg: 'Something Went Wrong Try Again' })
  }
})

router.post('/plusDownload', async (req, res) => {
  const result = await file.findOneAndUpdate(
    { _id: req.body.postId },
    { $inc: { downloads: 1 } },
    { new: true }
  )
  if (result) {
    res.status(200).json({ ...result, status: 200 })
  } else {
    res.status(204).json({ msg: 'Something Went Wrong Try Again' })
  }
})

router.post('/delete', verifyToken, async (req, res) => {
  console.log('byuser', req.body)
  const id = req.body.id
  const result = await file.findByIdAndDelete({
    _id: id
  })
  console.log(result)
  const path = `${__dirname}/../../front-end/public/uploads/${result.types}/${result.fileName}`

  try {
    fs.unlinkSync(path)
    //file removed
  } catch (err) {
    console.error(err)
  }
  if (result) {
    res.status(200).json({ result: result })
  } else {
    res.status(204).json({ msg: 'Something Went Wrong Try Again' })
  }
})

router.get('/musicCat', (req, res) => {})

module.exports = router
