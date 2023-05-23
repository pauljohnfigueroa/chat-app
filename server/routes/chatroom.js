import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { createChatRoom, getAllChatrooms, getChatRoom } from '../controllers/chatroomController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, catchErrors(getAllChatrooms))
router.get('/:chatRoomId', verifyToken, catchErrors(getChatRoom))
router.post('/', verifyToken, catchErrors(createChatRoom))

export default router
