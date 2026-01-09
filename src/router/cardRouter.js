import { Router } from 'express'

import { getCard, deleteCard, reviewCard, updateCard} from '../controllers/cardController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { cardIdSchema, reviewCardLevelSchema, updateCardSchema } from '../models/card.js';

import { authenticateToken } from '../middleware/authenticateToken.js'

const router = Router()

router.use(authenticateToken)

router.get('/:flcaId', validateParams(cardIdSchema), getCard);

router.delete('/:flcaId', validateParams(cardIdSchema), deleteCard)

router.post('/:flcaId/reviews', validateParams(cardIdSchema), validateBody(reviewCardLevelSchema), reviewCard)

router.put('/:flcaId', validateParams(cardIdSchema), validateBody(updateCardSchema), updateCard)




export default router;