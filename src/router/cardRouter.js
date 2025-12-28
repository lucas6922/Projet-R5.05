import { Router } from 'express'

import { getCard, createCard, getCardsCollection, getCardsToTrain, deleteCard, reviewCard } from '../controllers/cardController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createCardSchema, cardIdSchema, reviewCardLevelSchema } from '../models/card.js';

import { collectionIdSchema } from '../models/collection.js';

import { authenticateToken } from '../middleware/authenticateToken.js'

const router = Router()

router.use(authenticateToken)

router.get('/:flcaId', validateParams(cardIdSchema), getCard);

router.post('/', validateBody(createCardSchema), createCard);

router.delete('/:flcaId', validateParams(cardIdSchema), deleteCard)

router.post('/review/:flcaId', validateParams(cardIdSchema), validateBody(reviewCardLevelSchema), reviewCard)

router.get('/collection/:collId', validateParams(collectionIdSchema), getCardsCollection);

router.get('/collection/to-train/:collId', validateParams(collectionIdSchema), getCardsToTrain);



export default router;