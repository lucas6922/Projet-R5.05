import { z } from 'zod';

export const registerSchema = z.object({
    userMail: z.email(),
    userName: z.string().min(1).max(30),
    userFirstname: z.string().min(1).max(30),
    userPass: z.string().min(1).max(255),
    aproId: z.number().int().min(1).max(2)
})
