"use client";

import { createContext, useState, useContext, type ReactNode } from "react";

import { Mine } from "@/types/mine";

type MineContextType = {
  selectedMine: Mine | null;
  setSelectedMine: (mine: Mine | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const MineContext = createContext<MineContextType | undefined>(undefined);

export function MineProvider({ children }: { children: ReactNode }) {
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return <MineContext.Provider value={{ selectedMine, setSelectedMine, isLoading, setIsLoading }}>{children}</MineContext.Provider>;
}

export function useMine<T>() {
  const context = useContext(MineContext);
  if (context === undefined) {
    throw new Error("useMine must be used within a MineProvider");
  }
  return context;
}
