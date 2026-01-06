import { io } from "socket.io-client";

const isDev = process.env.NODE_ENV === "development";

export const socket = io(
  isDev ? process.env.NEXT_PUBLIC_SOCKET_ORIGIN! : "/socket.io",
  {
    path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io",
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket", "polling"],
  }
);
