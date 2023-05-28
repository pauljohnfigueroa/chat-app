import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'

/* Models */
import User from './models/User.js'
import Message from './models/Message.js'
import ChatRoom from './models/ChatRoom.js'

dotenv.config()
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import corsOptions from './config/corsOptions.js'

/* Routes */
import userRoutes from './routes/users.js'
import chatroomRoutes from './routes/chatroom.js'
import chatRoutes from './routes/chat.js'
import messageRoutes from './routes/messages.js'

/* Middleware */
app.use(express.json())

//app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

// Public files
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))

// Cross Origin Resource Sharing
// you must have a whitelist of allowed domains, see config/corsOptions
app.use(cors(corsOptions))

/* File uploads */
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname
    //console.log(file)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage })

app.post('/upload', upload.single('avatar'), (req, res) => {
  const { image } = req.file
  // If does not have image mime type prevent from uploading
  // if (/^image/.test(image.mimetype)) return res.sendStatus(400)

  res.status(201).json({ file: req.file })
})

/* Routes */
app.use('/users', userRoutes)
app.use('/chat', chatRoutes)
app.use('/chatrooms', chatroomRoutes)
app.use('/messages', messageRoutes)

// Error handlers
import {
  notFound,
  mongooseErrors,
  developmentErrors,
  productionErrors
} from './handlers/errorHandlers.js'

app.use(notFound)
app.use(mongooseErrors)

if (process.env.ENV === 'dev') {
  app.use(developmentErrors)
} else {
  app.use(productionErrors)
}

const PORT = process.env.PORT || 8001

/* Database Server */

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('SUCCESS - We are connected to the database.')
  })
  .catch(error => {
    console.log(`${error}. Can not connect.`)
  })

/* Express Server */
const server = app.listen(PORT, () => {
  console.log(`SUCCESS - The server is listening on PORT ${PORT}`)
})

// Socket.io
const io = new Server(server, {
  pingTimeout: 60,
  cors: {
    origin: true,
    methods: ['GET', 'POST']
  }
})

/* io */
io.use(async (socket, next) => {
  try {
    // get id from the token
    const token = socket.handshake.query.token
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = payload.id
    next()
  } catch (error) {}
})

io.on('connection', socket => {
  // socket.userId is from the token
  console.log(`io.on('connection') - Connected: ${socket.userId}`)

  socket.on('disconnect', async () => {
    console.log(`socket.on('disconnect') - Disconnected: ${socket.userId}`)
    // User log's out
    socket.broadcast.emit('offline-broadcast', socket.userId)
    console.log(`socket.broadcast.emit - disconnect: ${socket.userId}`)
    const userId = socket.userId
    try {
      const user = await User.findOneAndUpdate({ _id: userId }, { isOnline: false })
      console.log(`socket.on('disconnect') - A user left the chat.`, userId)
    } catch (error) {
      console.log(error.message)
    }
  })

  // User log's in
  socket.on('online-status', () => {
    socket.broadcast.emit('online-broadcast', socket.userId)
    console.log(`socket.on('online-status') - ONLINE: ${socket.userId}`)
  })

  socket.on('offline-status', async () => {
    socket.broadcast.emit('offline-broadcast', socket.userId)
    console.log(`socket.on('offline-status') - OFFLINE - update DB: ${socket.userId}`)
    // update the isOnline flag in database
    const userId = socket.userId
    try {
      const user = await User.findOneAndUpdate({ _id: userId }, { isOnline: false })
      console.log('A user left the chat.', userId)
    } catch (error) {
      console.log(error.message)
    }
  })

  /* Leave room */
  socket.on('leave-room', chatRoomId => {
    socket.leave(chatRoomId)
    console.log(`A user left private room (event: 'leave-room')  ${chatRoomId}`)
  })

  /* Group chat */
  socket.on('group-chat', chatRoomId => {
    socket.join(chatRoomId)
    console.log(`A user joined the group chat (event: 'group-chat') ${chatRoomId}`)
  })

  // socket.on('leaveRoom', chatRoomId => {
  //   socket.leave(chatRoomId)
  //   console.log(`A user left ${chatRoomId}`)
  // })

  /* Group message */
  socket.on('group-message', async ({ message, to }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId })
      const newMessage = new Message({
        chatroom: to,
        user: socket.userId,
        message
      })

      io.to(to).emit('group-chat', {
        message,
        name: user.name,
        userId: socket.userId
      })

      await newMessage.save()
    }
  })

  /* Private Chat */
  socket.on('private-chat', chatRoomId => {
    socket.join(chatRoomId)
    console.log(`A user joined a private-chat (event: 'private-chat') ${chatRoomId}`)
  })

  /* Private message */
  socket.on('private-message', async ({ message, to, from }) => {
    // do not process a black message
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId })
      const newMessage = new Message({
        chatroom: to,
        user: socket.userId,
        message
      })

      // save the new message to messages collection
      await newMessage.save()

      // get the otherUser's _id
      const chatroom = await ChatRoom.find({ _id: to })
      console.log('chatroom', chatroom[0].users)

      const otherUserId = chatroom[0].users.filter(id => id !== from)

      // // Check if the chatroom is open from the other user.
      const otherUser = await User.find({ _id: otherUserId })
      console.log('otherUser', otherUser)

      // if chatroom is not openned, send notification
      // if (!chatroom.opennedChat) {
      //   io.to(to).emit('private-message-notification', {
      //     message,
      //     // name: user.name,
      //     room: socket.userId
      //   })
      // }

      // io. broadcast including sender
      // socket. broadcast not including sender
      io.to(to).emit('private-message', {
        message,
        name: user.name,
        userId: socket.userId
      })
    }
  })
})
