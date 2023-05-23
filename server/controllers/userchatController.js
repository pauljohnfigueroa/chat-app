import User from '../models/User.js'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

export const getChat = async (req, res) => {
  const { chatId, userId } = req.params
  const chat = await User.aggregate([
    {
      $match: {
        chatroom: { $in: [new ObjectId(chatId), new ObjectId(userId)] }
      }
    }
  ])
  res.status(201).json(chat)
}

export const getChatName = async (req, res) => {
  const { chatId } = req.params
  const chatName = await User.find({ _id: new ObjectId(chatId) })
  res.status(201).json(chatName)
}
