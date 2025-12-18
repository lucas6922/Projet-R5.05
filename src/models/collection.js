import { z } from 'zod';

export const createCollectionSchema = z.object({
    collTitle: z.string().min(1).max(50),
    collDesc: z.string().min(1).max(300),
    collVisibility: z.enum(['PUBLIC', 'PRIVATE']),
});

export const collectionIdSchema = z.object({
    collId: z.uuid(),
})