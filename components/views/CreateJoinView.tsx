"use client";
import { useGameStore } from "../../store/game";
import { useSearchParams } from "next/navigation";
import Input from "../../components/templates/Input";
import Button from "../../components/templates/Button";
import Label from "../../components/templates/Label";
import PlayerContainer from "../templates/PlayerContainer";
import PortraitModal from "../modals/PortraitModal";
import Checkbox from "../templates/Checkbox";
import { ArrowLeft } from "lucide-react";
import { ToastContainer } from "react-toastify";

export default function CreateJoinView() {
  const {
    mode,
    roomId,
    selectedPortrait,
    name,
    maxPlayers,
    setRoomId,
    setName,
    setIsModalOpen,
    setMaxPlayers,
    handleGameSubmit,
    setPlayerOrder,
    setView,
  } = useGameStore();

  const searchParams = useSearchParams();
  const roomIdFromUrl = searchParams.get("roomId");

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-xl font-bold">
        {mode === "create" ? "Create" : "Join"} game
      </h1>
      <div className="flex items-center gap-4">
        {mode === "create" && (
          <div className="flex flex-col">
            <Label htmlFor="playerName">Game name:</Label>
            <Input
              id="gameName"
              type="text"
              value={roomId || ""}
              autoFocus={true}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <Label htmlFor="playerName">Your name:</Label>
            <span>12</span>
          </div>
          <Input
            id="playerName"
            type="text"
            value={name}
            maxLength={12}
            autoFocus={mode === "create" ? false : true}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col items-center relative">
        {selectedPortrait && (
          <PlayerContainer className="mt-4" portrait={selectedPortrait} />
        )}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="!absolute bottom-[7.5%]"
        >
          Change
        </Button>
      </div>

      {mode === "create" && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="playersCount">Number of Players (5–10):</Label>
          <Input
            id="playersCount"
            type="range"
            min={5}
            max={10}
            step={1}
            // list="playersCountMarks"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            style={
              {
                "--value": maxPlayers,
                "--min": 5,
                "--max": 10,
              } as React.CSSProperties
            }
          />

          <div className="flex justify-between text-xs text-white px-[7px] -mt-2">
            {[5, 6, 7, 8, 9, 10].map((n) => (
              <span key={n} className="w-[1px] h-[5px] bg-white"></span>
            ))}
          </div>

          <div className="text-center text-sm font-medium">
            Players: {maxPlayers}
          </div>

          {/* <datalist id="playersCountMarks">
            {[5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n} label={n.toString()} />
            ))}
          </datalist> */}

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
      {mode === "join" && !roomIdFromUrl && (
        <div className="flex flex-col">
          <Label htmlFor="roomId">Room ID:</Label>
          <Input
            id="roomId"
            type="text"
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          onClick={() => setView("home")}
          className="flex items-center gap-1"
        >
          <ArrowLeft />
          Go Back
        </Button>
        <Button onClick={handleGameSubmit}>
          {mode === "create" ? "Create Game" : "Join Game"}
        </Button>
      </div>
      <PortraitModal />
      <ToastContainer />
    </div>
  );
}
