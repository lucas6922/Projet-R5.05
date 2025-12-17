import { db } from '../db/database.js'
import { tUser as tUser } from '../db/schema.js'
import { eq, or, and } from 'drizzle-orm'

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getUsers = async (req, res) =>{
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