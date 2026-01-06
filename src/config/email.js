import 'dotenv/config'
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {

    var transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST || "mailpit",
        port: process.env.MAIL_HOST || 1025,
    });

    const sender = {
        address: "project-r505@example.com",
        name: "Projet R505",
    };

    const verificationUrl = `http://localhost:3000/auth/verify-email/${token}`;
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