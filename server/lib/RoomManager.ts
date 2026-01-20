import { Room } from "./Room.js";
import { LobbyPlayer } from "../types/index.js";

export class RoomManager {
  private rooms = new Map<string, Room>();

  get(roomId: string) {
    return this.rooms.get(roomId);
  }

  exists(roomId: string) {
    return this.rooms.has(roomId);
  }

  createRoom(data: {
    id: string;
    hostId: string;
    maxPlayers: number;
    playerOrder: "random" | "manual";
    players: LobbyPlayer[];
  }) {
    if (this.rooms.has(data.id)) {
      throw new Error("Room already exists");
    }

    const room = new Room(data);
    this.rooms.set(room.id, room);
    return room;
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
  }
}
