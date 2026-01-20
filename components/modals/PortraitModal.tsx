import React from "react";
import Button from "../templates/Button";
import Modal from "../templates/Modal";
import { PORTRAIT_MODAL_H, PORTRAITS } from "../../constants";
import Image from "next/image";
import { useGameStore } from "../../store/game";

const PortraitModal: React.FC = () => {
  const {
    selectedPortrait,
    isModalOpen,
    handleSelectPortrait,
    setIsModalOpen,
  } = useGameStore();
  if (!isModalOpen) return;
  return (
    <Modal modal="portrait">
      <h2 className="text-lg font-bold mb-4">{PORTRAIT_MODAL_H}</h2>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-5 gap-4">
          {PORTRAITS.map((src, i) => (
            <button
              key={i}
              onClick={() => handleSelectPortrait(src)}
              className={`rounded-xl overflow-hidden border-3 transition cursor-pointer flex justify-center relative w-full aspect-[1/1] ${
                selectedPortrait === src
                  ? "border-amber-500"
                  : "border-transparent"
              }`}
            >
              <Image
                src={src}
                alt={`Portrait ${i + 1}`}
                fill
                className="object-contain"
              />
            </button>
          ))}
        </div>
      </div>
      <Button onClick={() => setIsModalOpen(false)} className="mt-4">
        Cancel
      </Button>
    </Modal>
  );
};

export default PortraitModal;
