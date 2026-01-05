"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useGameStore } from "@/store/game";
import Button from "@/components/templates/Button";
import { Copy } from "lucide-react";
import PlayerContainer from "../templates/PlayerContainer";
import { Player } from "@/types";
import { useLobbyStore } from "@/store/lobby";

export default function LobbyView() {
  const { roomId, players, setPlayers, setView } = useGameStore();
  const { maxPlayers } = useLobbyStore();

  // Copy join URL
  const handleCopy = () => {
    if (!roomId) return;
    const url = `${process.env.NEXT_PUBLIC_HOSTNAME}/?roomId=${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      // You could replace with a toast notification
      //   alert("Copied to clipboard!");
    });
  };

  useEffect(() => {
    if (!roomId) return;

    const handleLobbyUpdate = (data: {
      players: Player[];
      maxPlayers: number;
      roomId: string;
    }) => {
      setPlayers(data.players);
    };

    const handleGameStart = (data: { players: Player[] }) => {
      setPlayers(data.players);
      setView("game");
    };

    const handleRoomClosed = (msg: { message: string }) => {
      alert(msg.message);
      setView("home");
    };

    socket.on("lobby_update", handleLobbyUpdate);
    socket.on("game_start", handleGameStart);
    socket.on("room_closed", handleRoomClosed);

    return () => {
      socket.off("lobby_update", handleLobbyUpdate);
      socket.off("game_start", handleGameStart);
      socket.off("room_closed", handleRoomClosed);
    };
  }, [roomId, setPlayers, setView]);

  if (!roomId) return <p>No room found.</p>;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-xl font-bold">Lobby: {roomId}</h1>

      <p className="mb-2">Share this link with people you want to join:</p>
      <Button className="flex gap-2" onClick={handleCopy}>
        Click to copy URL <Copy />
      </Button>

      <p>Waiting for other players...</p>

      <div
        className={`rounded-2xl p-4 ${
          players.length > 0 ? "" : "invisible opacity-0"
        }`}
      >
        <p className="text-center mb-2">
          Players: {players.length} / {maxPlayers}
        </p>

        <ul className="flex gap-2 justify-center flex-wrap">
          {players.map((p) => {
            return <PlayerContainer key={p.id} player={p} />;
          })}
        </ul>
      </div>
    </div>
  );
}
