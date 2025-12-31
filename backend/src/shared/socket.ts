import { Server as SocketIOServer } from "socket.io";

// Socket.IO instance sẽ được set từ index.ts
let ioInstance: SocketIOServer | null = null;

export const setIO = (io: SocketIOServer) => {
  ioInstance = io;
};

export const getIO = (): SocketIOServer => {
  if (!ioInstance) {
    throw new Error("Socket.IO instance not initialized. Call setIO() first.");
  }
  return ioInstance;
};

