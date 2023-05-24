import User from '../models/User.js'
import ChatRoom from '../models/ChatRoom.js'

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
  console.log('getChat()')
  res.status(201).json(chat)
}

export const getChatName = async (req, res) => {
  const { chatId } = req.params
  const chatName = await User.find({ _id: new ObjectId(chatId) })

  res.status(201).json(chatName)
}

export const createChat = async (req, res) => {
  try {
    const { name, users } = req.body
    console.log('createChat userId', name)
    console.log('createChat chatId', users)
    // check if the email already exists
    const chatroomExists = await ChatRoom.findOne({
      name: { $in: users },
      users: { $all: users }
    })
    if (chatroomExists) {
      console.log('Chat room already exists.')
      console.log(chatroomExists)
      return res.status(200).json(chatroomExists)
    }

    // create a room for private chat
    const chatroom = new ChatRoom({
      name: name,
      users: users,
      isGroupChat: false
    })
    const savedChatroom = await chatroom.save()

    console.log(savedChatroom)
    return res.status(201).json(savedChatroom)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
