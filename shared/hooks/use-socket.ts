// hooks/useSocket.ts
import { useAuthStore } from "@/libs/store/authStore";
import { socketService } from "@/shared/services/socket";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(
    socketService.getSocket()
  );

  const { session } = useAuthStore();

  useEffect(() => {
    if (!socket) {
      const newSocket = socketService.connect(session?.token);
      setSocket(newSocket);
    }

    return () => {
      // optional: if you want socket to persist globally, comment this out
      // socketService.disconnect();
    };
  }, [session]);

  return socket;
};
