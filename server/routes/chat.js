import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { getChat, getChatName } from '../controllers/userchatController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/:chatId', verifyToken, catchErrors(getChatName))
router.get('/:chatId/:userId', verifyToken, catchErrors(getChat))

export default router
