import { Router } from 'express'
import { registerUser, loginUser, verifyEmail } from '../controllers/authController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { registerSchema, loginSchema, verifyEmailTokenSchema } from '../models/auth.js'

const router = Router()

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.get('/verify-email/:token', validateParams(verifyEmailTokenSchema), verifyEmail);
export default router;