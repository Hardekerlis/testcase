const { Router } = require('express')
const forgotPasswordRouter = Router()
const { body } = require('express-validator')

const User = require('../models/user')
const Session = require('../models/forgotPasswordSession')
const sendEmail = require('../services/email')
const validateRequest = require('../middlewares/validateRequest')

forgotPasswordRouter.post(
  '/forgotPassword',
  [
    body('email') // Check if email is valid
      .trim()
      .isEmail()
      .withMessage('Please supply a valid email'),
  ],
  validateRequest,
  async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })

    // Check if a user with that email exists
    if (user) {
      // Create a session to email to client
      const session = Session.build({ email })
      await session.save()

      // Send email to client with the reset link
      await sendEmail(
        user.email,
        'Reset password',
        `<a href="http://localhost:3000/resetPassword/${session.id}"></>`
      )

      // Since this is app is only backend you need to copy the address from the console : (
      console.log(`http://localhost:3000/resetPassword/${session.id}`)
      res.status(200).json({
        msg: 'Sent an email with a reset link. Please check your inbox',
      })
    } else {
      res.status(400).json({
        msg: 'No user with the supplied email was found',
      })
    }
  }
)

const forgotPasswordSessionRouter = Router()

// This is put becuase it's only backend. Someone needs to add a frontend
// with the same path to make this accessiable by user
forgotPasswordSessionRouter.put(
  '/resetPassword/:session',
  [
    body('password') // Check so password is valid
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage('Password must be between 5 and 20 characters'),
  ],
  validateRequest,
  async (req, res) => {
    const { password } = req.body
    const { session } = req.params

    const existingSession = await Session.findOne({ _id: session })

    if (existingSession) {
      // Check if a session exists with the session id
      // findOneAndUpdate doesn't work because the middleware doesn't hash on updates
      // it only hashes on saves.
      const user = await User.findOne({ email: existingSession.email })
      user.password = password
      user.save()

      await Session.findOneAndRemove({ _id: session })

      // Should be redirected to login page
      res.status(204).send()
    } else {
      res.status(400).json({
        msg: `Couldn't find a session with the id: ${session}`,
      })
    }
  }
)

module.exports = { forgotPasswordRouter, forgotPasswordSessionRouter }
