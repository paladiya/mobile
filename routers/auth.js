const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { registerValidation, loginValidation } = require('../validation')
const jwt = require('jsonwebtoken')

// googleRegister

router.post('/googleRegister', async (req, res) => {
  console.log('call googleRegister' + JSON.stringify(req.body))
  // const { error } = registerValidation(req.body)
  // if (error) {
  //   return res.status(400).json(error.details[0].message)
  // }

  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) {
    console.log('emailExist ', emailExist)

    const token = jwt.sign({ _id: emailExist._id }, process.env.JSON_SECRET)
    return res
      .header('authentication', token)
      .send({ status: 200, id: emailExist.id })
  }

  const salt = await bcrypt.genSalt(10)
  // const hashPass = await bcrypt.hash(req.body.gwt, salt)
  const hashPass = req.body.gwt

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPass
  })
  try {
    const savedUser = await user.save()
    const token = jwt.sign({ _id: savedUser._id }, process.env.JSON_SECRET)
    return res.header('authentication', token).send({
      status: 200,
      id: savedUser.id
    })
  } catch (error) {
    res.send({
      title: error,
      status: 403
    })
  }
})

// require('dotenv').config()
router.post('/register', async (req, res) => {
  console.log('call register' + JSON.stringify(req.body))
  // const { error } = registerValidation(req.body)
  // if (error) {
  //   return res.status(400).json(error.details[0].message)
  // }

  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) {
    return res.status(422).send({
      message: `${req.body.email} is already taken`
    })
  }

  const salt = await bcrypt.genSalt(10)
  const hashPass = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPass
  })
  try {
    const savedUser = await user.save()
    const token = jwt.sign({ _id: savedUser._id }, process.env.JSON_SECRET)
    await delete savedUser.password
    console.log('user', savedUser.password)
    res.header('authentication', token).send({ status: 200, user: savedUser })
  } catch (error) {
    return res.status(403).send({
      message: error
    })
  }
})

router.post('/login', async (req, res) => {
  console.log('call login' + JSON.stringify(req.body))

  const { error } = loginValidation(req.body)
  if (error) {
    console.log('validation error')
    console.log(error.details[0].message)
    return res.status(403).send({
      message: error.details[0].message
    })
  }

  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    console.log('find error')

    return res.status(403).send({
      message: 'Incorrect username or password.'
    })
  }

  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) {
    console.log('pass error')

    return res.status(403).send({
      message: 'Incorrect username or password.'
    })
  }

  const token = jwt.sign({ _id: user._id }, process.env.JSON_SECRET)

  return res
    .header('authentication', token)
    .status(200)
    .send({ user })
})

module.exports = router
