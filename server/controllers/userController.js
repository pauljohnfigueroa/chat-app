import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'

export const register = async (req, res) => {
  try {
    // get the user information from the form using req.body
    const { name, email, password, avatar } = req.body

    // check if the email already exists
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      res.status(500).json({ message: `User already exists.` })
      return
    }

    // password salt
    const salt = await bcrypt.genSalt()
    // password hash
    const passwordHash = await bcrypt.hash(password, salt)

    // new User()
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      avatar
    })
    // save new user
    await newUser.save()

    // response
    res.status(201).json({ message: `User ${name} was registered successfully.` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    // get the login parameters
    const { email, password } = req.body

    // check if the email exists in the database
    const user = await User.findOne({ email })

    // return error if the email does not exists
    if (!user) return res.status(400).json({ message: 'Invalid Email or Password.' })

    // If the email exists, check the password
    const isPwdMatch = await bcrypt.compare(password, user.password)
    // If password does not match
    if (!isPwdMatch) return res.status(400).json({ message: 'Invalid Email or Password.' })

    // if everything is OK
    // do not send the password to the front end
    user.password = undefined

    // generate token
    await User.findOneAndUpdate({ email }, { isOnline: true })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    // send credentials to the front end
    res.status(200).json({ user, token, message: `Sucessfully logged in` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = () => {
  console.log('logout')
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(201).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find({ isOnline: true }).select({ _id: 1 })
    res.status(201).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const setUserOffline = async (req, res) => {
  const { userId } = req.body
  try {
    const user = await User.findOneAndUpdate({ _id: userId }, { isOnline: false })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const setOpennedChat = async (req, res) => {
  const { roomId, userId } = req.body
  try {
    const user = await User.findOneAndUpdate({ _id: userId }, { $set: { opennedChat: roomId } })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const setCloseChat = async (req, res) => {
  const { roomId, userId } = req.body
  try {
    const user = await User.findOneAndUpdate({ _id: userId }, { $set: { opennedChat: [] } })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
