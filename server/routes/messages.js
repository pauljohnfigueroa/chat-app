import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { getAllMessages } from '../controllers/messageController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/:chatRoomId', verifyToken, catchErrors(getAllMessages))

export default router
