import 'dotenv/config'
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
    const TOKEN = process.env.MAILTRAP_TOKEN;

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "37afb1bde4656f",
            pass: process.env.MAILTRAP_TOKEN
        }
    });

    const sender = {
        address: "hello@demomailtrap.co",
        name: "Projet R505",
    };

    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

    transport
    .sendMail({
        from: sender,
        to: email,
        subject: "Email verification",
        html: `
            <h1>Email verification</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}">here</a>
            <p>This link will expire in 24 hours</p>
        `
    })
    .then(console.log, console.error);
}