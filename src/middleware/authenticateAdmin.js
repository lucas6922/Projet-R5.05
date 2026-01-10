import { request, response } from 'express'
import { db } from '../db/database.js'
import { tAppRole, tUser } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {Function} next 
 */
export const authenticateAdmin = async (req, res, next) => {
    try{
        const result = await db
        .select({userId: tUser.userId})
        .from(tUser)
        .innerJoin(tAppRole, eq(tUser.aproId, tAppRole.aproId))
        .where(and(eq(tUser.userId, req.user), eq(tAppRole.aproLabel, 'ADMIN')))
        .limit(1)

        if(result.length === 0) {
            return res.status(403).json({
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