import { Router } from 'express'
import { getCollection, createCollection, getMyCollections, editCollection, deleteCollection, searchPublicCollections } from '../controllers/collectionController.js';
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

export default router;