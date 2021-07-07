const { Router } = require('express')
const logoutRouter = Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Password = require('../services/password')

logoutRouter.get('/logout', async (req, res) => {
  const { email, password } = req.body
  // Remove session
  req.session = null

  res.status(200).json({
    msg: 'Successfully logged out',
  })
})

module.exports = logoutRouter
