import React from "react";
import Modal from "../templates/Modal";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import Image from "next/image";
import PlayerContainer from "../templates/PlayerContainer";
import { GAME_OVER_MODAL_PLEFT, GAME_OVER_MODAL_WAIT } from "../../constants";

const GameOverModal: React.FC = () => {
  const { gameInstance, getMe, getPlayers, handleGameOverModalClose } =
    useGameStore();
  const me = getMe();
  const players = getPlayers();

  const partyWon = gameInstance?.gameWon;
  if (partyWon === null || partyWon === undefined) return;
  const winReason = gameInstance?.winReason;

  const fascists = players?.filter((p) => p.party === "fascist");
  const liberals = players?.filter((p) => p.party === "liberal");

  return (
    <Modal
      modal="gameOver"
      className="bg-black max-w-5xl"
      allowMinimize={false}
    >
      <div className="mb-4">
        <Image
          src={`/images/victory-${partyWon}-header.png`}
          alt={`${partyWon} Header`}
          width={400}
          height={100}
          priority={gameInstance?.gameWon ? true : false}
          className="w-full"
        />
      </div>
      <p className="text-center mb-4">
        {partyWon.charAt(0).toUpperCase() + partyWon.slice(1)}
        {"s "}
        {winReason === "policy" &&
          "successfully filled their board with enough policies!"}
        {winReason === "hitlerElected" &&
          "successfully elected Hitler as Channcelor!"}
        {winReason === "hitlerExecuted" && "successfully executed Hitler!"}
      </p>
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {fascists?.map((p, i) => (
          <div key={i} className="flex flex-col items-center relative">
            <PlayerContainer player={p} showRoles={true} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {liberals?.map((p, i) => (
          <div key={i} className="flex flex-col items-center relative">
            <PlayerContainer player={p} showRoles={true} />
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4">
        <Button
          onClick={() =>
            handleGameOverModalClose(
              gameInstance?.hostId === me?.permaId && !gameInstance?.playerLeft
                ? "restart"
                : "lobby",
            )
          }
        >
          {gameInstance?.hostId === me?.permaId && !gameInstance?.playerLeft
            ? "Restart"
            : "Back to lobby"}
        </Button>
        {gameInstance?.hostId !== me?.permaId && !gameInstance?.playerLeft && (
          <p>{GAME_OVER_MODAL_WAIT}</p>
        )}
      </div>
      {gameInstance?.playerLeft && (
        <p className="text-center mt-4">{GAME_OVER_MODAL_PLEFT}</p>
      )}
    </Modal>
  );
};

export default GameOverModal;
