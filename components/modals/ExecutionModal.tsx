import React, { useState } from "react";
import Modal from "../templates/Modal";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import PlayerContainer from "../templates/PlayerContainer";
import clsx from "clsx";
import {
  EXECUTION_MODAL_H,
  EXECUTION_MODAL_P1,
  EXECUTION_MODAL_P2,
} from "../../constants";

const ExecutionModal: React.FC = () => {
  const { gameInstance, getMe, handleExecutionModalClose } = useGameStore();
  const me = getMe();
  const players = gameInstance?.players;

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  return (
    <Modal modal="execution" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{EXECUTION_MODAL_H}</h2>
      <p className="mb-4">{EXECUTION_MODAL_P1}</p>
      <p className="mb-4">{EXECUTION_MODAL_P2}</p>
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        {players?.map((p, i) => {
          if (me?.id === p.id) return;
          return (
            <button
              key={i}
              onClick={() => setSelectedPlayer(i)}
              className={clsx(
                "rounded-xl overflow-hidden transition cursor-pointer",
                selectedPlayer === i ? "bg-amber-500" : ""
              )}
              disabled={!p.alive ? true : false}
            >
              <PlayerContainer player={p} />
            </button>
          );
        })}
      </div>
      <div className="flex justify-center">
        <Button
          disabled={selectedPlayer === null}
          onClick={() => {
            if (selectedPlayer !== null) {
              handleExecutionModalClose(selectedPlayer);
            }
          }}
        >
          Okay
        </Button>
      </div>
    </Modal>
  );
};

export default ExecutionModal;
