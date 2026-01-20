import { LobbyPlayer, Player } from "../types/index.js";
import { Game } from "./Game.js";

type PlayerOrder = "random" | "manual";

export class Room {
  readonly id: string;
  hostId: string;
  maxPlayers: number;
  players: Player[] = [];
  started = false;
  playerOrder: PlayerOrder;
  playerOrderFinished = false;
  game?: Game;
  deleteTimeout: NodeJS.Timeout | null = null;

  constructor({
    id,
    hostId,
    maxPlayers,
    playerOrder,
    players,
  }: {
    id: string;
    hostId: string;
    maxPlayers: number;
    playerOrder: PlayerOrder;
    players: LobbyPlayer[];
  }) {
    this.id = id;
    this.hostId = hostId;
    this.maxPlayers = maxPlayers;
    this.playerOrder = playerOrder;
    this.players = players;
  }

  /* ---------- derived state ---------- */

  get connectedPlayers() {
    return this.players.filter((p) => p.disconnected !== true);
  }

  get isFull() {
    return this.connectedPlayers.length >= this.maxPlayers;
  }

  get isEmpty() {
    return this.connectedPlayers.length === 0;
  }

  /* ---------- lifecycle ---------- */

  addPlayer(player: LobbyPlayer) {
    this.players.push(player);
    this.cancelDeletion();
  }

  markDisconnected(socketId: string) {
    const player = this.players.find((p) => p.id === socketId);
    if (!player) return;
    player.disconnected = true;
  }

  reconnectPlayer(permaId: string, socketId: string) {
    const player = this.players.find((p) => p.permaId === permaId);
    if (!player) return null;

    player.id = socketId;
    player.disconnected = false;
    this.cancelDeletion();
    return player;
  }

  /* ---------- deletion ---------- */

  scheduleDeletion(ms: number, onDelete: () => void) {
    if (this.deleteTimeout) return;

    this.deleteTimeout = setTimeout(() => {
      onDelete();
    }, ms);
  }

  cancelDeletion() {
    if (!this.deleteTimeout) return;
    clearTimeout(this.deleteTimeout);
    this.deleteTimeout = null;
  }

  /* ---------- game ---------- */

  startGame(playersId?: string[]) {
    this.started = true;

    const activePlayers = this.connectedPlayers.map((p) => ({
      id: p.id,
      permaId: p.permaId,
      name: p.name,
      portrait: p.portrait,
      vote: null,
      disconnected: false,
    }));

    this.game = new Game(this.id, this.hostId, activePlayers, playersId);

    return this.game;
  }
}
