const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const Password = require('../services/password')

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        // Change mongodb default _id to just id to avoid confusion
        ret.id = ret._id

        delete ret._id // Remove the unwanted id
        delete ret.password // Remove password so its not sent to frontend
        delete ret.__v // Unnecessary information
      },
    },
  }
)

// Allows for search
userSchema.index({ email: 'text' })

// not arrow function becuase we want this
userSchema.pre('save', async function(done) {
  // Check if the password fieled has been updated
  if (this.isModified('password')) {
    // Hash the supplied password
    const hashed = await Password.toHash(this.get('password'))

    // Replace plain text password with hashed
    this.set('password', hashed)
  }

  done()
})

// Set user attributes
userSchema.statics.build = attributes => {
  return new User(attributes)
}

const User = mongoose.model('users', userSchema)

module.exports = User
