import { create } from "zustand";
import { Game } from "@/lib/Game";

interface GameRuntimeState {
  gameInstance: Game | null;
  setGameInstance: (game: Game | null) => void;
}

export const useGameRuntimeStore = create<GameRuntimeState>((set) => ({
  gameInstance: null,
  setGameInstance: (gameInstance) => set({ gameInstance }),
}));
