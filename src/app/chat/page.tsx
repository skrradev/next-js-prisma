"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    fetch("/api/socket").finally(() => {
      const socketIo = io({
        path: "/api/socket",
      });

      socketIo.on("connect", () => {
        console.log("Connected to Socket.IO");
      });

      socketIo.on("message", (message: string) => {
        setMessages((prev) => [...prev, `Other: ${message}`]);
      });

      socketIo.on("disconnect", () => {
        console.log("Disconnected from Socket.IO");
      });

      setSocket(socketIo);

      // Cleanup on unmount
      return () => {
        socketIo.disconnect();
      };
    });
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && inputMessage.trim()) {
      socket.emit("message", inputMessage);
      setMessages((prev) => [...prev, `You: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Real-time Chat</h1>

      <div className="bg-gray-100 p-4 h-96 overflow-y-auto mb-4 rounded">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            {message}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
