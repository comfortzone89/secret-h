"use client";

import { AppPhase } from "@/server/types";
import { socket } from "@/socket/socket";
import { useEffect } from "react";

interface DisconnectedViewProps {
  setPhase: (phase: AppPhase) => void;
}

export default function DisconnectedView({ setPhase }: DisconnectedViewProps) {
  useEffect(() => {
    socket.connect();
    setPhase("reconnecting");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <p>You have been disconnected. Reconnecting...</p>
    </div>
  );
}
