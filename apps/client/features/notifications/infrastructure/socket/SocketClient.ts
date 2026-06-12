import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

export class SocketClient {
  private static instance: SocketClient;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  connect() {
    if (this.socket?.connected) return;

    const token = useAuthStore.getState().token;
    if (!token) return null;

    const url = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";
    this.socket = io(url, {
      transports: ['websocket'],
      upgrade: false,
      auth: {
        token // Envoie le token JWT au serveur
      }
    });

    this.socket.on("connect", () => {
      // Connexion établie et room rejointe côté serveur
    });

    this.socket.on("connect_error", (err) => {
      // Gérer l'erreur de connexion (ex: token expiré pour le websocket)
    });

    this.socket.on("disconnect", () => {
      // Nettoyage automatique effectué par socket.io-client
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}
