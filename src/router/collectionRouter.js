import { Router } from 'express'
import { getCollection, createCollection, getMyCollections, editCollection, deleteCollection, searchPublicCollections } from '../controllers/collectionController.js';
import { createCard, getCardsCollection, getCardsToTrain } from '../controllers/cardController.js';
import { createCardSchema } from '../models/card.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validation.js';
import { createCollectionSchema, collectionIdSchema, searhCollectionSchema } from '../models/collection.js';
import { authenticateToken } from '../middleware/authenticateToken.js'

const router = Router()

//Retrieve a public collection so no token needed
router.get('/search', validateQuery(searhCollectionSchema), searchPublicCollections);

router.use(authenticateToken)

router.get('/:collId', validateParams(collectionIdSchema), getCollection);

router.get('/', getMyCollections);

router.post('/', validateBody(createCollectionSchema), createCollection);

router.put('/:collId', validateBody(createCollectionSchema), validateParams(collectionIdSchema), editCollection);

router.delete('/:collId', validateParams(collectionIdSchema), deleteCollection)

router.post('/:collId/cards', validateParams(collectionIdSchema), validateBody(createCardSchema), createCard);

router.get('/:collId/cards', validateParams(collectionIdSchema), getCardsCollection);

router.get('/:collId/cards/due', validateParams(collectionIdSchema), getCardsToTrain);

export default router;