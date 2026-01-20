"use client";

import { useEffect } from "react";
import { socket } from "../../socket/socket";
import { useGameStore } from "../../store/game";
import Button from "../../components/templates/Button";
import { Copy } from "lucide-react";
import PlayerContainer from "../templates/PlayerContainer";
import { Player } from "../../server/types";

export default function LobbyView() {
  const { roomId, players, maxPlayers, setPlayers, setView } = useGameStore();

  // Copy join URL
  const handleCopy = async () => {
    if (!roomId) return;
    if (typeof window === "undefined") return;

    const url = `${window.location.origin}/?roomId=${roomId}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for mobile Safari and older browsers
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed"; // prevent scrolling
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const handleLobbyUpdate = (data: {
      players: Player[];
      maxPlayers: number;
      roomId: string;
    }) => {
      const filteredPlayers = data.players.filter(
        (player) => player?.disconnected === false
      );
      setPlayers(filteredPlayers);
    };

    const handleGameStart = (data: { players: Player[] }) => {
      const filteredPlayers = data.players.filter(
        (player) => player?.disconnected === false
      );
      setPlayers(filteredPlayers);
      setView("game");
    };

    const handleRoomClosed = (msg: { message: string }) => {
      alert(msg.message);
      setView("home");
    };

    const handleManualOrder = () => {
      setView("manualOrder");
    };

    const handlePlayerDisconnected = (data: { players: Player[] }) => {
      const filteredPlayers = data.players.filter(
        (player) => player?.disconnected === false
      );
      setPlayers(filteredPlayers);
    };

    socket.on("lobby_update", handleLobbyUpdate);
    socket.on("game_start", handleGameStart);
    socket.on("manual_order", handleManualOrder);
    socket.on("room_closed", handleRoomClosed);
    socket.on("player_disconnected", handlePlayerDisconnected);

    return () => {
      socket.off("lobby_update", handleLobbyUpdate);
      socket.off("game_start", handleGameStart);
      socket.off("manual_order", handleManualOrder);
      socket.off("room_closed", handleRoomClosed);
      socket.off("player_disconnected");
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
        className={`rounded-xl p-4 ${
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
