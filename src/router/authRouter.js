import { Router } from 'express'
import { registerUser, loginUser } from '../controllers/authController.js';
import { validateBody } from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../models/auth.js'

const router = Router()

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser)

export default router;