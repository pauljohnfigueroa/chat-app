import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { createChatRoom, getAllChatrooms } from '../controllers/chatroomController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verifyToken, catchErrors(getAllChatrooms))
router.post('/', verifyToken, catchErrors(createChatRoom))

export default router
