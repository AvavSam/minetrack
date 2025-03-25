"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [tipeTambang, setTipeTambang] = useState(searchParams.get("tipeTambang") || "");
  const [izinTambang, setIzinTambang] = useState(searchParams.get("izinTambang") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      // Buat URL dengan parameter pencarian
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (tipeTambang) params.set("tipeTambang", tipeTambang);
      if (izinTambang) params.set("izinTambang", izinTambang);

      router.push(`/dashboard?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setSearch("");
    setTipeTambang("");
    setIzinTambang("");

    startTransition(() => {
      router.push("/dashboard");
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input type="search" placeholder="Cari tambang..." className="pl-9 w-full md:w-[200px] lg:w-[300px]" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filter</h4>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipe Tambang</label>
              <Select value={tipeTambang} onValueChange={setTipeTambang}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua tipe</SelectItem>
                  <SelectItem value="emas">Emas</SelectItem>
                  <SelectItem value="batu_bara">Batu Bara</SelectItem>
                  <SelectItem value="nikel">Nikel</SelectItem>
                  <SelectItem value="tembaga">Tembaga</SelectItem>
                  <SelectItem value="bijih_besi">Bijih Besi</SelectItem>
                  <SelectItem value="timah">Timah</SelectItem>
                  <SelectItem value="bauksit">Bauksit</SelectItem>
                  <SelectItem value="mangan">Mangan</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status Izin</label>
              <Select value={izinTambang} onValueChange={setIzinTambang}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="ilegal">Ilegal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit">Terapkan Filter</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Mencari..." : "Cari"}
      </Button>
    </form>
  );
}
