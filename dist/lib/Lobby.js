export class Lobby {
    id;
    hostId;
    maxPlayers;
    players;
    started;
    constructor(id, hostId, maxPlayers, lobbyPlayers) {
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
