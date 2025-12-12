import 'dotenv/config'
import { db } from '../db/database.js'
import { tUser } from '../db/schema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const registerUser = async (req, res) => {
    try{
        const {userMail, userName, userFirstname, userPass, aproId} = req.body;
        console.log(userMail, userName, userFirstname, userPass, aproId)
        const hashedPassword = await bcrypt.hash(userPass, 12);
        console.log(hashedPassword)
    
        const [result] = await db
        .insert(tUser)
        .values({
            userMail,
            userName,
            userFirstname,
            userPass: hashedPassword,
            aproId,
            userStatus: "PENDING"
        })
        .returning({
            id: tUser.userId
        });

        console.log(result)
        const token = jwt.sign(
            {
                userId: result.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "user created",
            user: result,
            token,
        });
    } catch (error){
        res.status(500).send({
            error: 'Failed to create user',
            detail: error.message
        })
    }
}
