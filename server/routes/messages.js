import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { getAllMessages, getAllUserMessages } from '../controllers/messageController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/:chatRoomId/:userId', verifyToken, catchErrors(getAllUserMessages))
router.get('/:chatRoomId', verifyToken, catchErrors(getAllMessages))

export default router
