import React from "react";
import Modal from "../templates/Modal";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import PlayerContainer from "../templates/PlayerContainer";
import {
  EXECUTION_RESULT_MODAL_H,
  EXECUTION_RESULT_MODAL_ME,
} from "../../constants";

const ExecutionResultModal: React.FC = () => {
  const { gameInstance, getMe, handleExecutionResultModalClose } =
    useGameStore();
  const me = getMe();

  const executedPlayerIndex = gameInstance?.lastExecutedPlayer;
  if (executedPlayerIndex === null || executedPlayerIndex === undefined) return;
  const executedPlayer = gameInstance?.players[executedPlayerIndex];
  const executedPlayerName = executedPlayer?.name;

  const presidentIndex = gameInstance?.currentPresidentIndex;
  if (presidentIndex === null || presidentIndex === undefined) return;
  const president = gameInstance?.players[presidentIndex];
  const presidentName = gameInstance?.players[presidentIndex].name;

  return (
    <Modal modal="executionResult" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{EXECUTION_RESULT_MODAL_H}</h2>
      {gameInstance?.currentPresidentIndex === me?.index && (
        <>
          <p className="text-center mb-4">
            You have executed {executedPlayerName}
          </p>
          <div className="flex justify-center mb-4">
            <PlayerContainer player={executedPlayer} />
          </div>
          <p className="text-center mb-4">
            The player {executedPlayer?.role === "hitler" ? "WAS" : "WASN'T"}{" "}
            Hitler!
          </p>
        </>
      )}

      {executedPlayerIndex === me?.index && (
        <>
          <p className="text-center mb-4">
            You have been executed by {presidentName}
          </p>
          <div className="flex justify-center mb-4">
            <PlayerContainer player={president} />
          </div>
          <p className="text-center mb-4">{EXECUTION_RESULT_MODAL_ME}</p>
        </>
      )}

      {gameInstance?.currentPresidentIndex !== me?.index &&
        executedPlayerIndex !== me?.index && (
          <>
            <p className="text-center mb-4">
              {executedPlayerName} has been executed by {presidentName}.
            </p>
            <div className="flex justify-center mb-4">
              <PlayerContainer player={executedPlayer} />
            </div>

            <p className="text-center mb-4">
              {executedPlayerName}{" "}
              {executedPlayer?.role === "hitler" ? "WAS" : "WASN'T"} Hitler!
            </p>
          </>
        )}

      <div className="flex justify-center">
        <Button onClick={handleExecutionResultModalClose}>Okay</Button>
      </div>
    </Modal>
  );
};

export default ExecutionResultModal;
