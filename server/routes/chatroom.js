import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { createChatRoom } from '../controllers/chatroomController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/', verifyToken, catchErrors(createChatRoom))

export default router
