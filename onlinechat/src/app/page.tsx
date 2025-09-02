import Chat from "@/components/Chat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main style={{ maxWidth: 720, margin: "48px auto" }}>
        <h1>چت آنلاین</h1>
        <p>برای استفاده وارد شوید.</p>
        <Link href="/signin">ورود</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "24px auto" }}>
      <h1>اتاق: global</h1>
      <Chat />
    </main>
  );
}
