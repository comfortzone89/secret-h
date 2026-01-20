"use client";

import { useEffect, useState } from "react";
import { Game } from "../../server/lib/Game";
import { View } from "../../server/types";
import { socket } from "../../socket/socket";
import { useGameStore } from "../../store/game";

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
import ShowAffiliationModal from "../modals/ShowAffiliationModal";

export default function GameView() {
  const {
    playerId,
    gameInstance,
    setGameInstance,
    setView,
    getMe,
    handleEndTerm,
    handleShowAffiliationModal,
  } = useGameStore();

  const [playerDisconnected, setPlayerDisconnected] = useState<boolean>(false);

  /**
   * Socket listeners
   */
  useEffect(() => {
    if (!playerId) return;

    const handleGameUpdate = (game: Game, view?: View) => {
      setPlayerDisconnected(false);
      setGameInstance(game);

      if (view) {
        const { origin } = window.location;
        const url = origin;
        window.history.replaceState({}, document.title, url);
        setView(view);
      }
    };

    socket.on("game_update", handleGameUpdate);
    socket.on("player_disconnected", () => setPlayerDisconnected(true));

    return () => {
      socket.off("game_update", handleGameUpdate);
      socket.off("player_disconnected");
    };
  }, [playerId, setGameInstance, setView]);

  if (!gameInstance || !playerId === null) {
    return <p>Loading game...</p>;
  }

  const me = getMe();
  // console.log("GAME INSTANCE:", gameInstance);
  // console.log("ME:", me);

  if (!me) {
    return <p>Finding player info...</p>;
  }

  return (
    <>
      <Players />
      <StatusBanner />

      <div className="flex justify-center items-center gap-4 mt-2 md:mt-12">
        <DrawPile />
        <div className="flex flex-col gap-4">
          <Button disabled={!me.endTerm} onClick={handleEndTerm}>
            End Term
          </Button>
          <GameStatus />
          <Button onClick={() => handleShowAffiliationModal(true)}>
            Affiliation
          </Button>
        </div>
        <DiscardPile />
      </div>

      <div className="flex flex-col items-center">
        <LiberalBoard />
        <FascistBoard />
      </div>

      <ShowAffiliationModal />
      <RoleModal />
      <PickChancellorModal />
      <VotingModal />

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

      {me.phase !== null && <PhaseBanner />}

      {playerDisconnected && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Player Disconnected</h2>
            <p>Please wait while they reconnect.</p>
          </div>
        </div>
      )}
    </>
  );
}
