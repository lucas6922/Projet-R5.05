import { Router } from 'express'
import { getCard, createCard } from '../controllers/cardController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createCardSchema, cardIdSchema } from '../models/card.js';
import { authenticateToken } from '../middleware/authenticateToken.js'

const router = Router()

router.use(authenticateToken)

router.get('/:flcaId', validateParams(cardIdSchema), getCard);

router.post('/', validateBody(createCardSchema), createCard);

export default router;