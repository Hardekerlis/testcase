const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')

// General middlewares
app.use(
  bodyParser.json({
    limit: '5mb', // Limit request size
  })
)
app.use(
  cookieSession({
    name: 'session',
    signed: false, // Should be true - Need keys for that
    secure: false,
  })
)

mongoose.connect('mongodb://localhost:27017/testcase', {
  // https://mongoosejs.com/docs/api.html
  // Prevent use of deprecated mongodb functions
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

process.env.JWT_KEY = 'kjasdjasiodoiasdiousadiousadiousadoisaroiuoiasudiouas'

const registerRouter = require('./src/routes/register')
const loginRouter = require('./src/routes/login')
const logoutRouter = require('./src/routes/logout')
const removeAccountRouter = require('./src/routes/removeAccount')
const userSearchRouter = require('./src/routes/userSearch')
const forgotPasswordRouter = require('./src/routes/forgotPassword')
// -- Routes --
app.use(registerRouter)
app.use(loginRouter)
app.use(logoutRouter)
app.use(removeAccountRouter)
app.use(userSearchRouter)
app.use(forgotPasswordRouter)

// Catch all 404s
app.use('*', (req, res) => {
  res.status(404).send()
})

// -- Start app --
// Port should be put into config file..
app.listen(3000, () => {
  console.log('Listening on port *:3000')
})
