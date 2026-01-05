import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: false, // optional, but you must call socket.connect()
  withCredentials: true,
});
