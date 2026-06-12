import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  initialize(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: ["http://localhost:3000", process.env.FRONTEND_URL as string],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket']
    });

    // Middleware d'authentification pour les sockets
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentification échouée : Token manquant"));
      }

      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
        socket.data.userId = decoded.id; // Stocke l'ID utilisateur dans la socket
        next();
      } catch (err) {
        next(new Error("Authentification échouée : Token invalide"));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId;
      
      /**
       * Chaque utilisateur authentifié rejoint une "room" portant son propre ID.
       * Cela permet d'envoyer des messages ciblés sans diffuser à tout le monde.
       */
      socket.join(userId);

      socket.on('disconnect', () => {
        // Optionnel : Gérer la logique de déconnexion (ex: mettre à jour le statut 'en ligne')
      });
    });

    return this.io;
  }

  emitToUser(userId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(userId).emit(event, data);
    }
  }
}
