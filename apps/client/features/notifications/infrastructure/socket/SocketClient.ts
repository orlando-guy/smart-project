import { io, Socket } from "socket.io-client";

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

  connect(userId: string) {
    if (this.socket?.connected) return;

    const url = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";
    this.socket = io(url);

    this.socket.on("connect", () => {
      console.log("[Socket] Connecté au serveur");
      this.socket?.emit("join", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("[Socket] Déconnecté du serveur");
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
