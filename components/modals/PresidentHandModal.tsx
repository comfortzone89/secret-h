import React, { useState } from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import clsx from "clsx";
import {
  PRESIDENT_HAND_MODAL_H,
  PRESIDENT_HAND_MODAL_P1,
} from "../../constants";

const PresidentHandModal: React.FC = () => {
  const { gameInstance, handlePresidentHandModalClose } = useGameStore();

  const [selectedChancellor, setSelectedChancellor] = useState<number | null>(
    null
  );

  const presidentHand = gameInstance?.presidentHand;

  return (
    <Modal modal="president_hand" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{PRESIDENT_HAND_MODAL_H}</h2>
      <p className="text-center mb-4">{PRESIDENT_HAND_MODAL_P1}</p>
      <div className="flex justify-center gap-5 mb-4">
        {presidentHand?.map((card, i) => (
          <button
            key={i}
            onClick={() => setSelectedChancellor(i)}
            value={i}
            className={clsx(
              "rounded-xl cursor-pointer p-1.5 transition",
              selectedChancellor !== null && selectedChancellor === i
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
          disabled={selectedChancellor === null}
          onClick={() => {
            if (selectedChancellor !== null) {
              handlePresidentHandModalClose(selectedChancellor);
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default PresidentHandModal;
