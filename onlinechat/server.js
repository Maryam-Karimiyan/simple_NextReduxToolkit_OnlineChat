/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    path: "/socket.io",
    cors: { origin: "*" },
  });

  // در دسترس‌گذاری io برای API Route‌ها
  global._io = io;

  io.on("connection", (socket) => {
    // پیوستن به اتاق پیش‌فرض
    socket.join("global");

    // اگر خواستی مستقیم از کلاینت هم پیام بگیری:
    socket.on("message:send", (payload) => {
      // اینجا می‌تونی ذخیره در DB رو هم انجام بدی؛ ما از API انجام می‌دیم.
      io.to(payload.room || "global").emit("message:new", payload);
    });

    socket.on("join", (room) => {
      socket.join(room || "global");
    });
  });

  server.listen(PORT, () => {
    console.log(`✅ Server ready on http://localhost:${PORT}`);
  });
});
