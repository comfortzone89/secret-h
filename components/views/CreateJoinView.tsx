"use client";
import { useGameStore } from "../../store/game";
import Input from "../../components/templates/Input";
import Button from "../../components/templates/Button";
import Label from "../../components/templates/Label";
import PlayerContainer from "../templates/PlayerContainer";
import PortraitModal from "../modals/PortraitModal";
import Checkbox from "../templates/Checkbox";

export default function CreateJoinView() {
  const {
    mode,
    roomId,
    selectedPortrait,
    name,
    roomName,
    setRoomName,
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

      {mode === "create" && (
        <div className="flex flex-col">
          <Label htmlFor="playerName">Game name:</Label>
          <Input
            id="gameName"
            type="text"
            value={roomName}
            autoFocus={true}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-col">
        <Label htmlFor="playerName">Your name:</Label>
        <Input
          id="playerName"
          type="text"
          value={name}
          autoFocus={mode === "create" ? false : true}
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

          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-medium mr-2">Player order: </span>

            <Checkbox
              labels={{ off: "Random", on: "Manual" }}
              onChange={(checked) =>
                setPlayerOrder(checked ? "manual" : "random")
              }
            />
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
