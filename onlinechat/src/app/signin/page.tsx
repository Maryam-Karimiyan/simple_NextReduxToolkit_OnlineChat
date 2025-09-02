"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: false });
    if (!res?.error) router.push("/");
    else alert(res.error || "ورود ناموفق");
  }

  return (
    <main style={{ maxWidth: 420, margin: "48px auto" }}>
      <h1>ورود</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="رمز عبور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">ورود</button>
      </form>
      <a href="/signup">ثبت‌نام</a>
    </main>
  );
}
