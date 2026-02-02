import { PlayAgainst, PlayerOrder } from "../game/GameTypes.js";
import { Room } from "./Room.js";

export class RoomManager {
  private rooms = new Map<string, Room>();

  get(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  exists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  createRoom(data: {
    id: string;
    hostId: string;
    maxPlayers: number;
    playAgainst: PlayAgainst;
    playerOrder: PlayerOrder;
  }): Room {
    if (this.rooms.has(data.id)) {
      throw new Error(`Room "${data.id}" already exists`);
    }

    const room = new Room({
      id: data.id,
      hostId: data.hostId,
      playAgainst: data.playAgainst,
      maxPlayers: data.maxPlayers,
      playerOrder: data.playerOrder,
    });

    this.rooms.set(room.id, room);
    return room;
  }

  deleteRoom(roomId: string): void {
    console.log(`Deleting room "${roomId}"`);
    this.rooms.delete(roomId);
  }
}
