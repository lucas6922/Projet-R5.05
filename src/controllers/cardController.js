import { db } from '../db/database.js'
import { tFlashCard,tCollection, tRevision, tLevel } from '../db/schema.js'
import { eq, or, and } from 'drizzle-orm'



/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const getCard = async (req, res) =>{
    /* 
    #swagger.tags = ['Flashcards']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.description = 'Get a specific flashcard by ID. Accessible if the card belongs to a public collection or to the authenticated user.'
    #swagger.parameters['flcaId'] = {
      in: 'path',
      description: 'ID of the flashcard to retrieve',
      required: true,
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Flashcard retrieved successfully',
      schema: { $ref: '#/definitions/FlashcardDetail' }
    }
    #swagger.responses[404] = {
      description: 'Flashcard not found or not accessible',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */

    const { flcaId } = req.params
    try{
        const [result] = await db
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
        .where(and(or(eq(tCollection.collVisibility, 'PUBLIC'),eq(tCollection.userId, req.user)),eq(tFlashCard.flcaId, flcaId)));
        
        if(!result){
            return res.status(404).json({
                error: 'Not found',
                message: `Flashcard with id ${flcaId} not found or not accessible`
            })
        }
        return res.status(200).json({
            message: 'Flashcard retrieved successfully',
            data: result
        })
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
    /* 
    #swagger.tags = ['Flashcards']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.description = 'Create a new flashcard in a collection. Only the collection owner can add cards.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Flashcard data',
      required: true,
      schema: { $ref: '#/definitions/FlashcardCreateRequest' }
    }
    #swagger.responses[201] = {
      description: 'Flashcard created successfully',
      schema: { $ref: '#/definitions/FlashcardCreateResponse' }
    }
    #swagger.responses[403] = {
      description: 'User does not have permission to add cards to this collection',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */

    const { collId } = req.params;
    try{
        const data = {
            flcaRecto: req.body.flcaRecto,
            flcaVerso: req.body.flcaVerso,
            flcaUrlRecto: req.body.flcaUrlRecto,
            flcaUrlVerso: req.body.flcaUrlVerso,
            collId: collId,
        };

        const collAuthorization = await db
        .select()
        .from(tCollection)
        .where(and(eq(tCollection.collId, collId), eq(tCollection.userId, req.user)));

        if(collAuthorization.length === 0){
            return res.status(403).json({
                error: "You do not have permission to add cards to this collection"
            });
        }

        const result = await db
        .insert(tFlashCard)
        .values(data)
        .returning();

        res.status(201).json({
            message: "Card created",
            collection: result
        });
    } catch (error){
        res.status(500).send({
            error: 'Failed to create card',
            detail: error.message
        });
    }
    
}


//si la révision n'existe pas, la crée niveau 1
export const reviewCard = async (req, res) => {
    /* 
    #swagger.tags = ['Flashcards']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.description = 'Creates or updates a flashcard review for the authenticated user'
    #swagger.parameters['flcaId'] = {
      in: 'path',
      description: 'ID of the flashcard to review',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Review data',
      required: true,
      schema: { $ref: '#/definitions/ReviewRequest' }
    }
    #swagger.responses[200] = {
      description: 'Revision updated successfully',
      schema: { $ref: '#/definitions/ReviewResponse' }
    }
    #swagger.responses[201] = {
      description: 'New revision created successfully',
      schema: { $ref: '#/definitions/ReviewResponse' }
    }
    #swagger.responses[404] = {
      description: 'Flashcard not found or not accessible',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */
    
    const { flcaId } = req.params;
    const userId = req.user
    const {revisionLevel} = req.body

    try{

        const flashCard = await db
        .select()
        .from(tFlashCard)
        .innerJoin(tCollection, eq(tCollection.collId, tFlashCard.collId))
        .where(
            and(
                or(
                    eq(tCollection.collVisibility, 'PUBLIC'),
                    eq(tCollection.userId, req.user)
                ),
                eq(tFlashCard.flcaId, flcaId)
            )
        );

        if(flashCard.length === 0){
            return res.status(404).json({
                error: "Not found",
                message: `Flashcard with id : ${flcaId} not found or not accessible`
            });
        }

        const [revUpdate] = await db
            .update(tRevision)
            .set({
                reviLastDate: new Date(),
                leveId: revisionLevel
            })
            .where(
                and(
                    eq(tRevision.flcaId, flcaId),
                    eq(tRevision.userId, userId)
                )
            )
            .returning()

        if(!revUpdate){
            const newRevision = await db.insert(tRevision)
            .values({
                "reviLastDate": new Date(),
                "userId": userId,
                "flcaId": flcaId,
                "leveId": 1
            })
            .returning();

            return res.status(201).json({
                message: "Revision created successfully",
                data: {
                    revisionId: newRevision.reviId,
                    level: newRevision.leveId,
                    lastReviewDate: newRevision.reviLastDate,
                    isNew: true
                }
            })
        }else{
            return res.status(200).json({
                message: `Revision : ${revUpdate.reviId} update successfully`,
                data: {
                    revisionId: revUpdate.reviId,
                    level: revUpdate.leveId,
                    lastReviewDate: revUpdate.reviLastDate,
                    isNew: false
                }
            });
        }
    }catch (error){
        res.status(500).send({
            error: `Failed to review card ${flcaId}`,
            detail: error.message
        });
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const deleteCard = async (req, res) => {
    /* 
    #swagger.tags = ['Flashcards']
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.description = 'Delete a flashcard. Only the collection owner can delete cards from their collections.'
    #swagger.parameters['flcaId'] = {
      in: 'path',
      description: 'ID of the flashcard to delete',
      required: true,
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Flashcard deleted successfully',
      schema: {
        message: 'Flashcard deleted successfully'
      }
    }
    #swagger.responses[404] = {
      description: 'Flashcard not found or not owned by user',
      schema: { $ref: '#/definitions/Error' }
    }
    #swagger.responses[500] = {
      description: 'Server error',
      schema: { $ref: '#/definitions/Error' }
    }
    */
    const { flcaId } = req.params;
    const userId = req.user
    
    try{
        const card = await db
        .select()
        .from(tFlashCard)
        .innerJoin(tCollection, eq(tCollection.collId, tFlashCard.collId))
        .where(
            and(
                eq(tCollection.userId, userId),
                eq(tFlashCard.flcaId, flcaId)
            )
        );

        if(card.length == 0){
            return res.status(404).json({
                error: "Not found",
                message: `Flashcard with id ${flcaId} not found or you don't have permission to delete it`
            })
        }

        await db.delete(tFlashCard).where(eq(tFlashCard.flcaId, flcaId))

        return res.status(200).json({
            message : `Flashcard ${flcaId} as been deleted`
        })
    }catch (error){
        res.status(500).send({
            error: `Failed to delete card ${flcaId}`,
            detail: error.message
        });
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


//TODO faire différence entre acces denied et pas de carte à reviser
export const getCardsToTrain = async (req, res) =>{
    try{
        const data = req.params.collId
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

export const updateCard = async (req, res) => {
    const { flcaId } = req.params;
    const userId = req.user;
    const updateData = req.body;

    try {
        const [flashcard] = await db
            .select({
                flcaId: tFlashCard.flcaId,
                collId: tFlashCard.collId
            })
            .from(tFlashCard)
            .where(eq(tFlashCard.flcaId, flcaId))
            .limit(1);

        if (flashcard.length === 0) {
            return res.status(404).json({
                error: "Flashcard not found or inaccessible"
            });
        }

        const collection = await db
            .select()
            .from(tCollection)
            .where(
                and(
                    eq(tCollection.collId, flashcard.collId),
                    eq(tCollection.userId, userId)
                )
            )
            .limit(1);

        if (collection.length === 0) {
            return res.status(404).json({
                error: "Flashcard not found or inaccessible"
            });
        }

        const [updatedCard] = await db
            .update(tFlashCard)
            .set(updateData)
            .where(eq(tFlashCard.flcaId, flcaId))
            .returning();

        return res.status(200).json({
            message: "Flashcard updated successfully",
            data: {
                flcaId: updatedCard.flcaId,
                flcaRecto: updatedCard.flcaRecto,
                flcaVerso: updatedCard.flcaVerso,
                flcaUrlRecto: updatedCard.flcaUrlRecto,
                flcaUrlVerso: updatedCard.flcaUrlVerso
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to update flashcard',
            detail: error.message
        });
    }
    
}