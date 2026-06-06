import { z } from 'zod';

const TITLE_LENGTH = [3, 100];
const MIN_DESCRIPTION_LENGTH = 3;

export const ProjectSchema = z.object({
    title: z.string().min(TITLE_LENGTH[0], 'Le titre est trop court').max(TITLE_LENGTH[1], "Le titre est trop long"),
    description: z.string().min(
        MIN_DESCRIPTION_LENGTH,
        `La description doit avoir au moins ${MIN_DESCRIPTION_LENGTH} caractères`
    ),
});

export const AddMemberToProjectSchema = z.object({
    projectId: z.string().min(1, "projectId est requis"),
    newMemberId: z.string().min(1, "newMemberId est requis")
})

export type AddNewMemberInput = z.infer<typeof AddMemberToProjectSchema>

export type ProjectInput = z.infer<typeof ProjectSchema>

