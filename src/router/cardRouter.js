import { Router } from 'express'
import { getCard, createCard, getCardsCollection, getCardsToTrain } from '../controllers/cardController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createCardSchema, cardIdSchema } from '../models/card.js';
import { collectionIdSchema } from '../models/collection.js';
import { authenticateToken } from '../middleware/authenticateToken.js'

const router = Router()

router.use(authenticateToken)

router.get('/:flcaId', validateParams(cardIdSchema), getCard);

router.post('/', validateBody(createCardSchema), createCard);

router.get('/collection/:collId', validateParams(collectionIdSchema), getCardsCollection);

router.get('/collection/to-train/:collId', validateParams(collectionIdSchema), getCardsToTrain);



export default router;