import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { getChat, getChatName, createChat, opennedChat } from '../controllers/userchatController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/', verifyToken, catchErrors(createChat))
router.post('/openned', verifyToken, catchErrors(opennedChat))
router.get('/:chatId/:userId/:chatRoomId', verifyToken, catchErrors(getChat))
router.get('/:chatRoomId/:userId', verifyToken, catchErrors(getChatName))

export default router
