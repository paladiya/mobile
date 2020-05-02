const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const mongoose = require('mongoose').set('debug', true)
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 8000
mongoose
  .connect(
    process.env.MONGODB_URI || process.env.MONGO_DATABASE,
    { useNewUrlParser: true },
    () => console.log('mongoconnected')
  )
  .catch(error => {
    console.error('App starting error:', error.stack)
    process.exit(1)
  })

const authRoutes = require('./routers/auth')
const postRoutes = require('./routers/post')
const fileRoutes = require('./routers/fileupload')
app.use(express.json())

app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser({ keepExtensions: true }))

app.use(express.static('uploads'))
app.use(morgan('dev'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

app.use(fileUpload())
app.use('/user', authRoutes)
app.use('/post', postRoutes)
app.use('/file', fileRoutes)

if (process.env.NODE_ENV === 'production') {
  console.log(process.env.NODE_ENV)
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

app.listen(port, () => console.log('server running at ', port))
