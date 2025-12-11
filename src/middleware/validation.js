import { ZodType, ZodError } from 'zod'

export const validateBody = (schema) => {
    return (req, res, next) => {
        if(schema instanceof ZodType){
            try{
                req.body = schema.parse(req.body)
                next();
            } catch (error) {
                if(error instanceof ZodError){
                    return res.status(400).send({
                        error : 'Validation failed',
                        details : error.issues
                    })
                }
                res.status(500).send({
                    error: 'Internal server error'
                })
            }
            
        }
    }
}

export const validateParams = (schema) => {
    return (req, res, next) => {
        if(schema instanceof ZodType){
            try{
                schema.parse(req.params)
                next();
            } catch (error) {
                if(error instanceof ZodError){
                    return res.status(400).send({
                        error : 'Invalid params',
                        details : error.issues
                    })
                }
                res.status(500).send({
                    error: 'Internal server error'
                })
            }
            
        }
    }
}