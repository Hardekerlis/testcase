const { Router } = require('express')
const removeAccountRouter = Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const verifySession = require('../middlewares/verifySession')

removeAccountRouter.delete(
  '/removeAccount',
  verifySession, // This middleware checks if user is logged in
  async (req, res) => {
    const user = req.user

    const result = await User.findOneAndRemove({ email: user.email })

    // If the user gets to this stage either they have a faulty cookie and it
    // should be removed or the user has a valid cookie and gets their account
    // removed and no longer needs the cookie
    req.session = null

    if (!result) {
      res.status(400).json({
        msg: 'The account is already removed',
      })
    } else {
      res.status(200).json({
        msg: 'Your account has been deleted',
      })
    }
  }
)

module.exports = removeAccountRouter
