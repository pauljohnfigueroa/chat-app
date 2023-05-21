import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()
const app = express()

/* Models */
// import User from './models/User.js'
// import ChatRoom from './models/ChatRoom.js'
// import Message from './models/Message.js'

/* Routes */
import userRoutes from './routes/users.js'
import chatroomRoutes from './routes/chatroom.js'

/* Middleware */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* Routes */
app.use('/users', userRoutes)
app.use('/chatroom', chatroomRoutes)

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

/* Server */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('SUCCESS - We are connected to the database.')
    app.listen(PORT, () => {
      console.log(`SUCCESS - The server is listening on PORT ${PORT}`)
    })
  })
  .catch(error => {
    console.log(`${error}. Can not connect.`)
  })
