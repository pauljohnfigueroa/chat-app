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

/* Middleware */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* Routes */
app.use('/users', userRoutes)

// Error handlers
// import errorHandlers from './handlers/errorHandlers'
// app.use(errorHandlers.notFound)
// app.use(errorHandlers.mongooseErrors)

// if (process.env.ENV === 'dev') {
//   app.use(errorHandlers.developmentErrors)
// } else {
//   app.use(errorHandlers.productionErrors)
// }

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
