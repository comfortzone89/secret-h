import { create } from "zustand";
import { socket } from "../socket/socket";
import {
  PlayAgainst,
  Player,
  PlayerOrder,
  View,
  Vote,
} from "../server/lib/game/GameTypes";
import { Game } from "../server/lib/game/Game";
import { DEFAULT_PORTRAIT } from "../constants";
import { toast, ToastOptions, Bounce } from "react-toastify";

const errorToastOptions: ToastOptions = {
  toastId: "error-toast",
  position: "bottom-left",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  theme: "colored",
  transition: Bounce,
};

interface GameState {
  // lobby
  name: string;
  selectedPortrait: string;
  isModalOpen: boolean;

  // game
  view: View;
  mode: "create" | "join";
  roomId: string | null;
  playerId: string | null;
  playerIndex: number | null;
  gameInstance: Game | null;
  maxPlayers: number;
  playerOrder: PlayerOrder;
  playAgainst: PlayAgainst;
  isMinimized: boolean;
  playersView: number; // Used as a number simply to re-render the Players.tsx component since I'm storing the information in localStorage
  trackerView: number; // Used as a number simply to re-render the Players.tsx component since I'm storing the information in localStorage
  showCarouselIcon: boolean;

  initializeGame: (game: Game) => void;

  // lobby setters
  setName: (name: string) => void;
  setSelectedPortrait: (portrait: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;

  // lobby handlers
  handleGameSubmit: () => void;
  handleSelectPortrait: (src: string) => void;

  // game setters
  setView: (view: GameState["view"]) => void;
  setMode: (mode: GameState["mode"]) => void;
  setRoomId: (id: string | null) => void;
  setPlayerId: (id: string) => void;
  getPlayers: () => Player[] | null;
  setGameInstance: (game: Game | null) => void;
  setMaxPlayers: (count: number) => void;
  getMe: () => Player | null;
  getPlayerIndex: () => number | null;
  setPlayerIndex: (playerIndex: number) => void;
  setPlayerOrder: (playerOrder: GameState["playerOrder"]) => void;
  setPlayAgainst: (playAgainst: GameState["playAgainst"]) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  setPlayersView: (playersView: number) => void;
  setTrackerView: (trackerView: number) => void;
  setShowCarouselIcon: (showCarouselIcon: boolean) => void;

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
  name: "",
  selectedPortrait: DEFAULT_PORTRAIT,
  isModalOpen: false,

  // game
  view: "home",
  mode: "create",
  roomId: null,
  playerId: null,
  playerIndex: null,
  gameInstance: null,
  maxPlayers: 5,
  playerOrder: "random",
  playAgainst: "humans",
  isMinimized: false,
  playersView: 0,
  trackerView: 0,
  showCarouselIcon: true,

  initializeGame: (game: Game) =>
    set({
      gameInstance: game,
    }),

  // lobby setters
  setName: (name) => set({ name }),
  setSelectedPortrait: (portrait) => set({ selectedPortrait: portrait }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  // game setters
  setView: (view) => set({ view }),
  setMode: (mode) => set({ mode }),
  setRoomId: (roomId) => set({ roomId }),
  setPlayerId: (playerId) => set({ playerId }),
  getPlayers: () => {
    const { gameInstance } = get();
    if (!gameInstance) return null;
    return gameInstance.players || null;
  },
  setGameInstance: (gameInstance) => set({ gameInstance }),
  setMaxPlayers: (count) => set({ maxPlayers: count }),
  setPlayerOrder: (playerOrder) => set({ playerOrder }),
  setPlayAgainst: (playAgainst) => set({ playAgainst }),
  setIsMinimized: (isMinimized) => set({ isMinimized }),
  setPlayersView: (playersView) => set({ playersView }),
  setTrackerView: (trackerView) => set({ trackerView }),
  setShowCarouselIcon: (showCarouselIcon) => set({ showCarouselIcon }),
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
      roomId,
      selectedPortrait,
      playAgainst,
      playerOrder,
      setRoomId,
      setView,
      setPlayerOrder,
    } = get();

    if (!name) return toast.error("Please enter your name", errorToastOptions);
    if (!roomId)
      return toast.error("Please enter room name", errorToastOptions);

    if (mode === "create") {
      if (!maxPlayers || maxPlayers < 5 || maxPlayers > 10) {
        return toast.error(
          "Choose between 5 and 10 players",
          errorToastOptions
        );
      }
      socket.emit(
        "create_game",
        {
          name,
          maxPlayers,
          portrait: selectedPortrait,
          playAgainst,
          playerOrder,
          roomId,
        },
        ({ roomId, error }: { roomId: string; error?: string }) => {
          if (error) {
            return toast.error(error, errorToastOptions);
          }
          sessionStorage.setItem("joinedRoomId", roomId);
          sessionStorage.setItem("playerId", socket.id!);

          setRoomId(roomId);
          setView("lobby");
        }
      );
    } else {
      const rid = roomId;
      if (!rid) return toast.error("Enter room id", errorToastOptions);
      socket.emit(
        "join_game",
        { name, roomId: rid, portrait: selectedPortrait },
        ({
          roomId,
          resPlayerOrder,
          error,
        }: {
          roomId: string;
          resPlayerOrder: PlayerOrder;
          error?: string;
        }) => {
          if (error) {
            return toast.error(error, errorToastOptions);
          }
          sessionStorage.setItem("joinedRoomId", roomId);
          sessionStorage.setItem("playerId", socket.id!);

          setPlayerOrder(resPlayerOrder);
          setRoomId(roomId);
          setView("lobby");
        }
      );
    }
  },
}));
