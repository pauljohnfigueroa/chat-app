import mongoose from 'mongoose'

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Name is required.'
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: 'At least two users are required.',
        ref: 'User'
      }
    ],
    isGroupChat: { type: Boolean }
  },
  { timestamps: true }
)

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)
export default ChatRoom
