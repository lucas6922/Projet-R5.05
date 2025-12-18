import { request, response } from 'express'
import jwt from 'jsonwebtoken'

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {Function} next 
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(403).json({
            error: "Access token required"
        })
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId;
        console.log("decoded : ", decodedToken)
        console.log("userid : ", {userId})
        req.user = userId
        next()
    } catch (error){
        console.error(error)
        res.status(401).json({
            error: "Invalid or expired token"
        })
    }
}