"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../../socket/socket";
import { useGameStore } from "../../store/game";
import Button from "../../components/templates/Button";
import { Copy } from "lucide-react";
import PlayerContainer from "../templates/PlayerContainer";
import { Game } from "@/server/lib/Game";

export default function LobbyView() {
  const {
    playerOrder,
    roomId,
    maxPlayers,
    setGameInstance,
    setView,
    getPlayers,
  } = useGameStore();

  const players = getPlayers();
  const connectedPlayers = players?.filter((p) => p.connected);

  const [copied, setCopied] = useState<boolean>(false);

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
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const handleLobbyUpdate = (data: { game: Game }) => {
      setGameInstance(data.game);
    };

    const handleGameStart = (data: { game: Game }) => {
      setGameInstance(data.game);
      setView("game");
    };

    const handleRoomClosed = (msg: { message: string }) => {
      alert(msg.message);
      setView("home");
    };

    const handleManualOrder = (data: { game: Game }) => {
      setGameInstance(data.game);
      setView("manualOrder");
    };

    const handlePlayerDisconnected = (data: { game: Game }) => {
      setGameInstance(data.game);
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
  }, [roomId, setView, setGameInstance]);

  if (!roomId) return <p>No room found.</p>;
  if (!players) return <p>Loading players...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-xl font-bold">Lobby: {roomId}</h1>

      <div className="relative text-center flex flex-col items-center">
        <p className="mb-2">Share this link with people you want to join:</p>
        <Button className="flex gap-2" onClick={handleCopy}>
          Click to copy URL <Copy />
        </Button>
        <AnimatePresence>
          {copied && (
            <motion.div
              key="copied"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute text-white bg-black/90 rounded-2xl p-3 uppercase"
            >
              Copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {connectedPlayers?.length === maxPlayers && playerOrder === "manual" ? (
        <p>Waiting for host to manually sort players and start the game...</p>
      ) : (
        <p>Waiting for other players...</p>
      )}

      <div
        className={`rounded-xl p-4 ${
          players!.length > 0 ? "" : "invisible opacity-0"
        }`}
      >
        <p className="text-center mb-2">
          Players: {connectedPlayers!.length} / {maxPlayers}
        </p>

        <ul className="flex gap-2 justify-center flex-wrap">
          {players!.map((p) => {
            if (p.connected) {
              return <PlayerContainer key={p.id} player={p} />;
            }
          })}
        </ul>
      </div>
    </div>
  );
}
