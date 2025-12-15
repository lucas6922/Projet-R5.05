import 'dotenv/config'
import { db } from '../db/database.js'
import { tUser } from '../db/schema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '../config/email.js';

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const registerUser = async (req, res) => {
    try{
        const {userMail, userName, userFirstname, userPass, aproId} = req.body;


        const existingUser = await db
        .select()
        .from(tUser)
        .where(eq(tUser.userMail, userMail));

        if(existingUser.length > 0) {
            return res.status(400).json({
                error: 'Email already registred'
            });
        }


        const hashedPassword = await bcrypt.hash(userPass, 12);
    
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

        //token pour valide mail
        const mailToken = jwt.sign(
            {
                userId: result.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        //token renvoyé utile pour auth
        const token = jwt.sign(
            {
                userId: result.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );


        await sendVerificationEmail(userMail, mailToken);


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


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const loginUser = async (req, res) => {
    try{
        const {userMail, userPass} = req.body;

        const [user] = await db
        .select()
        .from(tUser)
        .where(eq(tUser.userMail, userMail));


        if(!user){
            res.status(404).json({
                message: "invalid email or password",
            });
        }

        if(user.userStatus != 'VALIDATED'){
            return res.status(403).json({
                error: 'Please verify your email before login'
            });
        }

        const valid = await bcrypt.compare(userPass, user.userPass);

        if(!valid){
            res.status(404).json({
                message: "invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "User logged in",
            userData: {
                id: user.userId,
                email: user.userMail,
                username: user.userName
            },
            token
        });

    }catch (error){
        res.status(500).send({
            error: 'Failed to login',
            detail: error.message
        })
    }
}

/**
 * 
 */
/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const verifyEmail = async (req, res) => {
    try{
        const { token } = req.params;
        console.log(token)
        if(!token){
            return res.status(400).json({
                error: 'Verification oken is required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await db
            .select()
            .from(tUser)
            .where(eq(tUser.userId, decoded.userId));

        if(!user){
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if(user.status == 'VALIDATED'){
            return res.status(200).json({
                message: 'Email already verified'
            });
        }

        await db
            .update(tUser)
            .set({userStatus: 'VALIDATED'})
            .where(eq(tUser.userId, decoded.userId));

        return res.status(200).json({
            message: "Email verified successfully"
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            error: 'Failed to verify email',
            detail: error.message
        });
    }
}