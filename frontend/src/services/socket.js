import io from "socket.io-client";

export const socket = io("https://braggame-api.onrender.com", {
  transports: ['websocket'],
  autoConnect: false
});