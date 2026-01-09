import { create } from "zustand";
import { LobbyPlayer, Player, View } from "../server/types/index";
import { socket } from "@/socket/socket";
import { Game } from "../server/lib/Game";
import { DEFAULT_PORTRAIT } from "../constants";

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
  playerOrder: "random" | "manual";

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
  setPlayerOrder: (playerOrder: LobbyState["playerOrder"]) => void;
  handleManualOrder: (players: LobbyPlayer[]) => void;

  handleGameSubmit: () => void;
  handleSelectPortrait: (src: string) => void;
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
  playerOrder: "random",

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
  setPlayerOrder: (playerOrder) => set({ playerOrder }),
  handleManualOrder: (players) => set({ players }),

  handleSelectPortrait: (src) => {
    set({ selectedPortrait: src, isModalOpen: false });
  },

  handleGameSubmit: () => {
    const {
      name,
      mode,
      maxPlayers,
      localRoomId,
      roomId,
      selectedPortrait,
      playerOrder,
      setRoomId,
      setLobbyPlayers,
      setPlayerOrder,
      setView,
    } = get();

    if (!name) return alert("Please enter your name");

    if (mode === "create") {
      if (!maxPlayers || maxPlayers < 5 || maxPlayers > 10) {
        return alert("Choose between 5 and 10 players");
      }
      socket.emit(
        "create_game",
        { name, maxPlayers, portrait: selectedPortrait, playerOrder },
        ({ roomId, players }: { roomId: string; players: Player[] }) => {
          setRoomId(roomId);
          setLobbyPlayers(players);
          setPlayerOrder(playerOrder);
          console.log("HERE");
          setView("lobby");
        }
      );
    } else {
      const rid = roomId || localRoomId;
      if (!rid) return alert("Enter room id");
      socket.emit(
        "join_game",
        { name, roomId: rid, portrait: selectedPortrait },
        ({ roomId, players }: { roomId: string; players: Player[] }) => {
          setRoomId(roomId);
          setLobbyPlayers(players);
          setView("lobby");
        }
      );
    }
  },
}));
