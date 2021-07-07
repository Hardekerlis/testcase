const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const cookie = req.session.jwt

  // Check if cookie is defined
  if (cookie) {
    // Decode the supplied cookie
    const decodedCookie = jwt.verify(cookie, process.env.JWT_KEY)

    // Check so the supplied cookie is/was valid
    // and if so add the data from cookie to user in req object and call next
    if (decodedCookie) {
      req.user = decodedCookie
      next()
    } else {
      // If the decodedCookie wasn't valid the session is cleared
      req.session = null

      res.status(400).json({
        msg: 'Your session is not valid. Please try to signin again',
      })
    }
  } else {
    // If the cookie wasn't defined
    res.status(400).json({
      msg: 'Please login before you do that',
    })
  }
}
