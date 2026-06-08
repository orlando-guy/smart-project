import { env } from './config/env';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';
import projectRoutes from './routes/project.routes';
import { requireAuth } from './middlewares/auth.middleware';

const app = express();
const API_BASE_PATH = '/api' as const;

const notifications = [
    {
        id: 'notification-1',
        title: 'Nouvelle tâche assignée',
        message: 'Une tâche vient de vous être assignée dans un projet.',
        read: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'notification-2',
        title: 'Membre ajouté',
        message: 'Un nouveau membre a rejoint votre espace de travail.',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
        id: 'notification-3',
        title: 'Projet mis à jour',
        message: 'Les informations d’un projet ont été modifiées.',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    }
];

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

app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API de Smart-project");
})

app.post(`${API_BASE_PATH}/auth/logout`, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Déconnexion effectuée'
    });
});

app.get(`${API_BASE_PATH}/notifications`, requireAuth, (req, res) => {
    return res.status(200).json({
        success: true,
        data: notifications
    });
});

app.post(`${API_BASE_PATH}/messages`, requireAuth, (req, res) => {
    const { content } = req.body as { content?: string };

    if (!content?.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Le message est obligatoire'
        });
    }

    return res.status(201).json({
        success: true,
        data: {
            id: crypto.randomUUID(),
            content: content.trim(),
            author: req.user,
            createdAt: new Date().toISOString()
        }
    });
});

// Déclaration des routes de l'API
app.use(`${API_BASE_PATH}/users`, userRoutes);
app.use(API_BASE_PATH, projectRoutes);

// Le middleware d'erreur doit TOUJOURS être enregistré en dernier
app.use(errorHandler);

app.listen(env.API_PORT, () => {
    console.log(`[${env.NODE_ENV}] L'API s'exécute sur le port ${env.API_PORT}`)
})
