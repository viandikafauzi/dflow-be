import mongoose from 'mongoose'

const resetSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reset: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true }
)

resetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })

const reset = mongoose.model('reset', resetSchema)

export default reset
