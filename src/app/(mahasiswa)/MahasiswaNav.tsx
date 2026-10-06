"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar } from "lucide-react";
export default function MahasiswaNav({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/profil", label: "Beranda", icon: Home },
    { href: "/kalender", label: "Kalender", icon: Calendar },
  ];
  if (isMobile) {
    return (
      <>
        {" "}
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-3 px-4 ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              {" "}
              <Icon size={20} />{" "}
              <span className="text-[10px] font-medium">{link.label}</span>{" "}
            </Link>
          );
        })}{" "}
      </>
    );
  }
  return (
    <>
      {" "}
      {links.map((link) => {
        const active = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors flex items-center gap-2 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {" "}
            <Icon size={16} /> {link.label}{" "}
          </Link>
        );
      })}{" "}
    </>
  );
}
