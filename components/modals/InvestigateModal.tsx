import React, { useState } from "react";
import Modal from "../templates/Modal";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import PlayerContainer from "../templates/PlayerContainer";
import clsx from "clsx";
import {
  INVESTIGATE_MODAL_H,
  INVESTIGATE_MODAL_P1,
  INVESTIGATE_MODAL_P2,
  INVESTIGATE_MODAL_P3,
} from "../../constants";

const InvestigateModal: React.FC = () => {
  const { gameInstance, getMe, handleInvestigateModalClose } = useGameStore();
  const me = getMe();

  const players = gameInstance?.players;

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  return (
    <Modal modal="investigate" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{INVESTIGATE_MODAL_H}</h2>
      <p className="mb-4">{INVESTIGATE_MODAL_P1}</p>
      <p className="mb-4">{INVESTIGATE_MODAL_P2}</p>
      <p className="mb-4">{INVESTIGATE_MODAL_P3}</p>
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
              handleInvestigateModalClose(selectedPlayer);
            }
          }}
        >
          Okay
        </Button>
      </div>
    </Modal>
  );
};

export default InvestigateModal;
