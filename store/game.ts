import { create } from "zustand";
import { socket } from "@/lib/socket";
import { Player, View, Vote } from "@/types";
import { Game } from "@/lib/Game.ts";
import { DEFAULT_PORTRAIT } from "@/constants";

interface GameState {
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

  // lobby setters
  setName: (name: string) => void;
  setSelectedPortrait: (portrait: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setLocalRoomId: (id: string) => void;

  // lobby handlers
  handleGameSubmit: () => void;
  handleSelectPortrait: (src: string) => void;

  // game setters
  setView: (view: GameState["view"]) => void;
  setMode: (mode: GameState["mode"]) => void;
  setRoomId: (id: string | null) => void;
  setPlayerId: (id: string) => void;
  setPlayers: (players: Player[]) => void;
  setGameInstance: (game: Game | null) => void;
  setMaxPlayers: (count: number) => void;
  setMe: (me: Player) => void;
  setPlayerIndex: (playerIndex: number) => void;

  // game socket handlers
  handleRoleModalClose: () => void;
  handleNominateChancellorModalClose: (chancellorId: number) => void;
  handleVoteModalClose: (vote: Vote) => void;
  handlePresidentHandModalClose: (discard: number) => void;
  handleChancellorHandModalClose: (enact: number) => void;
  handleElectionTrackerModalClose: () => void;
  handlePolicyEnactedModalClose: () => void;
  handlePeekModalClose: () => void;
  handleInvestigateModalClose: (playerIndex: number) => void;
  handleInvestigateResultModalClose: () => void;
  handleSpecialElectionModalClose: (newPresidentIndex: number) => void;
  handleExecutionModalClose: (playerIndex: number) => void;
  handleExecutionResultModalClose: () => void;
  handleVetoUnlockedModalClose: () => void;
  handleVeto: () => void;
  handleProposeVetoModalClose: (oblige: boolean) => void;
  handleGameOverModalClose: (action: string) => void;
  handleEndTerm: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
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

  // lobby setters
  setName: (name) => set({ name }),
  setSelectedPortrait: (portrait) => set({ selectedPortrait: portrait }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setLocalRoomId: (id) => set({ localRoomId: id }),

  // game setters
  setView: (view) => set({ view }),
  setMode: (mode) => set({ mode }),
  setRoomId: (roomId) => set({ roomId }),
  setPlayerId: (playerId) => set({ playerId }),
  setPlayers: (players) => set({ players }),
  setGameInstance: (gameInstance) => set({ gameInstance }),
  setMaxPlayers: (count) => set({ maxPlayers: count }),
  setMe: (me) => set({ me }),
  setPlayerIndex: (playerIndex) => set({ playerIndex }),

  // game socket handlers
  handleRoleModalClose: () => {
    const { gameInstance, playerIndex, playerId } = get();
    socket.emit("handleRoleModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      playerId,
    });
  },

  handleNominateChancellorModalClose: (chancellorId) => {
    const { gameInstance } = get();
    socket.emit("handleNominateChancellorModalClose", {
      roomId: gameInstance?.id,
      chancellorId,
    });
  },

  handleVoteModalClose: (vote) => {
    const { gameInstance, playerIndex, playerId } = get();
    socket.emit("handleVoteModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      playerId,
      vote,
    });
  },

  handlePresidentHandModalClose: (discard) => {
    const { gameInstance, playerIndex } = get();
    socket.emit("handlePresidentHandModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      discard,
    });
  },

  handleChancellorHandModalClose: (enact) => {
    const { gameInstance, playerIndex } = get();
    socket.emit("handleChancellorHandModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      enact,
    });
  },

  handleElectionTrackerModalClose: () => {
    const { gameInstance, playerIndex, playerId } = get();
    socket.emit("handleElectionTrackerModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      playerId,
    });
  },

  handlePolicyEnactedModalClose: () => {
    const { gameInstance, playerIndex, playerId } = get();
    socket.emit("handlePolicyEnactedModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      playerId,
    });
  },

  handlePeekModalClose: () => {
    const { gameInstance, playerIndex } = get();
    socket.emit("handlePeekModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
    });
  },

  handleInvestigateModalClose: (playerIndex) => {
    const { gameInstance } = get();
    socket.emit("handleInvestigateModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
    });
  },

  handleInvestigateResultModalClose: () => {
    const { gameInstance } = get();
    socket.emit("handleInvestigateResultModalClose", {
      roomId: gameInstance?.id,
    });
  },

  handleSpecialElectionModalClose: (newPresidentIndex) => {
    const { gameInstance } = get();
    socket.emit("handleSpecialElectionModalClose", {
      roomId: gameInstance?.id,
      newPresidentIndex,
    });
  },

  handleExecutionModalClose: (playerIndex) => {
    const { gameInstance } = get();
    socket.emit("handleExecutionModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
    });
  },

  handleExecutionResultModalClose: () => {
    const { gameInstance, playerIndex } = get();
    socket.emit("handleExecutionResultModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
    });
  },

  handleVetoUnlockedModalClose: () => {
    const { gameInstance, playerIndex } = get();
    socket.emit("handleVetoUnlockedModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
    });
  },

  handleVeto: () => {
    const { gameInstance, playerIndex } = get();
    socket.emit("handleVeto", { roomId: gameInstance?.id, playerIndex });
  },

  handleProposeVetoModalClose: (oblige) => {
    const { gameInstance, playerIndex } = get();
    socket.emit("handleProposeVetoModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      oblige,
    });
  },

  handleGameOverModalClose: (action) => {
    const { gameInstance, playerId } = get();
    socket.emit("gameEnded", { roomId: gameInstance?.id, playerId, action });
  },

  handleEndTerm: () => {
    const { gameInstance } = get();
    socket.emit("handleEndTerm", { roomId: gameInstance?.id });
  },

  // lobby handlers
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
      setRoomId,
      setPlayers,
      setView,
    } = get();

    if (!name) return alert("Please enter your name");

    if (mode === "create") {
      if (!maxPlayers || maxPlayers < 5 || maxPlayers > 10) {
        return alert("Choose between 5 and 10 players");
      }
      socket.emit(
        "create_game",
        { name, maxPlayers, portrait: selectedPortrait },
        ({ roomId, players }: { roomId: string; players: Player[] }) => {
          setRoomId(roomId);
          setPlayers(players);
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
          setPlayers(players);
          setView("lobby");
        }
      );
    }
  },
}));
