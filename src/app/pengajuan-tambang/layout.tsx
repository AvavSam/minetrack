import type React from "react";
import { DashboardHeader } from "@/components/dashboard/header";

export default function PengajuanTambangLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      <main className="flex-1">{children}</main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} MineTrack. Semua hak dilindungi.</div>
      </footer>
    </div>
  );
}
