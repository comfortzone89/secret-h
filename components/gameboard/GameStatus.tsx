import { Player } from "@/server/lib/game/GameTypes";
import { useGameStore } from "../../store/game";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const GameStatus: React.FC = () => {
  const { gameInstance, trackerView, getPlayers } = useGameStore();

  const [hideGameStatus, setHideGameStatus] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("trackingHelperView") === "1";
  });

  useEffect(() => {
    const value = localStorage.getItem("trackingHelperView") === "1";
    setHideGameStatus(value);
  }, [trackerView]);

  if (hideGameStatus) {
    return null;
  }

  const players = getPlayers();
  const liberalPolicies = gameInstance?.liberalPolicies;
  const fascistPolicies = gameInstance?.fascistPolicies;

  function countRoles(players: Player[]) {
    return players.reduce(
      (acc, player) => {
        switch (player.role) {
          case "liberal":
            acc.liberal++;
            break;
          case "fascist":
            acc.fascist++;
            break;
          case "hitler":
            acc.hitler++;
            break;
        }
        return acc;
      },
      { liberal: 0, fascist: 0, hitler: 0 },
    );
  }

  const roles = countRoles(players!);

  return (
    <div className="flex flex-col gap-1 bg-stone-900 rounded-lg p-2">
      <span className="text-xs md:text-base">Players:</span>
      <div className="flex gap-2">
        <div className="flex items-center">
          <Image
            src="/images/player-icon-liberal.png"
            alt="Liberal"
            width={30}
            height={30}
            className="w-[7vmin] md:w-[5vmin]"
          />
          <span>{roles.liberal}</span>
        </div>
        <div className="flex items-center">
          <Image
            src="/images/player-icon-fascist.png"
            alt="Fascist"
            width={30}
            height={30}
            className="w-[7vmin] md:w-[5vmin]"
          />
          <span>{roles.fascist}</span>
        </div>
        <div className="flex items-center">
          <Image
            src="/images/player-icon-hitler.png"
            alt="Hitler"
            width={30}
            height={30}
            className="w-[7vmin] md:w-[5vmin]"
          />
          <span>{roles.hitler}</span>
        </div>
      </div>
      <span className="text-xs md:text-base">Unenacted Policies:</span>
      <div className="flex gap-2">
        <div className="flex items-center">
          <Image
            src="/images/player-icon-liberal.png"
            alt="Liberal"
            width={30}
            height={30}
            className="w-[7vmin] md:w-[5vmin]"
          />
          <span>{6 - liberalPolicies!}</span>
        </div>
        <div className="flex items-center">
          <Image
            src="/images/player-icon-fascist.png"
            alt="Fascist"
            width={30}
            height={30}
            className="w-[7vmin] md:w-[5vmin]"
          />
          <span>{11 - fascistPolicies!}</span>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
