import { z } from 'zod';

export const createCardSchema = z.object({
    flcaTitle: z.string().min(1).max(50),
    flcaRecto: z.string().min(1).max(255),
    flcaVerso: z.string().min(1).max(255),
    flcaUrlRecto: z.string().max(255),
    flcaUrlVerso: z.string().max(255),
    collId: z.string().min(1).max(50),
});

export const cardIdSchema = z.object({
    flcaId: z.uuid(),
})

export const reviewCardLevelSchema = z.object({
    revisionLevel: z.int().min(1).max(5)
})