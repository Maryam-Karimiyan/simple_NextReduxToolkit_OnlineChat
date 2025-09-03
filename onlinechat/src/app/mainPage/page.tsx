// pages/index.js
'use client'
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Head from 'next/head';
import { Message as IMessage } from '@/types';
let socket:any;

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // اتصال به سرور Socket.io
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io();

      // وقتی پیامی از سرور دریافت می‌شه
      socket.on('message', (data: IMessage) => {
        setMessages((currentMessages) => [...currentMessages, data]);
      });
    };

    socketInitializer();

    return () => {
      // قطع اتصال هنگام خروج از صفحه
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && username.trim()) {
      const data = { username, message };
      socket.emit('message', data);
      setMessage('');
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Next.js Chat App</title>
      </Head>

      <h1>Next.js Chat App</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>

      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className="message-item">
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
          font-family: sans-serif;
        }
        form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        input {
          flex: 1;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        button {
          padding: 10px 15px;
          border-radius: 5px;
          border: none;
          background-color: #0070f3;
          color: white;
          cursor: pointer;
        }
        .messages-list {
          border: 1px solid #eee;
          padding: 15px;
          border-radius: 8px;
          max-height: 400px;
          overflow-y: auto;
        }
        .message-item {
          margin-bottom: 10px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}