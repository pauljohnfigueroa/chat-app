import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import {
  login,
  register,
  getUsers,
  getOnlineUsers,
  setUserOffline,
  setOpennedChat,
  setCloseChat
} from '../controllers/userController.js'

const router = express.Router()

router.get('/', catchErrors(getUsers))
router.post('/login', catchErrors(login))
router.post('/register', catchErrors(register))
router.post('/online', catchErrors(getOnlineUsers))
router.post('/offline', catchErrors(setUserOffline))
router.post('/openchat', catchErrors(setOpennedChat))
router.post('/closechat', catchErrors(setCloseChat))

export default router
