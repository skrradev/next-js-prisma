import { WebSocket } from "ws";

const clients = new Set<WebSocket>();

export const runtime = "edge";

export async function GET(request: Request) {
  const { socket, response } = Deno.upgradeWebSocket(request);

  socket.onopen = () => {
    clients.add(socket);
    console.log("Client connected");
  };

  socket.onmessage = (event) => {
    // Broadcast to all clients
    const message = event.data;
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  socket.onclose = () => {
    clients.delete(socket);
    console.log("Client disconnected");
  };

  return response;
}
