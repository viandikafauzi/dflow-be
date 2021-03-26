import mongoose from 'mongoose'

const tokenSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
})

const token = mongoose.model('token', tokenSchema)

export default token
