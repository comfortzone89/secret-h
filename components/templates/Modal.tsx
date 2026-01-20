import { ReactNode } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/game";

export default function Modal({
  children,
  modal,
  className,
}: {
  children: ReactNode;
  modal: string;
  className?: string;
}) {
  const { gameInstance, getMe } = useGameStore();
  const me = getMe();
  // 🔎 centralize modal visibility logic
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
        return true; // other modals visible for everyone
    }
  })();

  return (
    <AnimatePresence mode="wait">
      {canShowModal && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 flex items-center justify-center bg-black/30 z-[99]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal"
            className={clsx(
              "bg-black/90 p-6 rounded-xl shadow-lg relative max-w-3xl w-full",
              className
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
