import { z } from 'zod';

const TITLE_LENGTH = [3, 100];

export const ProjectSchema = z.object({
    title: z.string().min(TITLE_LENGTH[0], 'Le titre est trop court').max(TITLE_LENGTH[1], "Le titre est trop long"),
    description: z.string().optional().default(""),
});

export type ProjectInput = z.infer<typeof ProjectSchema>

