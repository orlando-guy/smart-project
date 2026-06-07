import { env } from './config/env';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';
import projectRoutes from './routes/project.routes';
import swaggerRouter from './middlewares/swagger.middleware';

const app = express();
const API_BASE_PATH = '/api' as const;

app.disable('x-powered-by');

// Configuration CORS dynamique
const allowedorigins = new Set([
    "http://localhost:3000",  // Développement (Next.js)
    process.env.FRONTEND_URL   // Production (ex: https://mon-app.com
]);

// Contrairement à app.use (cors ()) qui autorise tout le
// monde (* ), cette configuration bloque toute tentative provenant d'un domaine inconnu.
app.use(cors({
    origin: (origin, callback) => {
        // Autoriser les requêtes sans origine (comme Postman)
        if (!origin) return callback(null, true);
        if (allowedorigins.has(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Requis pour l'utilisation des cookies ou des headers 
}));

app.use(express.json());

// Injection de la documentation Swagger
app.use('/docs', swaggerRouter);

app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API de Smart-project");
})

// Déclaration des routes de l'API
app.use(`${API_BASE_PATH}/users`, userRoutes);
app.use(API_BASE_PATH, projectRoutes);

// Le middleware d'erreur doit TOUJOURS être enregistré en dernier
app.use(errorHandler);

app.listen(env.API_PORT, () => {
    console.log(`[${env.NODE_ENV}] L'API s'exécute sur le port ${env.API_PORT}`)
})
