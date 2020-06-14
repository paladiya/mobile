const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
  const token = req.header('auth-token')

  if (!token) {
    return res.status(403).json({ message: 'Access Denied' })
  }

  try {
    const verified = jwt.verify(token, process.env.JSON_SECRET)
    req.user = verified
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token' })
  }
}
