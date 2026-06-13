import { env } from './config/env';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import notificationRoutes from './routes/notification.routes';
import swaggerRouter from './middlewares/swagger.middleware';
import { SocketService } from './services/socket.service';

const app = express();
const httpServer = createServer(app);
const API_BASE_PATH = '/api' as const;

// Initialisation de Socket.io
SocketService.getInstance().initialize(httpServer);

app.disable('x-powered-by');

// Configuration CORS dynamique
const allowedorigins = new Set([
    "http://localhost:3000",  // Développement (Next.js)
    process.env.FRONTEND_URL   // Production (ex: https://mon-app.com
]);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedorigins.has(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
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
app.use(API_BASE_PATH, taskRoutes);
app.use(`${API_BASE_PATH}/notifications`, notificationRoutes);

// Le middleware d'erreur doit TOUJOURS être enregistré en dernier
app.use(errorHandler);

httpServer.listen(env.API_PORT, () => {
    console.log(`[${env.NODE_ENV}] L'API s'exécute sur le port ${env.API_PORT}`)
})
