import { create } from "zustand";
import { socket } from "../socket/socket";
import { Player, View, Vote } from "../server/types/index";
import { Game } from "../server/lib/Game";
import { DEFAULT_PORTRAIT } from "../constants";

interface GameState {
  // lobby
  roomName: string;
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

  initializeGame: (game: Game) => void;

  // lobby setters
  setRoomName: (roomName: string) => void;
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
  setMe: (player: Player) => void;
  getMe: () => Player | null;
  getPlayerIndex: () => number | null;
  setPlayerIndex: (playerIndex: number) => void;
  setPlayerOrder: (playerOrder: GameState["playerOrder"]) => void;

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
  handleShowAffiliationModal: (show: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // lobby
  roomName: "",
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

  initializeGame: (game: Game) =>
    set({
      gameInstance: game,
    }),

  // lobby setters
  setRoomName: (roomName) => set({ roomName }),
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
  setPlayerOrder: (playerOrder) => set({ playerOrder }),
  setMe: (player) =>
    set((state) => {
      if (state.me?.id === player.id) return state;
      return { me: player };
    }),
  getMe: () => {
    const { gameInstance, playerId } = get();
    if (!gameInstance || playerId === null) return null;
    return gameInstance.players.find((p) => p.id === playerId) ?? null;
  },
  getPlayerIndex: () => {
    const { gameInstance, playerId } = get();
    if (!gameInstance || !playerId) return null;
    return gameInstance.players.findIndex((p) => p.id === playerId) ?? null;
  },
  setPlayerIndex: (playerIndex) => set({ playerIndex }),

  // game socket handlers
  handleRoleModalClose: () => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    const playerId = me?.id;
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
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    const playerId = me?.id;
    socket.emit("handleVoteModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      playerId,
      vote,
    });
  },

  handlePresidentHandModalClose: (discard) => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    socket.emit("handlePresidentHandModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      discard,
    });
  },

  handleChancellorHandModalClose: (enact) => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    socket.emit("handleChancellorHandModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      enact,
    });
  },

  handleElectionTrackerModalClose: () => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    const playerId = me?.id;
    socket.emit("handleElectionTrackerModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      playerId,
    });
  },

  handlePolicyEnactedModalClose: () => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    const playerId = me?.id;
    socket.emit("handlePolicyEnactedModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      playerId,
    });
  },

  handlePeekModalClose: () => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
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
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    socket.emit("handleInvestigateResultModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
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
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    socket.emit("handleExecutionResultModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
    });
  },

  handleVetoUnlockedModalClose: () => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    socket.emit("handleVetoUnlockedModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
    });
  },

  handleVeto: () => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    socket.emit("handleVeto", { roomId: gameInstance?.id, playerIndex });
  },

  handleProposeVetoModalClose: (oblige) => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerIndex = me?.index;
    socket.emit("handleProposeVetoModalClose", {
      roomId: gameInstance?.id,
      playerIndex,
      oblige,
    });
  },

  handleGameOverModalClose: (action) => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerId = me?.id;
    socket.emit("gameEnded", { roomId: gameInstance?.id, playerId, action });
  },

  handleEndTerm: () => {
    const { gameInstance } = get();
    socket.emit("handleEndTerm", { roomId: gameInstance?.id });
  },

  handleShowAffiliationModal: (show) => {
    const { gameInstance, getMe } = get();
    const me = getMe();
    const playerId = me?.id;
    const playerIndex = me?.index;
    socket.emit("handleShowAffiliationModal", {
      roomId: gameInstance?.id,
      playerId,
      playerIndex,
      show,
    });
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
      playerOrder,
      roomName,
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
        { name, maxPlayers, portrait: selectedPortrait, playerOrder, roomName },
        ({
          roomId,
          players,
          error,
        }: {
          roomId: string;
          players: Player[];
          error?: string;
        }) => {
          if (error) {
            return alert(error);
          }
          sessionStorage.setItem("joinedRoomId", roomId);
          sessionStorage.setItem("playerId", socket.id!);

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
        ({
          roomId,
          players,
          error,
        }: {
          roomId: string;
          players: Player[];
          error?: string;
        }) => {
          if (error) {
            return alert(error);
          }
          sessionStorage.setItem("joinedRoomId", roomId);
          sessionStorage.setItem("playerId", socket.id!);

          setRoomId(roomId);
          setPlayers(players);
          setView("lobby");
        }
      );
    }
  },
}));
