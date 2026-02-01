import React from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import { Policy } from "../../server/types";
import { PEEK_MODAL_H } from "../../constants";

const PeekModal: React.FC = () => {
  const { gameInstance, handlePeekModalClose } = useGameStore();

  const drawPile = gameInstance?.drawPile;
  const cards = drawPile?.slice(0, 3);

  return (
    <Modal modal="peek" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{PEEK_MODAL_H}</h2>
      <div className="flex justify-center gap-4 mb-4">
        {cards?.map((card: Policy, i) => {
          return (
            <Image
              key={`peek-${i}`}
              src={`/images/board-policy-${card}.png`}
              alt={card}
              width={200}
              height={100}
              className="w-[14vmin]"
            />
          );
        })}
      </div>
      <div className="flex justify-center">
        <Button onClick={handlePeekModalClose}>Okay</Button>
      </div>
    </Modal>
  );
};

export default PeekModal;
