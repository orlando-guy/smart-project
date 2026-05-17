import { z } from 'zod';

// ⚠️ Ceci est un exemple de code partagé entre le frontend et le backend.
// Un schéma partagé pour valider un utilisateur.
export const UserSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().min(2, "Le nom est trop court")
});

// Un type TypeScript déduit du schéma
export type User = z.infer<typeof UserSchema>;
export type UserResponse = { id: string; email: string; name: string; createdAt: Date };

export const CourseSchema = z.object({
  id: z.number().nullish(),
  name: z.string().min(3, {
    message: "Name is required and should be minimum 3 character"
  }),
  description: z.string().min(20, {
    message: "Description is required and should be minimum 20 character"
  })
});

export type Course = z.infer<typeof CourseSchema>;

export const LoginUserSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis")
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;