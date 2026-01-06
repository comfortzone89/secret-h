import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_ORIGIN!, {
  path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io",
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});
