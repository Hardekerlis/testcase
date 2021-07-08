const { Router } = require('express')
const userSearchRouter = Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')

userSearchRouter.get('/search=:query', async (req, res) => {
  const { query } = req.params

  // Email field is text indexed
  const users = await User.find({ $text: { $search: query } })

  if (users[0]) {
    res.status(200).json(users)
  } else {
    res.status(200).json({
      msg: 'No results',
    })
  }
})

module.exports = userSearchRouter
