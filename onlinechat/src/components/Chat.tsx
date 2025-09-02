"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { io as clientIO, Socket } from "socket.io-client";

type Msg = { _id: string; text: string; room: string; senderId: string; createdAt: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const socketRef = useRef<Socket | null>(null);

  // اتصال Socket.IO یک‌بار
  const socket = useMemo(() => {
    if (typeof window === "undefined") return null;
    if (!socketRef.current) {
      socketRef.current = clientIO("/", { path: "/socket.io" });
    }
    return socketRef.current;
  }, []);

  useEffect(() => {
    // پیام‌های اولیه
    fetch("/api/messages?room=global")
      .then((r) => r.json())
      .then((data) => setMessages(data));

    // لیسن به پیام‌های جدید
    if (!socket) return;
    socket.emit("join", "global");
    socket.on("message:new", (msg: Msg) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => {
        const el = document.getElementById("end");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    });

    return () => {
      socket?.off("message:new");
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [socket]);

  async function send() {
    const t = text.trim();
    if (!t) return;
    setText("");

    // از API برای ذخیره و سپس emit شدن توسط سرور
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: t, room: "global" }),
    });
  }

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, height: 420, overflowY: "auto" }}>
        {messages.map((m) => (
          <div key={m._id} style={{ marginBottom: 8 }}>
            <small style={{ opacity: 0.6 }}>{new Date(m.createdAt).toLocaleTimeString()}</small>
            <div>{m.text}</div>
          </div>
        ))}
        <div id="end" />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          placeholder="پیامت رو بنویس…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>ارسال</button>
      </div>
    </section>
  );
}
