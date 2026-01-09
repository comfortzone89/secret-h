"use client";
import { useGameStore } from "../../store/game";
import Input from "../../components/templates/Input";
import Button from "../../components/templates/Button";
import Label from "../../components/templates/Label";
import PlayerContainer from "../templates/PlayerContainer";
import PortraitModal from "../modals/PortraitModal";

export default function CreateJoinView() {
  const {
    mode,
    roomId,
    selectedPortrait,
    name,
    setName,
    setIsModalOpen,
    setMaxPlayers,
    setLocalRoomId,
    handleGameSubmit,
    setPlayerOrder,
  } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-xl font-bold">
        {mode === "create" ? "Create" : "Join"} game
      </h1>

      <div className="flex flex-col">
        <Label htmlFor="playerName">Your name:</Label>
        <Input
          id="playerName"
          type="text"
          value={name}
          autoFocus={true}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col items-center">
        <Button onClick={() => setIsModalOpen(true)}>
          {selectedPortrait ? "Change Portrait" : "Choose Portrait"}
        </Button>
        {selectedPortrait && (
          <PlayerContainer className="mt-4" portrait={selectedPortrait} />
        )}
      </div>

      {mode === "create" && (
        <div className="flex flex-col">
          <Label htmlFor="playersCount">Number of Players (5–10):</Label>
          <Input
            id="playersCount"
            type="number"
            min={5}
            max={10}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
          />
          {/* INSERT CHECKBOX HERE */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-medium mr-2">Player order: </span>

            <label className="flex items-center cursor-pointer select-none">
              <span className="mr-1 text-sm text-gray-400">Random</span>

              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  onChange={(e) => {
                    setPlayerOrder(e.target.checked ? "manual" : "random");
                  }}
                />

                {/* Track */}
                <div className="block w-10 h-6 rounded-full bg-gray-600 peer-checked:bg-gray-500 transition-colors"></div>

                {/* Thumb */}
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform transform peer-checked:translate-x-4"></div>
              </div>

              <span className="ml-1 text-sm text-gray-400">Manual</span>
            </label>
          </div>
        </div>
      )}

      {/* Hide Room ID input when roomId is already set from ?roomId */}
      {mode === "join" && !roomId && (
        <div className="flex flex-col">
          <Label htmlFor="roomId">Room ID:</Label>
          <Input
            id="roomId"
            type="text"
            onChange={(e) => setLocalRoomId(e.target.value)}
          />
        </div>
      )}

      <Button onClick={handleGameSubmit}>
        {mode === "create" ? "Create Game" : "Join Game"}
      </Button>

      <PortraitModal />
    </div>
  );
}
