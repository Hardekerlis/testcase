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
