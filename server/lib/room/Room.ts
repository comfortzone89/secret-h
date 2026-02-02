import { Game } from "../game/Game.js";
import { PlayAgainst, PlayerOrder } from "../game/GameTypes.js";

export class Room {
  readonly id: string;
  hostId: string;
  maxPlayers: number;
  playAgainst: PlayAgainst;
  playerOrder: PlayerOrder;
  game: Game;
  deleteTimeout: NodeJS.Timeout | null = null;

  constructor({
    id,
    hostId,
    maxPlayers,
    playAgainst,
    playerOrder,
  }: {
    id: string;
    hostId: string;
    maxPlayers: number;
    playAgainst: PlayAgainst;
    playerOrder: PlayerOrder;
  }) {
    this.id = id;
    this.hostId = hostId;
    this.maxPlayers = maxPlayers;
    this.playAgainst = playAgainst;
    this.playerOrder = playerOrder;

    // Game exists immediately
    this.game = new Game(id, hostId, playAgainst);
  }

  /* ---------- derived ---------- */

  get connectedPlayers() {
    return this.game.players.filter((p) => p.connected);
  }

  get isFull() {
    return this.connectedPlayers.length >= this.maxPlayers;
  }

  get isEmpty() {
    return this.connectedPlayers.length === 0;
  }

  /* ---------- deletion ---------- */

  scheduleDeletion(ms: number, onDelete: () => void) {
    if (this.deleteTimeout) return;
    this.deleteTimeout = setTimeout(onDelete, ms);
  }

  cancelDeletion() {
    if (!this.deleteTimeout) return;
    clearTimeout(this.deleteTimeout);
    this.deleteTimeout = null;
    console.log(`Cancelled deletion of room "${this.id}"`);
  }
}
