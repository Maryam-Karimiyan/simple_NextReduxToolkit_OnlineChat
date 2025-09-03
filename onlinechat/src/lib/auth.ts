import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectDB } from "./db";
import User from "@/models/User";
import { z } from "zod";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credsSchema.safeParse(raw);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).lean();
        if (!user) return null;

        const ok = await compare(parsed.data.password, user.password);
        if (!ok) return null;

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
    // OAuth اختیاری:
    // GitHubProvider({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (token?.uid && session.user) (session.user as any).id = token.uid as string;
      return session;
    },
  },
  pages: { signIn: "/signin" }, // صفحه سفارشی ورود
};
