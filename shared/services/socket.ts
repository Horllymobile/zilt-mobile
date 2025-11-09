import { io, Socket } from "socket.io-client";
import { API_URL } from "../constants/endpoints";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}
  private reconnectCallbacks: (() => void)[] = [];
  private connectCallbacks: (() => void)[] = [];

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token?: string) {
    if (!this.socket) {
      console.log(token);
      this.socket = io(API_URL, {
        transports: ["websocket"],
        auth: { token },
      });

      this.socket.on("connect", () => {
        // console.log("🔁 Reconnected after", attempt, "attempts");
        this.connectCallbacks.forEach((cb) => cb());
      });

      this.socket.on("reconnect", (attempt) => {
        console.log("🔁 Reconnected after", attempt, "attempts");
        this.reconnectCallbacks.forEach((cb) => cb());
      });

      this.socket.on("disconnect", (reason) => {
        console.log("❌ Disconnected:", reason);
      });
    }
    return this.socket;
  }

  onReconnect(cb: () => void) {
    this.reconnectCallbacks.push(cb);
  }

  onConnect(cb: () => void) {
    this.connectCallbacks.push(cb);
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = SocketService.getInstance();
