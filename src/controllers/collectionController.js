import { db } from '../db/database.js'
import { tCollection } from '../db/schema.js'
import { eq, or, and } from 'drizzle-orm'

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getMyCollections = async (req, res) =>{
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
    try{
        const result = await db
        .select()
        .from(tCollection)
        .where(and(or(eq(tCollection.collVisibility, 'public'),eq(tCollection.userId, req.body.user.userId)),eq(tCollection.collId, req.params.collId)))

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
    try{
        console.log(req.body)
        const result = await db
        .insert(tCollection)
        .values(req.body)
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
    const { collId } = req.params;

    try{
        console.log(collId)
        const result = await db
        .delete(tCollection)
        .where(eq(tCollection.id, id))
        .returning()
        
        if(!result){
            res.status(404).send({
                error: 'Collection not found',
            })
        }

        res.status(201).send({
            message: `Collection ${id} deleted`
        });
    } catch ( error ){
        res.status(500).send({
            error: `Failed to delete collection ${id}`,
            detail: error.message
        })
    }
}