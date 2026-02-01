"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import { useGameStore } from "../../store/game";

const PhaseBanner: React.FC = () => {
  const { gameInstance, playerId, getMe } = useGameStore();
  const me = getMe();
  const playerIndex = me?.index;
  const currentPhase = me?.phase;
  const permaId = me?.permaId;

  const [show, setShow] = useState(false);
  const [phaseText, setPhaseText] = useState<string | null>(null);

  useEffect(() => {
    if (!currentPhase) return;

    setPhaseText(currentPhase);
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        if (me?.phase === "game_start" && permaId === gameInstance?.hostId) {
          socket.emit("startNewRound", {
            roomId: gameInstance?.id,
          });
        } else if (
          me?.phase === "nomination" &&
          gameInstance?.currentPresidentIndex === me?.index
        ) {
          socket.emit("setModal", {
            roomId: gameInstance?.id,
            playerIndex,
            playerId,
            modal: "nominate_chancellor",
          });
        } else if (me?.phase === "nomination") {
          socket.emit("setStatusBanner", {
            roomId: gameInstance?.id,
            playerId,
            statusBanner: {
              text: "Waiting for President to select a Chancellor...",
              loading: true,
            },
          });
        } else if (
          me?.phase === "voting" &&
          me.vote === null &&
          me.modal !== "voting"
        ) {
          socket.emit("setModal", {
            roomId: gameInstance?.id,
            playerIndex,
            playerId,
            modal: "voting",
          });
        } else if (me?.phase === "vote_passed") {
          socket.emit("setPhase", {
            roomId: gameInstance?.id,
            playerIndex,
            playerId,
            phase: "legislative_session",
          });
        } else if (me?.phase === "vote_failed") {
          socket.emit("setModal", {
            roomId: gameInstance?.id,
            playerIndex,
            playerId,
            modal: "election_tracker",
          });
        } else if (
          me?.phase === "legislative_session" &&
          me.endTerm === false
        ) {
          socket.emit("handleShowPresidentHand", {
            roomId: gameInstance?.id,
            playerIndex,
          });
        } else if (me?.phase === "presidential_power") {
          if (
            // Skip presidential powers if already performed. Crucial for reconnects.
            (gameInstance?.presidentialPower === "execution" &&
              gameInstance.presidentExecutedPlayer) ||
            (gameInstance?.presidentialPower === "investigate" &&
              gameInstance.presidentInvestigatedPlayer)
          ) {
            return;
          }
          socket.emit("setModal", {
            roomId: gameInstance?.id,
            playerIndex,
            playerId,
            modal: gameInstance?.presidentialPower,
          });
        }
      }, 600);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentPhase]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed top-1/2 left-0 w-full z-50 -translate-y-1/2 flex justify-center items-center">
          {/* Background stripe */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-black/90"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0, visibility: "hidden" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          />

          {/* Text */}
          <motion.h2
            key={phaseText}
            initial={{ opacity: 0, translateY: 30 }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: { duration: 0.6, delay: 0.3 }, // delay only on entrance
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.6 }, // no delay on exit
            }}
            className="text-white text-3xl font-bold tracking-widest text-center px-6 py-8 relative z-10"
          >
            {phaseText?.replace("_", " ").toUpperCase()}
          </motion.h2>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PhaseBanner;
