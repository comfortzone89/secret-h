import React from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import { motion } from "framer-motion";

const ShowAffiliationModal: React.FC = () => {
  const { getMe, handleShowAffiliationModal } = useGameStore();
  const me = getMe();
  const role = me?.role;
  const roleName = role === "HITLER" ? "FASCIST" : role;

  return (
    <Modal
      modal="showAffiliation"
      className="bg-black/100 fixed w-[100vw] max-w-[100vw] h-[100vh] flex flex-col justify-center"
      allowMinimize={false}
    >
      <h2 className="text-xl mb-4 text-center">Show Party Membership</h2>
      <p className="mb-4 text-center">
        This is useful if you have a playing board and you want to use the
        application to distribute roles in a faster and safer manner. If
        you&apos;re playing the game through this application, this feature is
        useless since the game logic already handles investigations.
      </p>
      <>
        <div className="flex justify-center mb-4 w-full">
          <div className="relative w-[28vmin] aspect-[500/713]">
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -180, opacity: 0 }}
              transition={{
                rotateY: { duration: 1, delay: 1 },
                opacity: { duration: 0, delay: 1.35 },
              }}
              className="absolute w-[28vmin] aspect-[500/713]"
            >
              <Image
                src="/images/party-membership.png"
                alt="Unknown Membership Card"
                fill
              />
            </motion.div>
            <motion.div
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{
                rotateY: { duration: 1, delay: 1 },
                opacity: { duration: 0, delay: 1.35 },
              }}
              className="absolute w-[28vmin] aspect-[500/713]"
            >
              <Image
                src={`/images/party-membership-${roleName}.png`}
                alt={`${roleName} Membership Card`}
                fill
              />
            </motion.div>
          </div>
        </div>
        <p className="text-center mb-4">
          {me?.name} is a member of the{" "}
          <span className="capitalize">{roleName}</span> party
        </p>
      </>

      <div className="flex justify-center">
        <Button onClick={() => handleShowAffiliationModal(false)}>Okay</Button>
      </div>
    </Modal>
  );
};

export default ShowAffiliationModal;
