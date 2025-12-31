"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { socket } from "@/lib/socket";

import HomeView from "@/components/views/HomeView";
import CreateJoinView from "@/components/views/CreateJoinView";
import LobbyView from "@/components/views/LobbyView";
import GameView from "@/components/views/GameView";

import { useGameStore } from "@/store/game";
import type {
  LobbyUpdatePayload,
  GameStartPayload,
  ReconnectResponse,
  CheckRoomResponse,
} from "@/types";
import Loader from "@/components/templates/Loader";

export default function Page() {
  const [sessionReady, setSessionReady] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const {
    view,
    setView,
    setMode,
    setPlayerId,
    setPlayers,
    setGameInstance,
    setMaxPlayers,
    setRoomId,
  } = useGameStore();

  /**
   * --------------------------------------------------------
   *  PERSISTENT SESSION DATA (NO RERENDERS)
   * --------------------------------------------------------
   */

  const joinedRoomIdRef = useRef<string | null>(null);
  const permaIdRef = useRef<string | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    roomIdRef.current = searchParams.get("roomId");
    joinedRoomIdRef.current = sessionStorage.getItem("joinedRoomId");
    permaIdRef.current = sessionStorage.getItem("playerId");

    readyRef.current = true;
    setSessionReady(true);
  }, [searchParams]);

  /**
   * --------------------------------------------------------
   *  SOCKET LIFECYCLE
   * --------------------------------------------------------
   */

  const socketConnectedRef = useRef(false);

  useEffect(() => {
    const handleConnect = () => {
      if (!readyRef.current) return;

      socketConnectedRef.current = true;

      const roomId = roomIdRef.current;
      const joinedRoomId = joinedRoomIdRef.current;
      const permaId = permaIdRef.current;

      // Always bind current socket id
      setPlayerId(socket.id || "");

      if (!roomId) return;

      /**
       * RECONNECT FLOW
       */
      if (joinedRoomId && joinedRoomId === roomId && permaId) {
        socket.emit(
          "reconnect_to_room",
          { roomId, permaId },
          (res: ReconnectResponse | { error: string }) => {
            if ("error" in res) {
              console.warn("Reconnect failed:", res.error);
              roomIdRef.current = null;
              window.history.replaceState(
                {},
                document.title,
                `${process.env.NEXT_PUBLIC_HOSTNAME}`
              );
              setView("home");
              return;
            }

            setPlayers(res.room.players);
            setMaxPlayers(res.room.maxPlayers);
            setRoomId(roomId);
            setView(res.room.started ? "game" : "lobby");

            if (res.game) {
              setGameInstance(res.game);
            }
          }
        );
        return;
      }

      /**
       * JOIN FLOW (URL ONLY)
       */
      socket.emit("check_room", { roomId }, (res: CheckRoomResponse) => {
        if (!res.exists) return;

        setMode("join");
        setRoomId(roomId);
        setView("createJoin");
      });
    };

    const handleLobbyUpdate = (data: LobbyUpdatePayload) => {
      setPlayers(data.players);
      setMaxPlayers(data.maxPlayers);

      if (!useGameStore.getState().gameInstance) {
        window.history.replaceState(
          {},
          document.title,
          `${process.env.NEXT_PUBLIC_HOSTNAME}/?roomId=${data.roomId}`
        );
        setView("lobby");
      }
    };

    const handleGameStart = (data: GameStartPayload) => {
      sessionStorage.setItem("playerId", socket.id || "");
      sessionStorage.setItem("joinedRoomId", data.roomId);

      permaIdRef.current = socket.id || "";
      joinedRoomIdRef.current = data.roomId;

      setGameInstance(data.game);
      setView("game");
    };

    const handleRoomClosed = () => {
      setView("home");
      setPlayers([]);
      setGameInstance(null);
      setRoomId(null);
    };

    socket.on("connect", handleConnect);
    socket.on("lobby_update", handleLobbyUpdate);
    socket.on("game_start", handleGameStart);
    socket.on("room_closed", handleRoomClosed);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("lobby_update", handleLobbyUpdate);
      socket.off("game_start", handleGameStart);
      socket.off("room_closed", handleRoomClosed);
    };
  }, [
    setPlayerId,
    setPlayers,
    setView,
    setGameInstance,
    setMaxPlayers,
    setRoomId,
    setMode,
  ]);

  /**
   * --------------------------------------------------------
   *  VIEW RENDERING
   * --------------------------------------------------------
   */

  const joinedRoomId = joinedRoomIdRef.current;
  const roomId = roomIdRef.current;
  console.log("ROOM ID:", roomId);
  console.log("JOINED ROOM ID:", joinedRoomId);

  if (!sessionReady) {
    return <Loader />; // or a loader/skeleton
  }

  if (joinedRoomId && roomId && joinedRoomId === roomId) {
    console.log("AUTO-RECONNECTING TO GAME VIEW");
    return <GameView />;
  }

  switch (view) {
    case "home":
      return (
        <HomeView
          onClick={(selected) => {
            setMode(selected);
            setRoomId(null);
            setView("createJoin");
          }}
        />
      );

    case "createJoin":
      return <CreateJoinView />;

    case "lobby":
      return <LobbyView />;

    case "game":
      return <GameView />;

    default:
      return null;
  }
}
