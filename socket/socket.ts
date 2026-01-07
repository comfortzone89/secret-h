import { io } from "socket.io-client";

const isDev = process.env.NODE_ENV === "development";

// In dev, connect to the dev socket server (usually localhost:3001)
// In production, use same origin + relative path so Nginx / Ingress can proxy
const SOCKET_URL = isDev
  ? process.env.NEXT_PUBLIC_SOCKET_ORIGIN || "http://localhost:3001"
  : "/socket.io";

export const socket = io(SOCKET_URL, {
  path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io",
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"], // fallback for environments that block WS
});
