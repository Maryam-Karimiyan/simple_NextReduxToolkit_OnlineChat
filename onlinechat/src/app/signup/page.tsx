"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) router.push("/signin");
    else alert("ثبت‌نام ناموفق");
  }

  return (
    <main style={{ maxWidth: 420, margin: "48px auto" }}>
      <h1>ثبت‌نام</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="نام" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="رمز عبور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">ساخت حساب</button>
      </form>
      <a href="/signin">حساب دارم</a>
    </main>
  );
}
