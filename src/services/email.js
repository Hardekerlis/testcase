const nodemailer = require('nodemailer')

module.exports = async function sendEmail(to, subject, html) {
  let testAccount = await nodemailer.createTestAccount()

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  let info = await transporter.sendMail({
    from: 'No-Reply',
    to,
    subject,
    html,
  })
}
