import type { Game } from "@/lib/Game";
import type { Player } from "./index";

/* ---------- CLIENT → SERVER ---------- */
export interface ClientToServerEvents {
  check_room: (
    data: { roomId: string },
    cb: (res: { exists: boolean }) => void
  ) => void;
  create_game: (
    data: { name: string; maxPlayers: number; portrait: string },
    cb: (res: { roomId: string; players: Player[] }) => void
  ) => void;
  join_game: (
    data: { name: string; roomId: string; portrait: string },
    cb: (res: { roomId: string; players: Player[] } | { error: string }) => void
  ) => void;

  startNewRound: (data: { roomId: string }) => void;
  handleEndTerm: (data: { roomId: string }) => void;
}

/* ---------- SERVER → CLIENT ---------- */
export interface ServerToClientEvents {
  lobby_update: (data: { players: Player[]; maxPlayers: number }) => void;
  room_closed: (data: { message: string }) => void;
  player_disconnected: (data: { playerId: string }) => void;

  role_assignment: (data: { role: string; party: string; vote: null }) => void;

  game_start: (data: {
    roomId: string;
    players: Player[];
    hostId: string;
    game: Game;
  }) => void;

  game_update: (game: Game, view?: string) => void;
}
