import Message from '../models/Message.js'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

export const getAllMessages = async (req, res) => {
  const { chatRoomId } = req.params
  console.log(chatRoomId)
  const messages = await Message.find({ chatroom: new ObjectId(chatRoomId) })
  console.log(messages)
  res.status(201).json(messages)
}
