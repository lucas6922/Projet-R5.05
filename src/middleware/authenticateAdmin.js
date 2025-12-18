import { request, response } from 'express'
import { db } from '../db/database.js'
import { tUser } from '../db/schema.js'
import { eq, or, and } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {Function} next 
 */
export const authenticateToken = async (req, res, next) => {
    try{
        const result = await db
        .select(tUser.userId)
        .from(tUser)
        .where(and(eq(tUser.userId, req.user.userId), eq(tUser.userStatus, 'ADMIN')))
        .orderBy('userId', 'asc')

        if(result.length > 0) {
            return res.status(400).json({
                error: 'User is not an admin'
            });
        }

        next()
        
    } catch ( error ){
        res.status(500).send({
            error: 'Failed to authenticate admin.',
            detail: error.message
        })
    }
}