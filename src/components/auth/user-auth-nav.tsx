"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function UserAuthNav() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="outline" size="sm">
            Masuk
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Daftar</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <nav className="flex items-center space-x-1">
        {session?.user?.role !== 'admin' && session?.user && (
          <Link className={buttonVariants({ variant: "outline" })} href="/pengajuan-tambang">
            <Plus className="h-4 w-4 mr-1" />
            <span>Ajukan Tambang</span>
          </Link>
        )}
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">{session?.user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={session?.user?.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profil">Profil</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="text-red-600 focus:text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            {isSigningOut ? "Keluar..." : "Keluar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
