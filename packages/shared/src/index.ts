import { z } from 'zod';

// ⚠️ Ceci est un exemple de code partagé entre le frontend et le backend.
// Un schéma partagé pour valider un utilisateur.
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2)
});

// Un type TypeScript déduit du schéma
export type User = z.infer<typeof UserSchema>;
