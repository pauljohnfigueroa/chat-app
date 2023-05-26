import ChatRoom from '../models/ChatRoom.js'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

export const createChatRoom = async (req, res) => {
  try {
    const { name } = req.params
    // check if the email already exists
    const chatroomExists = await ChatRoom.findOne({ name })
    if (chatroomExists) {
      res.status(500).json({ message: `Chatroom already exists.` })
      return
    }

    const chatroom = new ChatRoom({
      name,
      isGroupChat: true
    })

    const savedChatroom = await chatroom.save()

    res.status(201).json({ message: `${name} room was successfully created.` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllChatrooms = async (req, res) => {
  const chatrooms = await ChatRoom.find({ isGroupChat: true })
  res.status(201).json(chatrooms)
}

export const getChatRoom = async (req, res) => {
  const { chatRoomId } = req.params
  const chatroom = await ChatRoom.find({ _id: new ObjectId(chatRoomId) })
  console.log('chatroom', chatroom)
  res.status(201).json(chatroom)
}
