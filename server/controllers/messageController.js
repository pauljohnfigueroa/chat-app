import Message from '../models/Message.js'

import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

export const getAllMessages = async (req, res) => {
  const { chatRoomId } = req.params

  // We use mongodb aggregation $match to get all the messages for the chatroom
  // and $lookup then get the user's Name
  const messages = await Message.aggregate([
    {
      $match: { chatroom: new ObjectId(chatRoomId) }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'name'
      }
    },
    { $unwind: '$name' },
    {
      $project: {
        _id: 1,
        userId: '$user',
        chatroom: '$chatroom',
        name: '$name.name',
        message: '$message'
      }
    }
  ])

  res.status(201).json(messages)
}

export const getAllUserMessages = async (req, res) => {
  const { chatRoomId, userId } = req.params

  // We use mongodb aggregation $match to get all the
  // messages for the pair of users only
  // and $lookup then get the user's Name
  const messages = await Message.aggregate([
    {
      $match: {
        chatroom: new ObjectId(chatRoomId)
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'name'
      }
    },
    { $unwind: '$name' },
    {
      $project: {
        _id: 1,
        userId: '$user',
        chatroom: '$chatroom',
        name: '$name.name',
        message: '$message'
      }
    }
  ])
  res.status(201).json(messages)
}
