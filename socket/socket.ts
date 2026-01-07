import { io, Socket } from "socket.io-client";

const origin = process.env.NEXT_PUBLIC_SOCKET_ORIGIN!;
const path = process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io";

export const socket: Socket = io(origin, {
  path,
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});
