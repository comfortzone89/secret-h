import React from "react";
import Modal from "../templates/Modal";
import Image from "next/image";
import Button from "../templates/Button";
import { useGameStore } from "../../store/game";
import { motion } from "framer-motion";
import { POLICY_ENACTED_MODAL_H } from "../../constants";

const PolicyEnactedModal: React.FC = () => {
  const { gameInstance, handlePolicyEnactedModalClose } = useGameStore();

  const enactedPolicy =
    gameInstance?.enactedPolicies[gameInstance?.enactedPolicies.length - 1];

  return (
    <Modal modal="policy_enacted" className="bg-black">
      <h2 className="text-xl mb-4 text-center">{POLICY_ENACTED_MODAL_H}</h2>
      <div className="flex m-auto mb-4 relative h-[26vmin] w-[20vmin]">
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "-50%" }}
          transition={{ duration: 0.6 }}
          className="absolute h-[26vmin] aspect-[642/419] z-[51]"
        >
          <Image
            src="/images/folder-1.png"
            alt="Folder 1"
            fill
            className="object-contain"
          />
        </motion.div>
        <motion.div
          initial={{ left: "-7.5%" }}
          animate={{ left: "42.5%" }}
          transition={{ duration: 0.6 }}
          className="absolute h-full w-auto aspect-[576/776] z-[52]"
        >
          <Image
            src={`/images/policy-enacted-${enactedPolicy}.png`}
            alt={`Policy ${enactedPolicy}`}
            width={576}
            height={776}
          />
        </motion.div>
        <motion.div
          initial={{ left: "-99.5%", rotateY: 180 }}
          animate={{ left: "-49.5%", rotateY: 0 }}
          transition={{
            left: { duration: 0.6 },
            rotateY: { duration: 0.6, delay: 0.6 },
          }}
          className="absolute h-[26vmin] w-auto aspect-[595/419] z-[53]"
        >
          <Image
            src="/images/folder-2.png"
            alt="Folder 2"
            fill
            className="object-contain"
          />
        </motion.div>
        <motion.div
          initial={{ left: "-99.5%", rotateY: 0 }}
          animate={{ left: "-49.5%", rotateY: -180, opacity: 0 }}
          transition={{
            left: { duration: 0.6 },
            opacity: { duration: 0, delay: 0.8 }, // Using opacity instead of z-index since z-index can't animate
            rotateY: { duration: 0.6, delay: 0.6 },
          }}
          className="absolute h-[26vmin] w-auto aspect-[595/419] z-[54]"
        >
          <Image
            src="/images/folder-3.png"
            alt="Folder 3"
            fill
            className="object-contain"
          />
        </motion.div>
      </div>
      <div className="flex justify-center">
        <Button onClick={handlePolicyEnactedModalClose}>Okay</Button>
      </div>
    </Modal>
  );
};

export default PolicyEnactedModal;
