import React from "react";
import Modal from "../templates/Modal";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import { PROPOSE_VETO_MODAL_H, PROPOSE_VETO_MODAL_P1 } from "../../constants";

const ProposeVetoModal: React.FC = () => {
  const { gameInstance, handleProposeVetoModalClose } = useGameStore();

  const chancellorIndex = gameInstance?.currentChancellorIndex;
  if (chancellorIndex === null || chancellorIndex === undefined) return;
  const chancellorName = gameInstance?.players[chancellorIndex].name;

  return (
    <Modal modal="vetoProposed" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{PROPOSE_VETO_MODAL_H}</h2>
      <p className="text-center mb-4">
        {chancellorName} {PROPOSE_VETO_MODAL_P1}
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={() => handleProposeVetoModalClose(true)}>
          Oblige
        </Button>
        <Button onClick={() => handleProposeVetoModalClose(false)}>
          Reject
        </Button>
      </div>
    </Modal>
  );
};

export default ProposeVetoModal;
