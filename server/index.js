import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'

import User from './models/User.js'
import Message from './models/Message.js'

dotenv.config()
const app = express()

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
// Cross Origin Resource Sharing
// you must have a whitelist of allowed domains, see config/corsOptions
app.use(cors(corsOptions))

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

  socket.on('disconnect', () => {
    console.log(`socket.on('disconnect') - Disconnected: ${socket.userId}`)
    // User log's out
    socket.broadcast.emit('offline-broadcast', socket.userId)
    console.log(`socket.broadcast.emit - disconnect: ${socket.userId}`)
  })

  // User log's in
  socket.on('online-status', () => {
    socket.broadcast.emit('online-broadcast', socket.userId)
    console.log(`socket.on('online-status') - ONLINE: ${socket.userId}`)
  })

  socket.on('offline-status', () => {
    socket.broadcast.emit('offline-broadcast', socket.userId)
    console.log(`socket.on('offline-status') - OFFLINE: ${socket.userId}`)
  })

  // test
  socket.on('test', message => {
    console.log(`socket.on('test') - OFFLINE: ${message}`)
  })

  // Group chat
  socket.on('joinRoom', (chatRoomId, cb) => {
    socket.join(chatRoomId)
    cb(`Joined ${chatRoomId}`)

    console.log(`A user joined ${chatRoomId}`)
  })

  socket.on('leaveRoom', chatRoomId => {
    socket.leave(chatRoomId)
    console.log(`A user left ${chatRoomId}`)
  })

  socket.on('chatroomMessage', async ({ chatRoomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId })
      const newMessage = new Message({
        chatroom: chatRoomId,
        user: socket.userId,
        message
      })

      io.to(chatRoomId).emit('newGroupMessage', {
        message,
        name: user.name,
        userId: socket.userId
      })

      await newMessage.save()
    }
  })

  // private chat
  socket.on('private-chat', chatRoomId => {
    socket.join(chatRoomId)
    console.log(`A user private-chat(joined) ${chatRoomId}`)
  })

  socket.on('leave-room', chatRoomId => {
    socket.leave(chatRoomId)
    console.log(`A user leave-room(left)  ${chatRoomId}`)
  })

  socket.on('private-message', async ({ message, to }) => {
    // do not process a black message
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId })
      const newMessage = new Message({
        chatroom: to,
        user: socket.userId,
        message
      })
      // save the new message to database
      await newMessage.save()

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
