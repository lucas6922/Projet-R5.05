import { Router } from 'express'

import { getCard, getCardsToTrain, deleteCard, reviewCard } from '../controllers/cardController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { cardIdSchema, reviewCardLevelSchema } from '../models/card.js';

import { collectionIdSchema } from '../models/collection.js';

import { authenticateToken } from '../middleware/authenticateToken.js'

const router = Router()

router.use(authenticateToken)

router.get('/:flcaId', validateParams(cardIdSchema), getCard);

router.delete('/:flcaId', validateParams(cardIdSchema), deleteCard)

router.post('/:flcaId/reviews', validateParams(cardIdSchema), validateBody(reviewCardLevelSchema), reviewCard)





export default router;