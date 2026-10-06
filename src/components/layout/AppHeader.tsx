"use client";

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { MobileSidebar } from './AppSidebar';

export function AppHeader() {
  const router = useRouter();

  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  const activePage = paths.length > 1 ? paths[1] : 'Ringkasan';
  const pageName = activePage.charAt(0).toUpperCase() + activePage.slice(1).replace(/-/g, ' ');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-14 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
      <div className="flex items-center text-sm text-slate-500">
        <MobileSidebar />
        <span className="hidden sm:inline">Beranda / </span><span className="font-semibold text-slate-900 capitalize sm:ml-1">{pageName}</span>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-600 font-medium">Pengurus BEM</span>
        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
          <LogOut className="mr-2 h-4 w-4" /> Keluar
        </Button>
      </div>
    </header>
  );
}
