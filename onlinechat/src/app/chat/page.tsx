"use client";
import { useEffect, useState } from "react";
import { io,Socket } from "socket.io-client";

let socket:Socket;

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    socket = io({ path: "/api/socket" });

    socket.on("receive-message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("send-message", message);
    setMessage("");
  };

  return (
    <div>
      <div>
        {chat.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
