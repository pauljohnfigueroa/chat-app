import ChatRoom from '../models/ChatRoom.js'

export const createChatRoom = async (req, res) => {
  try {
    const { name } = req.body

    // check if the email already exists
    const chatroomExists = await ChatRoom.findOne({ name })
    if (chatroomExists) {
      res.status(500).json({ message: `Chatroom already exists.` })
      return
    }

    const chatroom = new ChatRoom({
      name
    })

    const savedChatroom = await chatroom.save()
    res.status(201).json({ message: `${name} room was successfully created.` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
