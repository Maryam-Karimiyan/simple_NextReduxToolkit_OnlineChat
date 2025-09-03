// import '@/styles/globals.css';
// import { useEffect } from 'react';

// export default function MyApp({ Component, pageProps }: any) {
// // ensure socket route hot-init on serverless development
// useEffect(() => {
// fetch('/api/socket').catch(() => {});
// }, []);

// return <Component {...pageProps} />;
// }
'use client'
import { useState } from "react";
import Router from "next/navigation";
import Cookies from "js-cookie";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");

  const submit = async (e:any) => {
    e.preventDefault();
    const url = mode === "login" ? "/api/auth/signin" : "/api/auth/signup";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.token) Cookies.set("token", data.token);
      Router.push("/chat");
    } else {
      alert(data.error || data.message || JSON.stringify(data));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "login" ? "ورود" : "ثبت‌نام"}
        </h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <div className="flex items-center justify-between">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              {mode === "login" ? "ورود" : "ثبت"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm text-gray-600"
            >
              {mode === "login" ? "ساخت اکانت" : "بازگشت به ورود"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
