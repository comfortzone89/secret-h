import { Game } from "./Game.js";
import { PlayerOrder } from "../types/index.js";

export class Room {
  readonly id: string;
  hostId: string;
  maxPlayers: number;
  playerOrder: PlayerOrder;
  game: Game;
  deleteTimeout: NodeJS.Timeout | null = null;

  constructor({
    id,
    hostId,
    maxPlayers,
    playerOrder,
  }: {
    id: string;
    hostId: string;
    maxPlayers: number;
    playerOrder: PlayerOrder;
  }) {
    this.id = id;
    this.hostId = hostId;
    this.maxPlayers = maxPlayers;
    this.playerOrder = playerOrder;

    // Game exists immediately
    this.game = new Game(id, hostId);
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
