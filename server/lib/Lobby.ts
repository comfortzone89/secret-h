import type { LobbyPlayer } from "../types/index.js";

export class Lobby {
  id: string;
  hostId: string;
  maxPlayers: number;
  players: LobbyPlayer[];
  started: boolean;
  playerOrder: string;
  playerOrderFinished: boolean;

  constructor(params: {
    id: string;
    hostId: string;
    maxPlayers: number;
    lobbyPlayers: LobbyPlayer[];
    started?: boolean;
    playerOrder: string;
  }) {
    const {
      id,
      hostId,
      maxPlayers,
      lobbyPlayers,
      started = false,
      playerOrder,
    } = params;

    this.id = id;
    this.hostId = hostId;
    this.maxPlayers = maxPlayers;
    this.players = lobbyPlayers.map((p) => ({
      id: p.id,
      permaId: p.permaId,
      name: p.name,
      portrait: p.portrait,
      modal: null,
      modalConfirm: false,
    }));
    this.started = started;
    this.playerOrder = playerOrder;
    this.playerOrderFinished = false;
  }
}
