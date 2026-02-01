"use client";

import { useState } from "react";
import { useGameStore } from "../../store/game";
import PlayerContainer from "../templates/PlayerContainer";
import { clsx } from "clsx";
import Button from "../templates/Button";
import { socket } from "@/socket/socket";

export default function ManualOrder() {
  const { roomId, maxPlayers, getPlayers } = useGameStore();
  const players = getPlayers();

  const [playerOrderArray, setPlayerOrderArray] = useState<string[]>([]);

  const handlePlayerOrder = (id: string) => {
    setPlayerOrderArray((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleResetOrder = () => {
    setPlayerOrderArray([]);
  };

  const handleStartManual = (playersId: string[]) => {
    socket.emit("start_manual_game", {
      roomId,
      playersId,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-xl font-bold">Lobby: {roomId}</h1>

      <div
        className={clsx(
          "rounded-xl p-4",
          players?.length === 0 && "invisible opacity-0"
        )}
      >
        <p className="text-center mb-2">
          Players: {players?.length} / {maxPlayers}
        </p>

        <p className="text-center mb-4">
          Please select the order of the players.
        </p>

        <ul className="flex gap-2 justify-center flex-wrap mb-2">
          {players?.map((p) => {
            const isPicked = playerOrderArray.includes(p.id!);
            const pickIndex = playerOrderArray.indexOf(p.id!) + 1;

            return (
              <li key={p.id} className="relative">
                <button
                  onClick={() => handlePlayerOrder(p.id!)}
                  disabled={isPicked}
                  className={clsx(
                    "rounded-xl overflow-hidden transition cursor-pointer",
                    isPicked &&
                      "opacity-60 cursor-not-allowed ring-2 ring-blue-500"
                  )}
                >
                  <PlayerContainer player={p} />
                </button>

                {isPicked && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {pickIndex}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex justify-between">
          {playerOrderArray.length > 0 && (
            <Button onClick={handleResetOrder}>Reset order</Button>
          )}
          {playerOrderArray.length === maxPlayers && (
            <Button onClick={() => handleStartManual(playerOrderArray)}>
              Start game
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
