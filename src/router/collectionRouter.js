import { Router } from 'express'
import { getCollection, createCollection, getMyCollections, editCollection, deleteCollection } from '../controllers/collectionController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createCollectionSchema, collectionIdSchema } from '../models/collection.js';
import { authenticateToken } from '../middleware/authenticateToken.js'

const router = Router()

//router.use(authenticateToken)

router.get('/:collId', validateParams(collectionIdSchema), getCollection);

router.get('/', getMyCollections);

router.post('/', validateBody(createCollectionSchema), createCollection);

router.put('/:collId', validateBody(createCollectionSchema), validateParams(collectionIdSchema), editCollection);

router.delete('/:collId', validateParams(collectionIdSchema), deleteCollection)


export default router;