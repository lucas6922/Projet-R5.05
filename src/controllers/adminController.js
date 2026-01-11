import { db } from '../db/database.js'
import { tCollection, tFlashCard, tRevision, tUser } from '../db/schema.js'
import { eq, inArray } from 'drizzle-orm'
import { ANONYMOUS_USER_ID } from '../constants.js'
/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getUsers = async (req, res) =>{
    /*
        #swagger.tags = ['Administration']
        #swagger.summary = 'Get all users'
        #swagger.description = 'Returns a list of all users ordered by userId ascending.'
        #swagger.security = [{ bearerAuth: [] }]

        #swagger.responses[200] = {
            description: 'Users fetched successfully',
            schema: [{ $ref: '#/definitions/User' }]
        }

        #swagger.responses[500] = {
            description: 'Server error',
            schema: { $ref: '#/definitions/Error' }
        }
    */
    try{
        const result = await db
        .select()
        .from(tUser)
        .orderBy('userId', 'asc')

        res.status(200).json(result)
    } catch ( error ){
        res.status(500).send({
            error: 'Failed to fetch users.',
            detail: error.message
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getUser = async (req, res) =>{
    /*
        #swagger.tags = ['Administration']
        #swagger.summary = 'Get a user by id'
        #swagger.description = 'Returns a single user by userId.'
        #swagger.security = [{ bearerAuth: [] }]
        #swagger.parameters['userId'] = {
            in: 'path',
            description: 'User id',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'User fetched successfully',
            schema: {
                message: 'User retrieve successfully',
                user: { $ref: '#/definitions/User' }
            }
        }
        #swagger.responses[404] = {
            description: 'User not found',
            schema: { $ref: '#/definitions/Error' }
        }
        #swagger.responses[500] = {
            description: 'Server error',
            schema: { $ref: '#/definitions/Error' }
        }
    */
   const { userId } = req.params
   
    try{
        const [result] = await db
        .select()
        .from(tUser)
        .where(eq(tUser.userId, userId))

        if(!result){
            return res.status(404).json({
                error: 'User not found'
            })
        }
        res.status(200).json({
            message: 'User retrieve successfully',
            user: result
        })
    } catch ( error ){
        res.status(500).send({
            error: `Failed to fetch user ${userId}`,
            detail: error.message
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const deleteUser = async (req, res) => {
    /*
        #swagger.tags = ['Administration']
        #swagger.summary = 'Delete current user'
        #swagger.description = 'Deletes the authenticated user from the database.'
        #swagger.security = [{ bearerAuth: [] }]
        #swagger.responses[201] = {
        description: 'User deleted successfully',
        schema: {
            type: 'object',
            properties: {
            message: {
                type: 'string',
                example: 'User 1 deleted'
            }
            }
        }
        }
        #swagger.responses[404] = {
        description: 'User not found'
        }
        #swagger.responses[401] = {
        description: 'Unauthorized'
        }
        #swagger.responses[500] = {
        description: 'Failed to delete user'
        }
    */
   //on va tout supprimer pour des raison de protections de données

    const { userId } = req.params

    try{

        if (userId === ANONYMOUS_USER_ID) {
            return res.status(403).json({
                error: 'Cannot delete anonymous user'
            })
        }

        const [user] = await db
        .select()
        .from(tUser)
        .where(eq(tUser.userId, userId));
        
        if(!user){
            return res.status(404).send({
                error: 'User not found',
            })
        }

        const userCollections = await db
            .select()
            .from(tCollection)
            .where(eq(tCollection.userId, userId));

        const publicCollectinos = userCollections.filter(c => c.collVisibility === 'PUBLIC')
        const privateCollectinos = userCollections.filter(c => c.collVisibility === 'PRIVATE')
        
        //si collections public les anonymiser
        if(publicCollectinos.length > 0){
            await db.update(tCollection)
                .set({ userId: ANONYMOUS_USER_ID })
                .where(inArray(tCollection.collId, publicCollectinos.map(c => c.collId)));
        }

        //si collection privé les supp avec les revisions et les flasgcard associé
        if(privateCollectinos.length > 0){
            const privateCollectionIds = privateCollectinos.map(c => c.collId);
            const privateFlashcards = await db
                .select({ flcaId: tFlashCard.flcaId })
                .from(tFlashCard)
                .where(inArray(tFlashCard.collId, privateCollectionIds));

            
            
            if (privateFlashcards.length > 0) {
                await db.delete(tRevision)
                    .where(inArray(tRevision.flcaId, privateFlashcards.map(f => f.flcaId)));

                await db.delete(tFlashCard)
                    .where(inArray(tFlashCard.collId, privateCollectionIds));
                
                await db.delete(tCollection)
                    .where(inArray(tCollection.collId, privateCollectionIds));
            }
        }

        await db.delete(tRevision).where(eq(tRevision.userId, userId));

        const [result] = await db
            .delete(tUser)
            .where(eq(tUser.userId, userId))
            .returning();


        res.status(200).json({
            message: `User ${userId} and all related data deleted successfully`,
            collectionAnonymised: publicCollectinos.length,
            collectionDeleted: privateCollectinos.length,
            user: result
        });

    } catch ( error ){
        res.status(500).send({
            error: `Failed to delete user ${userId}`,
            detail: error.message
        })
    }
}