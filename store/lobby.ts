import { create } from "zustand";
import { socket } from "@/lib/socket";
import { LobbyPlayer, Player, View, Vote } from "@/types";
import { Game } from "@/lib/Game.ts";
import { DEFAULT_PORTRAIT } from "@/constants";

interface LobbyState {
  // lobby
  name: string;
  selectedPortrait: string;
  isModalOpen: boolean;
  localRoomId: string;

  // game
  view: View;
  mode: "create" | "join";
  roomId: string | null;
  playerId: string | null;
  playerIndex: number | null;
  players: Player[];
  gameInstance: Game | null;
  maxPlayers: number | null;
  me: Player | null;
  order: "random" | "manual";

  // lobby setters
  setName: (name: string) => void;
  setSelectedPortrait: (portrait: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setLocalRoomId: (id: string) => void;

  // game setters
  setView: (view: LobbyState["view"]) => void;
  setMode: (mode: LobbyState["mode"]) => void;
  setRoomId: (id: string | null) => void;
  setLobbyPlayerId: (id: string) => void;
  setLobbyPlayers: (players: Player[]) => void;
  setMaxLobbyPlayers: (count: number) => void;
  setPlayerOrder: (order: LobbyState["order"]) => void;
  handleManualOrder: (players: LobbyPlayer[]) => void;
}

export const useLobbyStore = create<LobbyState>((set, get) => ({
  // lobby
  name: "",
  selectedPortrait: DEFAULT_PORTRAIT,
  isModalOpen: false,
  localRoomId: "",

  // game
  view: "home",
  mode: "create",
  roomId: null,
  playerId: null,
  playerIndex: null,
  players: [],
  gameInstance: null,
  maxPlayers: null,
  me: null,
  order: "random",

  // lobby setters
  setName: (name) => set({ name }),
  setSelectedPortrait: (portrait) => set({ selectedPortrait: portrait }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setLocalRoomId: (id) => set({ localRoomId: id }),

  // game setters
  setView: (view) => set({ view }),
  setMode: (mode) => set({ mode }),
  setRoomId: (roomId) => set({ roomId }),
  setLobbyPlayerId: (playerId) => set({ playerId }),
  setLobbyPlayers: (players) => set({ players }),
  setMaxLobbyPlayers: (count) => set({ maxPlayers: count }),
  setPlayerOrder: (order) => set({ order }),
  handleManualOrder: (players) => set({ players }),
}));
