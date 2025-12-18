import { db } from '../db/database.js'
import { tFlashCard,tCollection, tRevision, tLevel } from '../db/schema.js'
import { eq, or, and, isNull, sql } from 'drizzle-orm'


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getCard = async (req, res) =>{
    try{
        const result = await db
        .select({
            flcaId: tFlashCard.flcaId,
            flcaRecto: tFlashCard.flcaRecto,
            flcaVerso: tFlashCard.flcaVerso,
            flcaUrlRecto: tFlashCard.flcaUrlRecto,
            flcaUrlVerso: tFlashCard.flcaUrlVerso,
            collId: tFlashCard.collId
        })
        .from(tFlashCard)
        .innerJoin(tCollection, eq(tCollection.collId, tFlashCard.collId))
        .where(and(or(eq(tCollection.collVisibility, 'PUBLIC'),eq(tCollection.userId, req.user)),eq(tFlashCard.flcaId, req.params.flcaId)));
        if(result.length === 0){
            return res.status(404).json({
                error: 'Card not found or access denied'
            })
        }
        return res.status(200).json(result)
    } catch ( error ){
        res.status(500).send({
            error: 'Failed to fetch card',
            detail: error.message
        })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const createCard = async (req, res) => {
    try{
        const data = {
            flcaTitle: req.body.flcaTitle,
            flcaRecto: req.body.flcaRecto,
            flcaVerso: req.body.flcaVerso,
            flcaUrlRecto: req.body.flcaUrlRecto,
            flcaUrlVerso: req.body.flcaUrlVerso,
            collId: req.body.collId,
        }

        const collAuthorization = await db
        .select()
        .from(tCollection)
        .where(and(eq(tCollection.collId, req.body.collId), eq(tCollection.userId, req.user)))

        if(collAuthorization.length === 0){
            return res.status(403).json({
                error: "You do not have permission to add cards to this collection"
            })
        }

        console.log(req.body)
        const result = await db
        .insert(tFlashCard)
        .values(data)
        .returning()

        res.status(201).json({
            message: "Card created",
            collection: result
        });
    } catch (error){
        res.status(500).send({
            error: 'Failed to create card',
            detail: error.message
        })
    }
    
}

export const getCardsCollection = async (req, res) =>{
    try{
        const data = req.params.collId
        const result = await db
        .select({
            flcaId: tFlashCard.flcaId,
            flcaRecto: tFlashCard.flcaRecto,
            flcaVerso: tFlashCard.flcaVerso,
            flcaUrlRecto: tFlashCard.flcaUrlRecto,
            flcaUrlVerso: tFlashCard.flcaUrlVerso,
            collId: tFlashCard.collId
        })
        .from(tFlashCard)
        .innerJoin(tCollection, eq(tCollection.collId, tFlashCard.collId))
        .where(and(or(eq(tCollection.collVisibility, 'PUBLIC'),eq(tCollection.userId, req.user)),eq(tFlashCard.collId, data)));

        if(result.length === 0){
            return res.status(404).json({
                error: 'Collection not found or access denied'
            })
        }

        return res.status(200).json(result)
    } catch ( error ){
        res.status(500).send({
            error: 'Failed to fetch cards',
            detail: error.message
        })
    }
}


export const getCardsToTrain = async (req, res) =>{
    try{
        const data = req.params.collId
        console.log("User id : ", req.user)
        console.log("Collection id : ", data)
        const result = await db
        .select({
            flcaId: tFlashCard.flcaId,
            flcaRecto: tFlashCard.flcaRecto,
            flcaVerso: tFlashCard.flcaVerso,
            flcaUrlRecto: tFlashCard.flcaUrlRecto,
            flcaUrlVerso: tFlashCard.flcaUrlVerso,
            collId: tFlashCard.collId,
            reviId: tRevision.reviId,
            reviLastDate: tRevision.reviLastDate,
            leveCooldown: tLevel.leveCooldown
        })
        .from(tFlashCard)
        .innerJoin(tCollection, eq(tCollection.collId, tFlashCard.collId))
        .leftJoin(tRevision, and(eq(tFlashCard.flcaId, tRevision.flcaId),eq(tRevision.userId, req.user),))
        .leftJoin(tLevel, eq(tRevision.leveId, tLevel.leveId))
        .where(
            and(
                or(
                    eq(tCollection.collVisibility, 'PUBLIC'),
                    eq(tCollection.userId, req.user)
                ),
                eq(tFlashCard.collId, data),
            ),
        )

        const filteredResults = result.filter(card => {
            if (!card.reviId) return true; 
            
            const nextReviewDate = new Date(card.reviLastDate).getTime() + (card.leveCooldown * 86400000);
            return nextReviewDate < Date.now();
        });
        
        if(result.length === 0){
            return res.status(404).json({
                error: 'Card not found or access denied'
            })
        }

        return res.status(200).json(filteredResults)
    } catch ( error ){
        res.status(500).send({
            error: 'Failed to fetch card',
            detail: error.message
        })
    }
}