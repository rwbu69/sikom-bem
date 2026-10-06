import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";
import { Home, Calendar } from "lucide-react";
import MahasiswaNav from "./MahasiswaNav";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "sikom-rahasia-super-aman-123",
);
export default async function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let isLoggedIn = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role === "MAHASISWA") isLoggedIn = true;
    } catch {}
  }
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {" "}
      {/* Top Navbar (Desktop) */}{" "}
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        {" "}
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          {" "}
          <Link
            href="/"
            className="font-bold text-foreground flex items-center gap-2"
          >
            {" "}
            <img
              src="/logo.png"
              alt="BEM"
              className="w-7 h-7 object-contain"
            />{" "}
            <span className="tracking-tight text-base font-heading">
              SIKOM BEM
            </span>{" "}
          </Link>{" "}
          <nav className="hidden md:flex items-center gap-6">
            {" "}
            {isLoggedIn ? (
              <MahasiswaNav />
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {" "}
                Masuk Panitia &rarr;{" "}
              </Link>
            )}{" "}
          </nav>{" "}
        </div>{" "}
      </header>{" "}
      <main className="flex-1 pb-16 md:pb-8"> {children} </main>{" "}
      {/* Bottom Navigation (Mobile Only) */}{" "}
      {isLoggedIn && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex items-center justify-around z-50">
          {" "}
          <MahasiswaNav isMobile />{" "}
        </nav>
      )}{" "}
    </div>
  );
}
