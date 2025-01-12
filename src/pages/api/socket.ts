import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("message", (message) => {
        // Broadcast the message to all clients except sender
        socket.broadcast.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
