import type { LobbyPlayer } from "../types/index";

export class Lobby {
  id: string;
  hostId: string;
  maxPlayers: number;
  players: LobbyPlayer[];
  started: boolean;

  constructor(
    id: string,
    hostId: string,
    maxPlayers: number,
    lobbyPlayers: LobbyPlayer[]
  ) {
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
    this.started = false;
  }
}
