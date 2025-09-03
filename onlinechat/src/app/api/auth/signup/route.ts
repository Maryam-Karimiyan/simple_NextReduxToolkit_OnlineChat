import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hash } from "bcryptjs";
// import { z } from "zod";

// const schema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   password: z.string().min(6),
// });

export async function POST(req: Request) {
  await connectDB();
  const { username, password } = await req.json();

  const hashedPassword = await hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();

  return new Response(JSON.stringify({ message: "User registered!" }), {
    status: 201,
  });
  // const body = await req.json();
  // const parsed = schema.safeParse(body);
  // if (!parsed.success) {
  //   return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  // }

  // await connectDB();

  // const exists = await User.findOne({ email: parsed.data.email });
  // if (exists) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  // const password = await hash(parsed.data.password, 10);
  // await User.create({ ...parsed.data, password });
  // return NextResponse.json({ ok: true });
}
