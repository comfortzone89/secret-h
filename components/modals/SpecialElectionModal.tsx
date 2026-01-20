import React, { useState } from "react";
import Modal from "../templates/Modal";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import PlayerContainer from "../templates/PlayerContainer";
import clsx from "clsx";
import {
  SPECIAL_ELECTION_MODAL_H,
  SPECIAL_ELECTION_MODAL_P1,
} from "../../constants";

const SpecialElectionModal: React.FC = () => {
  const { gameInstance, getMe, handleSpecialElectionModalClose } =
    useGameStore();
  const me = getMe();

  const players = gameInstance?.players;

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  return (
    <Modal modal="specialElection" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{SPECIAL_ELECTION_MODAL_H}</h2>
      <p className="mb-4">{SPECIAL_ELECTION_MODAL_P1}</p>
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
              handleSpecialElectionModalClose(selectedPlayer);
            }
          }}
        >
          Okay
        </Button>
      </div>
    </Modal>
  );
};

export default SpecialElectionModal;
