const { Router } = require('express')
const registerRouter = Router()
const { body } = require('express-validator')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const validateRequest = require('../middlewares/validateRequest')
const Password = require('../services/password')

registerRouter.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Must supply a valid email'),
    body('password')
      .trim()
      .isLength({ min: 5, max: 20 }) // Password length
      .withMessage('Password must be between 5 and 20 characters'),
  ],
  validateRequest, // Middleware to check if there are any errors
  async (req, res) => {
    const { email, password } = req.body

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({
        msg: 'A user with that email already exists',
      })

      return
    }

    // No need for password hashing here because it is handled on save with mongoose
    // See user model
    const user = User.build({ email, password })

    await user.save()

    // Create token for cookie
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY
    )

    req.session = {
      jwt: token,
    }

    res.status(201).json(user)
  }
)

module.exports = registerRouter
