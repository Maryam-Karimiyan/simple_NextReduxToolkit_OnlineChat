import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io...");
    const io = new Server(res.socket.server as any, {
      path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("socket connected", socket.id);
      // وقتی یک پیام جدید دریافت می‌شه
      socket.on("send-message", async (msg) => {
        // msg = { sender, receiver, content }
        try {
          await connectDB();
          const saved = await Message.create(msg);
          io.emit("receive-message", saved); // broadcast persisted message
        } catch (err) {
          console.error("Message save error", err);
        }
      });

      socket.on("disconnect", () => {
        console.log("socket disconnect", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
