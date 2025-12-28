import { Router } from 'express'
import { getCard, createCard, deleteCard, reviewCard } from '../controllers/cardController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createCardSchema, cardIdSchema, reviewCardLevelSchema } from '../models/card.js';
import { authenticateToken } from '../middleware/authenticateToken.js'

const router = Router()

router.use(authenticateToken)

router.get('/:flcaId', validateParams(cardIdSchema), getCard);

router.post('/', validateBody(createCardSchema), createCard);


router.delete('/:flcaId', validateParams(cardIdSchema), deleteCard)

router.post('/review/:flcaId', validateParams(cardIdSchema), validateBody(reviewCardLevelSchema), reviewCard)
export default router;