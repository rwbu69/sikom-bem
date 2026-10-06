import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
});
export const metadata: Metadata = {
  title: "SIKOM BEM",
  description: "Sistem Informasi Manajemen BEM",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="antialiased">
      {" "}
      <body
        className={`${jakarta.variable} ${bricolage.variable} font-sans bg-stone-50 text-foreground min-h-screen flex flex-col`}
      >
        {" "}
        {children} <Toaster position="bottom-center" richColors />{" "}
      </body>{" "}
    </html>
  );
}
