import { Game } from "../lib/Game.js";

export type Party = "liberal" | "fascist";
export type Role = "liberal" | "fascist" | "hitler";
export type Policy = Party;
export type Modal =
  | "role"
  | "nominate_chancellor"
  | "voting"
  | "president_hand"
  | "chancellor_hand"
  | "election_tracker"
  | "policy_enacted"
  | "investigate"
  | "investigateResult"
  | "peek"
  | "specialElection"
  | "execution"
  | "executionResult"
  | "vetoUnlock"
  | "vetoProposed"
  | "gameOver"
  | null;
export type Vote = "yes" | "no" | null;
export type View =
  | "home"
  | "createJoin"
  | "lobby"
  | "game"
  | "manualOrder"
  | "roomNotFound"
  | "disconnected";

export interface StatusBanner {
  text: string;
  loading: boolean;
}

export interface LobbyPlayer {
  id: string | null;
  permaId: string; // persistent identifier across reconnects
  name: string;
  connected: boolean;
  portrait: string; // URL or path to portrait image
  modal?: string | null;
  modalConfirm?: boolean;
}

export interface Player {
  id: string | null;
  permaId: string; // persistent identifier across reconnects
  name: string;
  portrait: string; // URL or path to portrait image
  connected: boolean;
  investigated?: boolean;
  index?: number;
  party?: Party | undefined; // actual party membership (revealed by investigations)
  role?: Role | undefined; // role (hitler/fascist/liberal) - NOT revealed by investigate
  alive?: boolean | undefined;
  vote?: Vote;
  modal?: string | null;
  modalConfirm?: boolean;
  phase?: GamePhase;
  statusBanner?: StatusBanner;
  endTerm?: boolean;
}

export type PlayerOrder = "random" | "manual";

export interface GameRoom {
  id: string;
  hostId: string;
  maxPlayers: number;
  players: Player[] | [];
  started: boolean;
  game?: Game;
}

/** Executive power label used in UI/logic */
export type ExecutivePowerName =
  | "investigate" // investigate party membership
  | "peek" // peek next 3 policies
  | "specialElection" // choose next presidential candidate
  | "execution" // execute a player
  | "vetoUnlock" // marks veto unlocked
  | null;

export type WinReason = "policy" | "hitlerExecuted" | "hitlerElected" | null;

/** Info about a milestone slot (UI-friendly) */
export interface MilestoneInfo {
  slot: number; // fascist slot 1..5
  power: ExecutivePowerName;
  unlocksVeto: boolean;
}

/** Game phases (granular, includes legislative sub-phases) */
export type GamePhase =
  | "game_start"
  | "nomination"
  | "voting"
  | "vote_passed"
  | "vote_failed"
  | "legislative_session"
  | "presidential_power"
  | "game_over"
  | null;

export interface LobbyUpdatePayload {
  game: Game;
  maxPlayers: number;
  roomId: string;
  playerOrder: PlayerOrder;
}

export interface GameStartPayload {
  roomId: string;
  players: Player[];
  hostId: string;
  game: Game;
}

export type ReconnectResponse =
  | { success: true; room: GameRoom; game?: Game; maxPlayers: number }
  | { error: string };

export type AppPhase =
  | "boot" // hydration + socket not ready
  | "resolving" // checking room / reconnecting
  | "ready" // safe to render UI
  | "reconnecting";

export interface CheckRoomResponse {
  exists: boolean;
}
