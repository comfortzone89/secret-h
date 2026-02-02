import React from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import {
  ROLE_MODAL_FASCIST_P1,
  ROLE_MODAL_FASCIST_P2,
  ROLE_MODAL_FASCIST_P3,
  ROLE_MODAL_HITLER_P1,
  ROLE_MODAL_HITLER_P2,
  ROLE_MODAL_HITLER_P3,
  ROLE_MODAL_LIBERAL_P1,
  ROLE_MODAL_LIBERAL_P2,
  ROLE_MODAL_LIBERAL_P3,
} from "../../constants";

const RoleModal: React.FC = () => {
  const { gameInstance, getMe, handleRoleModalClose } = useGameStore();

  if (gameInstance === null) return;
  const me = getMe();

  const role = me?.role;
  const imageName =
    role === "HITLER"
      ? role
      : role === "LIBERAL"
      ? role + "-" + (Math.floor(Math.random() * 6) + 1)
      : role + "-" + (Math.floor(Math.random() * 3) + 1);

  return (
    <Modal modal="role" className="bg-black" allowMinimize={false}>
      <h2 className="text-xl font-bold uppercase mb-5">You are: {role}</h2>
      <div className="flex gap-5">
        <Image
          src={`/images/role-${imageName}.png`}
          priority={true}
          alt={role!}
          width={210}
          height={77}
          className="w-[30vmin] h-auto object-contain"
        />
        <div className="mb-4">
          <p className="mb-4">
            {role === "LIBERAL"
              ? ROLE_MODAL_LIBERAL_P1
              : role === "FASCIST"
              ? ROLE_MODAL_FASCIST_P1
              : ROLE_MODAL_HITLER_P1}
          </p>
          <p className="mb-4">
            {role === "LIBERAL"
              ? ROLE_MODAL_LIBERAL_P2
              : role === "FASCIST"
              ? ROLE_MODAL_FASCIST_P2
              : ROLE_MODAL_HITLER_P2}
          </p>
          <p>
            {role === "LIBERAL"
              ? ROLE_MODAL_LIBERAL_P3
              : role === "FASCIST"
              ? ROLE_MODAL_FASCIST_P3
              : ROLE_MODAL_HITLER_P3}
          </p>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Button onClick={handleRoleModalClose}>Start game</Button>
      </div>
    </Modal>
  );
};

export default RoleModal;
