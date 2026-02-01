import React, { useState } from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import clsx from "clsx";
import { CHANCELLOR_MODAL_H } from "../../constants";

const ChancellorHandModal: React.FC = () => {
  const { gameInstance, handleChancellorHandModalClose, handleVeto } =
    useGameStore();
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null);

  const chancellorHand = gameInstance?.chancellorHand;
  return (
    <Modal modal="chancellor_hand" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{CHANCELLOR_MODAL_H}</h2>
      {gameInstance?.vetoUnlocked && !gameInstance?.chancellorProposedVeto && (
        <div className="flex justify-center items-center gap-4 mb-4">
          <Button onClick={handleVeto}>Propose Veto</Button>
          <span>Or choose a policy to legislate</span>
        </div>
      )}
      <div className="flex justify-center gap-5 mb-4">
        {chancellorHand?.map((card, i) => (
          <button
            key={i}
            onClick={() => setSelectedPolicy(i)}
            value={i}
            className={clsx(
              "rounded-xl cursor-pointer p-1.5 transition",
              selectedPolicy !== null && selectedPolicy === i
                ? "bg-amber-500"
                : ""
            )}
          >
            <Image
              src={`/images/board-policy-${card}.png`}
              alt={card}
              width={200}
              height={100}
              className="w-[14vmin]"
            />
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            if (selectedPolicy !== null) {
              handleChancellorHandModalClose(selectedPolicy);
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ChancellorHandModal;
