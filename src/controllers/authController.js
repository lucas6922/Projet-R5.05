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
    /* 
        #swagger.tags = ['Auth']
        #swagger.security = []
        #swagger.summary = 'Register a user'
        #swagger.description = 'Register a new user with email, last name, first name and password. A verification email is sent.'
        #swagger.parameters['body'] = {
        in: 'body',
        description: 'Registration information',
        required: true,
        schema: { $ref: '#/definitions/RegisterRequest' }
        }
        #swagger.responses[201] = {
        description: 'User created successfully',
        schema: { $ref: '#/definitions/RegisterResponse' }
        }
        #swagger.responses[400] = {
        description: 'Email already registered',
        schema: { $ref: '#/definitions/Error' }
        }
        #swagger.responses[500] = {
        description: 'Server error',
        schema: { $ref: '#/definitions/Error' }
        }
    */
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
    /* 
        #swagger.tags = ['Auth']
        #swagger.security = []
        #swagger.summary = 'Login a user'
        #swagger.description = 'Authentication by email and password, returns a JWT. The user must have verified their email.'
        #swagger.parameters['body'] = {
        in: 'body',
        description: 'Login credentials',
        required: true,
        schema: { $ref: '#/definitions/LoginRequest' }
        }
        #swagger.responses[200] = {
        description: 'Successfully logged in',
        schema: { $ref: '#/definitions/AuthResponse' }
        }
        #swagger.responses[403] = {
        description: 'Email not verified',
        schema: { $ref: '#/definitions/Error' }
        }
        #swagger.responses[404] = {
        description: 'Invalid email or password',
        schema: { $ref: '#/definitions/Error' }
        }
        #swagger.responses[500] = {
        description: 'Server error',
        schema: { $ref: '#/definitions/Error' }
        }
    */
    try{
        const {userMail, userPass} = req.body;

        const [user] = await db
        .select()
        .from(tUser)
        .where(eq(tUser.userMail, userMail));


        if(!user){
            return res.status(404).json({
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
            return res.status(404).json({
                message: "invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user.userId
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
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
 * @param {request} req 
 * @param {response} res 
 */
export const verifyEmail = async (req, res) => {
    /*
        #swagger.tags = ['Auth']
        #swagger.security = []
        #swagger.summary = 'Verify email'
        #swagger.description = 'User email verification via the token received by email'
        #swagger.parameters['token'] = {
            in: 'path',
            description: 'JWT verification token received by email',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Email verified successfully or already verified',
            content: {
            "text/html": {
                schema: { type: 'string' },
                example: '<!DOCTYPE html><html><body><h1>Email verified succesfully</h1></body></html>'
            }
            }
        }
        #swagger.responses[400] = {
            description: 'User not found',
            content: {
            "text/html": {
                schema: { type: 'string' },
                example: '<!DOCTYPE html><html><body><h1>User not found</h1></body></html>'
            }
            }
        }
        #swagger.responses[500] = {
            description: 'Verification error (invalid or expired token) or unexpected error',
            content: {
            "text/html": {
                schema: { type: 'string' },
                example: '<!DOCTYPE html><html><body><h1>An unexpected error occurred</h1></body></html>'
            }
            }
        }
    */
    try{
        const { token } = req.params;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [user] = await db
            .select()
            .from(tUser)
            .where(eq(tUser.userId, decoded.userId));

        if(!user){
            return res.status(400).send(
                `<!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="utf-8">
                    <title>Error</title>
                </head>
                <body>
                    <h1>User not found</h1>
                </body>
                </html>`
            );
        }

        if(user.userStatus == 'VALIDATED'){
            return res.status(200).send(
                `<!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="utf-8">
                    <title>Email verified </title>
                </head>
                <body>
                    <h1>Email already verified</h1>
                </body>
                </html>`
            );
        }

        await db
            .update(tUser)
            .set({userStatus: 'VALIDATED'})
            .where(eq(tUser.userId, decoded.userId));

        return res.status(200).send(
            `<!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="utf-8">
                <title>Email verified </title>
            </head>
            <body>
                <h1>Email verified succesfully</h1>
            </body>
            </html>`
        );
    }catch(error){
        console.log(error);
        res.status(500).send(
            `<!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="utf-8">
                <title>Error</title>
            </head>
            <body>
                <h1>An unexpected error occurred</h1>
            </body>
            </html>`
        );
    }
}