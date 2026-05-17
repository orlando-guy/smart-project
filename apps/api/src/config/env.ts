import dotenv from 'dotenv';
import { z } from 'zod';

// Charge le fichier .env approprié
dotenv.config({
    path: '/Users/orlandoguichard/Documents/LAB/Websites/smart-project/apps/api/.env.local'
});

/* 
    Pour éviter que votre API ne démarre avec une variable manquante
    (ce qui ferait planter l'authentification JWT ou Prisma en production),
    nous utilisons Zod pour valider les variables dès le lancement du serveur.
*/

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    API_PORT: z.string().transform((val) => Number.parseInt(val, 10)).default('4000'),
    JWT_SECRET: z.string().min(32, "Le JWT_SECRET doit faire au moins 32 caractères pour être sécurisé"), // openssl rand -base64 32
    DATABASE_URL: z.string().url("Le DATABASE_URL doit être une URL valide"),
})

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Variables d'environnement invalides ou manquantes :");
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1); // Arrête immédiatement l'application
}

export const env = _env.data;