import { db } from '../db/database.js'
import { tCollection } from '../db/schema.js'
import { eq, or, and, like } from 'drizzle-orm'

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getMyCollections = async (req, res) =>{
    /* 
    #swagger.tags = ['Collection']
    #swagger.summary = 'Get my collections'
    #swagger.description = 'Returns all collections belonging to the logged-in user, sorted by title'
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.responses[200] = {
      description: 'Collections list retrieved successfully',
      schema: { type: 'array', items: { $ref: '#/definitions/Collection' } }
    }
    #swagger.responses[403] = {
      description: 'Authentication token required',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */
    try{
        const result = await db
        .select()
        .from(tCollection)
        .where(eq(tCollection.userId, req.user.userId))
        .orderBy('collTitle', 'asc')

        res.status(200).json(result)
    } catch ( error ){
        res.status(500).send({
            error: 'Failed to fetch collections',
            detail: error.message
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getCollection = async (req, res) =>{
    /* 
    #swagger.tags = ['Collection']
    #swagger.summary = 'Get a collection'
    #swagger.description = 'Retrieves collection information. Accessible if it is public or if the user is the owner.'
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['collId'] = {
      in: 'path',
      description: 'Collection ID',
      required: true,
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Collection retrieved successfully',
      schema: { $ref: '#/definitions/Collection' }
    }
    #swagger.responses[400] = {
      description: 'Invalid data',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[403] = {
      description: 'Authentication token required',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: 'Collection not found',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */
    try{
        const result = await db
        .select()
        .from(tCollection)
        .where(and(or(eq(tCollection.collVisibility, 'public'),eq(tCollection.userId, req.user)),eq(tCollection.collId, req.params.collId)))

        if(result.length == 0){
            res.status(404).json({
                error: "Collection not found"
            });
        }
        res.status(200).json(result)
    } catch ( error ){
        res.status(500).send({
            error: 'Failed to fetch collection',
            detail: error.message
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const createCollection = async (req, res) => {
    /* 
    #swagger.tags = ['Collection']
    #swagger.summary = 'Create a collection'
    #swagger.description = 'Creates a new flashcard collection for the logged-in user'
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Collection data to create',
      required: true,
      schema: { $ref: '#/definitions/CollectionInput' }
    }
    #swagger.responses[201] = {
      description: 'Collection created successfully',
      schema: {
        message: 'Collection created',
        collection: { $ref: '#/definitions/Collection' }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid data',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[403] = {
      description: 'Authentication token required',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */
    try{
        console.log("req : ", req.user)
        const data = {
            collTitle: req.body.collTitle,
            collDesc: req.body.collDesc,
            collVisibility: req.body.collVisibility,
            userId: req.user, 
        };
        console.log(req.body)
        const result = await db
        .insert(tCollection)
        .values(data)
        .returning()

        res.status(201).json({
            message: "Collection created",
            collection: result
        });
    } catch (error){
        res.status(500).send({
            error: 'Failed to create collection',
            detail: error.message
        })
    }
    
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const editCollection = async (req, res) => {
    /* 
    #swagger.tags = ['Collection']
    #swagger.summary = 'Update a collection'
    #swagger.description = 'Updates the title, description or visibility of a collection. Only by the owner.'
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['collId'] = {
      in: 'path',
      description: 'ID of the collection to update',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'New collection data',
      required: true,
      schema: { $ref: '#/definitions/CollectionInput' }
    }
    #swagger.responses[200] = {
      description: 'Collection updated successfully',
      schema: {
        message: 'Collection edited',
        collection: { $ref: '#/definitions/Collection' }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid data',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: 'Collection not found',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */
    try{
        console.log(req.body)
        const result = await db
        .update(tCollection)
        .set(req.body)
        .where(eq(tCollection.collId, req.params.collId))
        .returning()

        res.status(201).json({
            message: `Collection ${id} edited`,
            collection: result
        });
    } catch (error){
        res.status(500).send({
            error: `Failed to edit collection ${id}`,
            detail: error.message
        })
    }
    
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const deleteCollection = async (req, res) => {
    /* 
    #swagger.tags = ['Collection']
    #swagger.summary = 'Delete a collection'
    #swagger.description = 'Deletes a collection and all its associated flashcards. Only by the owner.'
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.parameters['collId'] = {
      in: 'path',
      description: 'ID of the collection to delete',
      required: true,
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Collection deleted successfully',
      schema: {
        message: 'Collection deleted'
      }
    }
    #swagger.responses[403] = {
      description: 'Authentication token required',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[404] = {
      description: 'Collection not found',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */
    const { collId } = req.params;
    console.log(collId)

    try{
        console.log(collId)
        const result = await db
        .delete(tCollection)
        .where(eq(tCollection.collId, collId))
        .returning()
        
        if(!result){
            res.status(404).send({
                error: 'Collection not found',
            })
        }

        res.status(201).send({
            message: `Collection ${collId} deleted`
        });
    } catch ( error ){
        res.status(500).send({
            error: `Failed to delete collection ${collId}`,
            detail: error.message
        })
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const searchPublicCollections = async (req, res) => {
  /* 
    #swagger.auto = false
    #swagger.tags = ['Collection']
    #swagger.summary = 'Search public collections'
    #swagger.description = 'Search for public collections by title'
    #swagger.parameters['search'] = {
      in: 'query',
      description: 'Search term',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Search completed successfully',
      schema: { $ref: '#/definitions/SearchCollectionResponse' }
    }
    #swagger.responses[400] = {
      description: 'Invalid query parameters'
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  console.log("req.query : ", req.query)
  const { search } = req.query
  console.log("search : ", search)
  try{
    const collections = await db
      .select({
        collTitle: tCollection.collTitle,
        collDesc: tCollection.collDesc
      })
      .from(tCollection)
      .where(
        and(
          eq(tCollection.collVisibility, 'PUBLIC'),
          like(tCollection.collTitle, `%${search}%`)
        )
      );
    
    console.log("collections : ", collections)

    return res.status(200).json({
      message: 'Public collection retrieve successfully',
      data: collections
    })
  } catch ( error ){
    res.status(500).send({
        error: `Failed to delete collection ${collId}`,
        detail: error.message
    })
  }
}