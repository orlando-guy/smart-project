import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().min(2, "Le nom est trop court")
});

// Un type TypeScript déduit du schéma
type User = z.infer<typeof UserSchema>;
type UserResponse = { id: string; email: string; name: string; createdAt: Date };

const LoginUserSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis")
});

type LoginUserInput = z.infer<typeof LoginUserSchema>;

export {
    UserSchema,
    LoginUserSchema,
    User,
    UserResponse,
    LoginUserInput
}