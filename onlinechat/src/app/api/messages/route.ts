import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Message from "@/models/Message";

// برای emit کردن از API به Socket.IO
declare global {
  // eslint-disable-next-line no-var
  var _io: import("socket.io").Server | undefined;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room") || "global";

  await connectToDB();
  const messages = await Message.find({ room })
    .sort({ createdAt: 1 })
    .limit(100)
    .lean();

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, room = "global" } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  await connectToDB();
  const doc = await Message.create({ text, room, senderId: (session.user as any).id });

  // emit real-time
  global._io?.to(room).emit("message:new", {
    _id: doc._id.toString(),
    text: doc.text,
    room: doc.room,
    senderId: doc.senderId.toString(),
    createdAt: doc.createdAt,
  });

  return NextResponse.json({ ok: true, id: doc._id });
}
