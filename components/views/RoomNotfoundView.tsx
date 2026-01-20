"use client";

import { useGameStore } from "@/store/game";
import Button from "../../components/templates/Button";

export default function RoomNotFoundView() {
  const { setView } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <p>The room ID you entered does not exist</p>

      <div className="flex space-x-4">
        <Button onClick={() => setView("home")}>Home</Button>
      </div>
    </div>
  );
}
