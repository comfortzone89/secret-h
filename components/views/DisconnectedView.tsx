"use client";

import { AppPhase } from "@/server/lib/game/GameTypes";
import { socket } from "@/socket/socket";
import { useEffect } from "react";

interface DisconnectedViewProps {
  setPhase: (phase: AppPhase) => void;
}

export default function DisconnectedView({ setPhase }: DisconnectedViewProps) {
  useEffect(() => {
    socket.connect();
    setPhase("reconnecting");
  }, [setPhase]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full space-y-6 p-4 mt-[35vh]">
      <p>You have been disconnected. Reconnecting...</p>
      <p>
        If you don&apos;t get reconnected in less than 10 seconds, you might
        want to try and refresh the page.
      </p>
    </div>
  );
}
