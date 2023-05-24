import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: {
      type: Boolean,
      default: false
    },
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      required: 'Chatroom is required.',
      ref: 'ChatRoom'
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: 'user is required.',
        ref: 'User'
      }
    ],
    sender: {
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
