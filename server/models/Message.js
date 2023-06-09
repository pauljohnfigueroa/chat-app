import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      required: 'Chatroom is required.',
      ref: 'ChatRoom'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: 'user is required.',
      ref: 'User'
    },
    message: {
      type: String,
      required: 'Message is required.'
    }
  },
  { timestamps: true }
)

const Message = mongoose.model('Message', messageSchema)
export default Message
