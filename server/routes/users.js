import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { login, register } from '../controllers/userController.js'

const router = express.Router()

router.post('/login', catchErrors(login))
router.post('/register', catchErrors(register))

export default router
