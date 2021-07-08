const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const sessionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id

        delete ret._id
        delete ret.__v
      },
    },
  }
)

sessionSchema.statics.build = attributes => {
  return new Session(attributes)
}

const Session = mongoose.model('sessions', sessionSchema)

module.exports = Session
