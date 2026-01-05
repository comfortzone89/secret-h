import React from "react";
import Modal from "../templates/Modal";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import {
  UNLOCKED_VETO_MODAL_H,
  UNLOCKED_VETO_MODAL_P1,
  UNLOCKED_VETO_MODAL_P2,
} from "../../constants";

const VetoUnlockedModal: React.FC = () => {
  const { handleVetoUnlockedModalClose } = useGameStore();
  return (
    <Modal modal="vetoUnlock" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{UNLOCKED_VETO_MODAL_H}</h2>
      <p className="text-center mb-4">{UNLOCKED_VETO_MODAL_P1}</p>
      <p className="text-center mb-4">{UNLOCKED_VETO_MODAL_P2}</p>

      <div className="flex justify-center">
        <Button onClick={handleVetoUnlockedModalClose}>Okay</Button>
      </div>
    </Modal>
  );
};

export default VetoUnlockedModal;
