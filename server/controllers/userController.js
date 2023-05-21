import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'

export const login = async (req, res) => {
  try {
    // get the login parameters
    const { email, password } = req.body

    // check if the email exists in the database
    const user = await User.findOne({ email })

    // return error if the email does not exists
    if (!user) return res.status(400).json({ error: 'Email does not exists.' })

    // If the email exists, check the password
    const isPwdMatch = bcrypt.compare(password, user.password)
    // If password does not match
    if (!isPwdMatch) return res.status(400).json({ error: 'Invalid credentials.' })

    // if everything is OK
    // do not send the password to the front end
    user.password = undefined
    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    // send credentials to the front end
    res.status(200).json({ user, token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const register = async (req, res) => {
  try {
    // get the user information from the form using req.body
    const { name, email, password } = req.body

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
      password: passwordHash
    })
    // save new user
    const savedUser = await newUser.save()

    // response
    res.status(201).json({ message: `User ${name} was registered successfully.` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
