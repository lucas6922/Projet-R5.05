import { db } from '../db/database.js'
import { tUser } from '../db/schema.js'
import { eq, or, and } from 'drizzle-orm'

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
        #swagger.responses[200] = {
        description: 'Users fetched successfully',
        schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' }
        }
        }
        #swagger.responses[500] = {
        description: 'Failed to fetch users'
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
        #swagger.summary = 'Get current user'
        #swagger.description = 'Returns the authenticated user based on the token.'
        #swagger.security = [{ bearerAuth: [] }]
        #swagger.responses[200] = {
        description: 'User fetched successfully',
        schema: { $ref: '#/components/schemas/User' }
        }
        #swagger.responses[401] = {
        description: 'Unauthorized'
        }
        #swagger.responses[500] = {
        description: 'Failed to fetch user'
        }
    */
    try{
        const result = await db
        .select()
        .from(tUser)
        .where(eq(tUser.userId, req.user.userId))

        res.status(200).json(result)
    } catch ( error ){
        res.status(500).send({
            error: `Failed to fetch user ${id}`,
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
    try{
        const result = await db
        .delete(tUser)
        .where(eq(tUser.userId, req.user.userId))
        .returning()
        
        if(!result){
            res.status(404).send({
                error: 'User not found',
            })
        }

        res.status(201).send({
            message: `User ${id} deleted`
        });
    } catch ( error ){
        res.status(500).send({
            error: `Failed to delete user ${id}`,
            detail: error.message
        })
    }
}