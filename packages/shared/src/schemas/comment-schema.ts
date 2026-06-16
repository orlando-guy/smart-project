import { z } from 'zod';

export const CreateCommentSchema = z.object({
    description: z.string().min(1, "Le commentaire ne peut pas être vide").max(2000, "Le commentaire est trop long"),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
