const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const mongoose = require('mongoose').set('debug', true)
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
var compression = require('compression')
const fs = require('fs')

const port = 80
options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auth: {
    authSource: 'admin'
  },
  user: 'mobile',
  pass: 'Gautampatel@0261'
}
mongoose
  .connect(process.env.MONGODB_URI || process.env.MONGO_DATABASE, options, () =>
    console.log('mongoconnected')
  )
  .catch(error => {
    console.error('App starting error:', error.stack)
    process.exit(1)
  })

const authRoutes = require('./routers/auth')
const postRoutes = require('./routers/post')
const fileRoutes = require('./routers/fileupload')
const imageRoutes = require('./routers/imageManipulate')
app.use(express.json())

app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(morgan('dev'))
app.use(compression())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})
app.use(express.static('uploads'))
app.use(fileUpload())
app.use('/auth', authRoutes)
app.use('/post', postRoutes)
app.use('/file', fileRoutes)
app.use('/image', imageRoutes)

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  console.log(process.env.NODE_ENV)
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

// app.get('/image/:id', (req, res) => {
//   console.log('Home page visited!')
//   const filePath = path.resolve(__dirname, 'client', 'build', 'index.html')

//   // read in the index.html file
//   fs.readFile(filePath, 'utf8', function (err, data) {
//     if (err) {
//       return console.log('read error', err)
//     }
//     data = data.replace(/\$OG_TITLE/g, 'Home Page')
//     data = data.replace(/\$OG_DESCRIPTION/g, 'Home page description')
//     result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png')
//     res.send(result)
//   })
// })

// app.use((req, res, next) => {
//   const error = new Error('Not found')
//   error.status = 404
//   next(error)
// })

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

app.listen(port, () => console.log('server running at ', port))
