import React, { useState } from "react";
import Button from "../templates/Button";
import Modal from "../templates/Modal";
import PlayerContainer from "../templates/PlayerContainer";
import { useGameStore } from "../../store/game";
import { NOMINATE_CHANCELLOR_MODAL_H } from "../../constants";

const PickChancellorModal: React.FC = () => {
  const { gameInstance, getMe, handleNominateChancellorModalClose } =
    useGameStore();
  const me = getMe();
  const players = gameInstance?.players;

  const [selectedChancellor, setSelectedChancellor] = useState<number | null>(
    null
  );

  let checkTermLimitForPresident = true;
  const alivePlayers = gameInstance?.players.filter((p) => p.alive === true);

  if (alivePlayers!.length <= 5) {
    checkTermLimitForPresident = false;
  }

  if (
    gameInstance === null ||
    gameInstance?.currentPresidentIndex !== me?.index
  )
    return;

  return (
    <Modal modal="nominate_chancellor">
      <h2 className="text-lg font-bold mb-4">{NOMINATE_CHANCELLOR_MODAL_H}</h2>
      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-2 flex-wrap justify-center">
          {players?.map((p, i) => {
            if (me?.id === p.id) return;
            return (
              <button
                key={i}
                onClick={() => setSelectedChancellor(i)}
                className={`rounded-xl overflow-hidden transition cursor-pointer ${
                  selectedChancellor === i ? "bg-amber-500" : ""
                }`}
                disabled={
                  !p.alive ||
                  p.index === gameInstance?.lastGovernment.chancellorId ||
                  (checkTermLimitForPresident &&
                    p.index === gameInstance?.lastGovernment.presidentId)
                    ? true
                    : false
                }
              >
                <PlayerContainer player={p} checkTermLimits={true} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Button
          disabled={selectedChancellor === null}
          onClick={() => {
            if (selectedChancellor !== null) {
              handleNominateChancellorModalClose(selectedChancellor);
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default PickChancellorModal;
