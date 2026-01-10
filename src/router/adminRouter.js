import { Router } from 'express'
import { getUsers, getUser, deleteUser } from '../controllers/adminController.js';
import { validateParams } from '../middleware/validation.js';
import { userIdSchema } from '../models/admin.js'
import { authenticateAdmin } from '../middleware/authenticateAdmin.js'
import { authenticateToken } from '../middleware/authenticateToken.js'
const router = Router()

router.use(authenticateToken)
router.use(authenticateAdmin)

router.get('/users', getUsers);

router.get('/users/:userId', validateParams(userIdSchema), getUser);

router.delete('/users/:userId', validateParams(userIdSchema), deleteUser);

export default router;