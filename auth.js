const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  var ip =
    (req.headers['x-forwarded-for'] || '')
      .split(',')
      .pop()
      .trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  const token = jwt.sign({ data: ip }, process.env.JSON_SECRET, {
    expiresIn: 60 * 60
  })
  console.log('auth ', req.header('authorization'))

  if (req.header('authorization')) {
    try {
      const decode = jwt.verify(
        req.header('authorization'),
        process.env.JSON_SECRET
      )
      console.log(decode)
      req.body.decode = decode
      next()
    } catch (e) {
      console.log(e)
      res.setHeader('authorization', token)
      next()
    }
  } else {
    res.setHeader('authorization', token)
    next()
  }
}
