import { Router } from 'express'
import { registerUser, loginUser, verifyEmail } from '../controllers/authController.js';
import { validateBody } from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../models/auth.js'

const router = Router()

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser)
router.get('/verify-email/:token', verifyEmail)
export default router;