"use client";

import { useEffect, useState } from "react";
import { Game } from "@/lib/Game";
import { Player, View } from "@/types";
import { socket } from "@/lib/socket";
import { useGameStore } from "@/store/game";
import RoleModal from "../modals/RoleModal";
import Players from "../gameboard/Players";
import StatusBanner from "../gameboard/StatusBanner";
import DrawPile from "../gameboard/DrawPile";
import Button from "../templates/Button";
import GameStatus from "../gameboard/GameStatus";
import DiscardPile from "../gameboard/DiscardPile";
import LiberalBoard from "../gameboard/LiberalBoard";
import FascistBoard from "../gameboard/FascistBoard";
import PickChancellorModal from "../modals/nominateChancellerModal";
import PhaseBanner from "../gameboard/PhaseBanner";
import VotingModal from "../modals/VotingModal";
import PresidentHandModal from "../modals/PresidentHandModal";
import ChancellorHandModal from "../modals/ChancellorHandModal";
import PolicyEnactedModal from "../modals/PolicyEnactedModal";
import ElectionTrackerModal from "../modals/ElectionTrackerModal";
import PeekModal from "../modals/PeekModal";
import InvestigateModal from "../modals/InvestigateModal";
import InvestigateResultModal from "../modals/InvestigateResultModal";
import SpecialElectionModal from "../modals/SpecialElectionModal";
import ExecutionModal from "../modals/ExecutionModal";
import ExecutionResultModal from "../modals/ExecutionResultModal";
import VetoUnlockedModal from "../modals/VetoUnlockedModal";
import ProposeVetoModal from "../modals/ProposeVetoModal";
import GameOverModal from "../modals/GameOverModal";

export default function GameView() {
  const {
    playerId,
    gameInstance,
    me,
    setMe,
    setPlayerIndex,
    setGameInstance,
    setView,
    handleEndTerm,
  } = useGameStore();
  const [runOnce, setRunOnce] = useState<boolean>(false);
  const [playerDisconnected, setPlayerDisconnected] = useState<boolean>(false);

  console.log("PLAYER ID:", playerId);
  console.log("GAME INSTANCE:", gameInstance);
  console.log("ME:", me);

  // Listen for server game updates
  useEffect(() => {
    if (!gameInstance || !playerId) return;

    const permaId = sessionStorage.getItem("playerId");

    if (!runOnce) {
      const currentPlayer =
        gameInstance.players.find((p) => p.permaId === permaId) || null;
      const currentPlayerIndex = gameInstance.players.findIndex(
        (p) => p.permaId === permaId
      );

      setMe(currentPlayer!);
      setPlayerIndex(currentPlayerIndex!);
      setRunOnce(true);
    }

    const handleSocketUpdate = (game: Game, view?: View) => {
      console.log("GAME UPDATED");
      console.log(game);
      setPlayerDisconnected(false);
      setGameInstance(game);
      const player = game.players.find((p: Player) => p.permaId === permaId);
      if (player) {
        setMe(player);
      }

      if (view) {
        // Get the current URL
        const { pathname, origin } = window.location;

        // Build the clean URL (without ?params or #hash)
        const cleanUrl = origin + pathname;

        // Update the browser’s URL bar without reloading
        window.history.replaceState({}, document.title, cleanUrl);
        setView(view);
      }
    };

    socket.off("game_update", handleSocketUpdate); // prevent duplicates
    socket.on("game_update", handleSocketUpdate);
    socket.on("player_disconnected", (msg) => {
      setPlayerDisconnected(true);
    });

    return () => {
      socket.off("game_update", handleSocketUpdate);
      socket.off("player_disconnected");
    };
  }, [
    setGameInstance,
    setMe,
    setPlayerIndex,
    setView,
    gameInstance,
    playerId,
    runOnce,
  ]);

  if (!gameInstance) return <p>Loading game...</p>;
  if (!me) return <p>Finding player info....</p>;

  return (
    <>
      <Players />
      <StatusBanner />
      <div className="flex justify-center items-center gap-4 my-8">
        <DrawPile />
        <div className="flex flex-col gap-4">
          <Button disabled={!me.endTerm} onClick={handleEndTerm}>
            End Term
          </Button>
          <GameStatus />
        </div>
        <DiscardPile />
      </div>
      <div className="flex flex-col items-center">
        <LiberalBoard />
        <FascistBoard />
      </div>

      <RoleModal />
      <PickChancellorModal />
      <VotingModal />

      {gameInstance ? (
        <>
          {gameInstance.currentPresidentIndex === me.index && (
            <>
              <PresidentHandModal />
              <PeekModal />
              <InvestigateModal />
              <SpecialElectionModal />
              <ExecutionModal />
            </>
          )}

          {gameInstance.currentChancellorIndex === me.index && (
            <ChancellorHandModal />
          )}

          <ElectionTrackerModal />
          <PolicyEnactedModal />
          <InvestigateResultModal />
          <ExecutionResultModal />
          <VetoUnlockedModal />
          <ProposeVetoModal />
          <GameOverModal />
        </>
      ) : null}

      {me?.phase !== null && <PhaseBanner />}
      {playerDisconnected && (
        <div className="fixed w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Player Disconnected</h2>
            <p className="mb-4">
              A player has disconnected from the game. Please wait while they
              reconnect.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
