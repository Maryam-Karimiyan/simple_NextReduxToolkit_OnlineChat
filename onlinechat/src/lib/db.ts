import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("⛔ MONGODB_URI تعریف نشده است.");

type TCached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

// @ts-ignore
let cached: TCached = global.mongoose || { conn: null, promise: null };

// @ts-ignore
if (!global.mongoose) global.mongoose = cached;

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: "chatapp" })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
