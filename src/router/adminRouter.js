import { Router } from 'express'
import { getUsers, getUser, deleteUser } from '../controllers/adminController.js';
import { validateParams } from '../middleware/validation.js';
import { userIdSchema } from '../models/admin.js'

const router = Router()

router.get('/', getUsers);

router.get('/:userId', validateParams(userIdSchema), getUser);

router.delete('/:userId', validateParams(userIdSchema), deleteUser);

export default router;