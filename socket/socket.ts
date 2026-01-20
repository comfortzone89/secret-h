import { io } from "socket.io-client";

// Dev: connect directly to localhost:3001
// Docker / production: use same origin
const socketUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : undefined; // undefined → same origin

export const socket = io(socketUrl, {
  path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io",
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
