const { Router } = require('express')
const loginRouter = Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Password = require('../services/password')

loginRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })

  // If user is null it means there is no user with the supplied email registered
  if (!user) {
    res.status(400).json({
      msg: 'No user exists with that email',
    })

    return
  }

  // Check if stored and supplied passwords match
  if (Password.compare(user.password, password)) {
    // Create token to be saved in client side session
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

    res.status(200).json({
      msg: 'Login successful',
    })
  }
})

module.exports = loginRouter
