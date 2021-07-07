const { Router } = require('express')
const forgotPasswordRouter = Router()
const { body } = require('express-validator')

const User = require('../models/user')
const sendEmail = require('../services/email')
const validateRequest = require('../middlewares/validateRequest')

forgotPasswordRouter.post(
  '/forgotPassword',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please supply a valid email'),
  ],
  validateRequest,
  async (req, res) => {
    const { email } = req.body

    const user = User.findOne({ email })

    if (user) {
      await sendEmail(user.email, 'Reset password', '<p>Test</p>')
    } else {
      res.status(400).json({
        msg: 'No user with the supplied email was found',
      })
    }
  }
)

module.exports = forgotPasswordRouter
