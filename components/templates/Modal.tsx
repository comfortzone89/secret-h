"use client";

import { ReactNode, useEffect } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Minus } from "lucide-react";
import { useGameStore } from "../../store/game";

type ModalProps = {
  children: ReactNode;
  modal: string;
  className?: string;
  allowMinimize?: boolean;
};

export default function Modal({
  children,
  modal,
  className,
  allowMinimize = true,
}: ModalProps) {
  const { gameInstance, isMinimized, getMe, setIsMinimized } = useGameStore();
  const me = getMe();

  // ----------------------------
  // Modal visibility logic
  // ----------------------------
  const canShowModal = (() => {
    if (!gameInstance && !me) return true;
    if (me?.modal !== modal) return false;

    switch (modal) {
      case "nominate_chancellor":
      case "president_hand":
      case "peek":
      case "investigate":
      case "specialElection":
      case "execution":
        return gameInstance?.currentPresidentIndex === me?.index;
      case "chancellor_hand":
        return gameInstance?.currentChancellorIndex === me?.index;
      default:
        return true;
    }
  })();

  useEffect(() => {
    if (!canShowModal) {
      setIsMinimized(false);
    }
  }, [canShowModal, setIsMinimized]);

  return (
    <AnimatePresence>
      {/* Backdrop + expanded modal */}
      {canShowModal && !isMinimized && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[99] bg-black/30 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="min-h-full flex justify-center">
            <motion.div
              key="modal"
              className={clsx(
                `relative my-auto bg-black p-6 rounded-xl shadow-lg max-w-3xl w-full overflow-y-auto`,
                className
              )}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {allowMinimize && (
                <button
                  className="absolute top-0 right-0 bg-amber-600 hover:bg-amber-500 p-1 cursor-pointer transition-all"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minus />
                </button>
              )}

              {children}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Minimized bar outside backdrop */}
      {isMinimized && modal !== "portrait" && (
        <motion.div
          key="modal-minimized"
          className="fixed bottom-0 left-0 w-full z-[100]" // higher z-index than backdrop
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="w-full bg-amber-600 hover:bg-amber-500 p-3 flex justify-center items-center cursor-pointer transition-all"
            onClick={() => setIsMinimized(false)}
          >
            <span className="text-2xl">Show Modal</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
