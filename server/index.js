import express from 'express'
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

/* Middleware */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cross Origin Resource Sharing
// you must have a whitelist of allowed domains, see config/corsOptions
app.use(cors(corsOptions))

/* Routes */
app.use('/users', userRoutes)
app.use('/chatrooms', chatroomRoutes)

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
  cors: {
    origin: true,
    methods: ['GET', 'POST']
  }
})

/* io */
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token
    const payload = await jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = payload.id
    next()
  } catch (error) {}
})

io.on('connection', socket => {
  console.log(`Connected: ${socket.userId}`)

  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.userId}`)
  })

  socket.on('joinRoom', ({ chatRoomId }) => {
    socket.join(chatRoomId)
    console.log(`A user joined ${chatRoomId}`)
  })

  socket.on('leaveRoom', ({ chatRoomId }) => {
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

      io.to(chatRoomId).emit('newMessage', {
        message,
        name: user.name,
        userId: socket.userId
      })

      await newMessage.save()
    }
  })
})
