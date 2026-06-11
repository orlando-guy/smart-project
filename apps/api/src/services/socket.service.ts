import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

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
        origin: "*", // À restreindre en production
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[Socket] Nouvel utilisateur connecté : ${socket.id}`);

      // Rejoindre une "room" spécifique à l'utilisateur pour les notifications privées
      socket.on('join', (userId: string) => {
        socket.join(userId);
        console.log(`[Socket] Utilisateur ${userId} a rejoint sa room de notification`);
      });

      socket.on('disconnect', () => {
        console.log(`[Socket] Utilisateur déconnecté`);
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
