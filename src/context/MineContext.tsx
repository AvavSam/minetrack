"use client";

import React, { createContext, useState, useContext } from "react";
import { Mine } from "@/types/mine";

interface MineContextType {
  mines: Mine[];
  setMines: React.Dispatch<React.SetStateAction<Mine[]>>;
  selectedMine: Mine | null;
  setSelectedMine: React.Dispatch<React.SetStateAction<Mine | null>>;
}

const MineContext = createContext<MineContextType | undefined>(undefined);

export function MineProvider({ children, initialMines }: { children: React.ReactNode; initialMines?: Mine[] }) {
  const [mines, setMines] = useState<Mine[]>(initialMines || []);
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);

  return <MineContext.Provider value={{ mines, setMines, selectedMine, setSelectedMine }}>{children}</MineContext.Provider>;
}

export function useMine() {
  const context = useContext(MineContext);
  if (context === undefined) {
    throw new Error("useMine must be used within a MineProvider");
  }
  return context;
}
