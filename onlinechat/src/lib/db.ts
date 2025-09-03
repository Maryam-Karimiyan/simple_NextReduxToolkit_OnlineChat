import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "chatApp",
    });
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}
// lib/dbConnect.js
// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }
//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }
//   return cached.conn;
// }

// export default dbConnect;
// در Next.js وقتی شما در حالت development کار می‌کنید (یعنی با npm run dev یا yarn dev)، هر بار که فایلی تغییر می‌کنه، سرور به صورت Hot Reload دوباره اجرا میشه.

// اگر هر بار mongoose.connect(...) صدا زده بشه، اتصال جدیدی به دیتابیس باز میشه.

// در MongoDB محدودیت کانکشن وجود داره (مثلاً در سرویس‌هایی مثل MongoDB Atlas، تعداد اتصال‌ها محدود هست).

// بنابراین خیلی سریع با خطاهایی مثل Too many connections یا MongoServerError: Exceeded connection limit مواجه می‌شید.
// global

// در محیط Node.js یک آبجکت سراسری (global object) وجود داره به اسم global.

// این آبجکت مشابه window در مرورگره و هر چیزی که بهش اضافه بشه در کل برنامه (تمام ماژول‌ها) قابل دسترس میشه.

// global.mongoose

// این یعنی انتظار داریم که قبلاً در جایی از برنامه global.mongoose مقداردهی شده باشه.

// معمولاً در پروژه‌هایی که از دیتابیس MongoDB + Mongoose استفاده می‌کنن، ما یک بار به دیتابیس وصل می‌شیم و اون اتصال رو در global ذخیره می‌کنیم تا در رفرش‌های بعدی (مثلاً در Next.js یا وقتی hot reload اتفاق میفته) دوباره اتصال‌های تکراری ایجاد نشه.

// let cached = global.mongoose;

// این خط میاد مقدار ذخیره‌شده در global.mongoose رو در متغیر محلی cached می‌ریزه.

// اگر global.mongoose وجود داشته باشه (یعنی قبلاً ست شده باشه)، همون اتصال استفاده میشه.

// اگر وجود نداشته باشه (یعنی اولین بار هست که کد اجرا میشه)، معمولاً در ادامه‌ی کد یک اتصال جدید ساخته میشه و بعداً دوباره داخل global.mongoose ذخیره میشه.