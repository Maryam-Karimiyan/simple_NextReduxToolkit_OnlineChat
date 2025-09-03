"use client";
import { useEffect, useRef, useState } from "react";
import { io,Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket:Socket;

export default function ChatPage() {
  const [messages, setMessages] = useState<String[]>([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(():any => {
    const token = Cookies.get("token");
    // naive token-decoding just to get username if JWT exists
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.username);
      } catch (e) {
        console.warn("invalid token");
      }
    }

    // load history
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => setMessages(data));

    socket = io({ path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/api/socket" });
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket?.disconnect();
  }, []);

  useEffect(
    () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  const send = async () => {
    if (!text.trim()) return;
    const msg = { sender: username || "anonymous", content: text };
    socket.emit("send-message", msg);
    setText("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white">چت آنلاین ساده</header>
      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-2">
          {messages.map((m) => (
            <div
              key={m._id || Math.random()}
              className={`p-2 rounded ${
                m.sender === username
                  ? "bg-blue-100 self-end"
                  : "bg-gray-100 self-start"
              }`}
            >
              <div className="text-xs text-gray-600">{m.sender}</div>
              <div>{m.content}</div>
              <div className="text-xs text-gray-400">
                {new Date(m.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="p-4 border-t">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="پیام..."
          />
          <button
            onClick={send}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            ارسال
          </button>
        </div>
      </footer>
    </div>
  );
}
