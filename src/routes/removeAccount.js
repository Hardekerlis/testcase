const { Router } = require('express')
const removeAccountRouter = Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const verifySession = require('../middlewares/verifySession')

removeAccountRouter.delete(
  '/removeAccount',
  verifySession,
  async (req, res) => {
    const user = req.user

    const result = await User.findOneAndRemove({ email: user.email })

    if (!result) {
      res.status(400).json({
        msg: 'The account is already removed',
      })
    } else {
      req.session = null

      res.status(200).json({
        msg: 'Your account has been deleted',
      })
    }
  }
)

module.exports = removeAccountRouter
