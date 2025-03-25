"use client"

import { Map, Plus } from "lucide-react"
import Link from "next/link"
import { UserAuthNav } from "./auth/user-auth-nav"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <Link href="/" className="flex items-center space-x-2">
          <Map className="h-6 w-6 text-emerald-600" />
          <span className="font-bold text-xl">MineTrack</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <UserAuthNav />
      </div>
    </header>
  );
}
