import express from 'express'
import { catchErrors } from '../handlers/errorHandlers.js'
import { login, register, getUsers } from '../controllers/userController.js'

const router = express.Router()

router.get('/', catchErrors(getUsers))
router.post('/login', catchErrors(login))
router.post('/register', catchErrors(register))

export default router
