"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  ScanLine,
  Megaphone,
  FileText,
  Database,
  ShieldAlert,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    // Exact match for admin home, startsWith for other routes
    const isActive =
      path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);
    return `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-4 ${
      isActive
        ? "bg-blue-500/10 text-blue-400 border-blue-500 font-medium"
        : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200 hover:border-slate-600"
    }`;
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={getLinkClass(href)} onClick={onNavigate}>
      {children}
    </Link>
  );

  return (
    <>
      <div className="p-5 border-b border-slate-800/50 bg-[#0B1120]">
        <h1 className="text-white text-lg font-bold tracking-wide flex items-center gap-3">
          <img
            src="/logo.png"
            alt="BEM UKRIM"
            className="w-8 h-8 rounded-full bg-white object-contain"
          />
          SIKOM BEM
        </h1>
        <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">
          Dashboard Admin
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-5 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Operasional
        </div>
        <nav className="space-y-1 mb-6">
          <NavLink href="/admin">
            <Home size={18} /> Ringkasan
          </NavLink>
          <NavLink href="/admin/kegiatan">
            <Calendar size={18} /> Manajemen Kegiatan
          </NavLink>
          <NavLink href="/admin/pengumuman">
            <Megaphone size={18} /> Pengumuman
          </NavLink>
        </nav>

        <div className="px-5 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Pelaksanaan Acara
        </div>
        <nav className="space-y-1 mb-6">
          <NavLink href="/admin/pendaftar">
            <Users size={18} /> Data Pendaftar
          </NavLink>
          <NavLink href="/admin/pengguna">
            <Users size={18} /> Manajemen Pengguna
          </NavLink>
          <NavLink href="/admin/presensi">
            <ScanLine size={18} /> Presensi Peserta
          </NavLink>
        </nav>

        <div className="px-5 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Arsip & Laporan
        </div>
        <nav className="space-y-1">
          <NavLink href="/admin/arsip">
            <FileText size={18} /> Dokumentasi (LPJ)
          </NavLink>
          <NavLink href="/admin/log">
            <ShieldAlert size={18} /> Audit Log
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden md:flex w-64 bg-[#0B1120] text-slate-300 flex-col flex-shrink-0 min-h-screen">
      <SidebarContent />
    </aside>
  );
}

import { useState } from "react";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden mr-2" />}>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-[#0B1120] border-r-slate-800 text-slate-300">
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
