"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

import HomeView from "@/components/views/HomeView";
import CreateJoinView from "@/components/views/CreateJoinView";
import LobbyView from "@/components/views/LobbyView";
import GameView from "@/components/views/GameView";

import { useGameStore } from "@/store/game";
import { useLobbyStore } from "@/store/lobby";
import type {
  LobbyUpdatePayload,
  GameStartPayload,
  ReconnectResponse,
  CheckRoomResponse,
} from "@/types";
import Loader from "@/components/templates/Loader";

export default function Page() {
  /**
   * --------------------------------------------------------
   *  HYDRATION GATE (CRITICAL)
   * --------------------------------------------------------
   */
  const [hydrated, setHydrated] = useState(false);

  /**
   * --------------------------------------------------------
   *  SESSION REFS (NO RERENDERS)
   * --------------------------------------------------------
   */
  const roomIdRef = useRef<string | null>(null);
  const joinedRoomIdRef = useRef<string | null>(null);
  const permaIdRef = useRef<string | null>(null);

  /**
   * --------------------------------------------------------
   *  STORES
   * --------------------------------------------------------
   */
  const { view, setView, setMode, initializeGame, setRoomId, setMaxPlayers } =
    useGameStore();

  const { setLobbyPlayers, setMaxLobbyPlayers, setLobbyPlayerId } =
    useLobbyStore();

  /**
   * --------------------------------------------------------
   *  READ SESSION AFTER HYDRATION
   * --------------------------------------------------------
   */
  useEffect(() => {
    roomIdRef.current = new URLSearchParams(window.location.search).get(
      "roomId"
    );

    joinedRoomIdRef.current = sessionStorage.getItem("joinedRoomId");
    permaIdRef.current = sessionStorage.getItem("playerId");

    setHydrated(true);
  }, []);

  /**
   * --------------------------------------------------------
   *  SOCKET LIFECYCLE
   * --------------------------------------------------------
   */
  useEffect(() => {
    if (!hydrated) return;

    const handleConnect = () => {
      const roomId = roomIdRef.current;
      const joinedRoomId = joinedRoomIdRef.current;
      const permaId = permaIdRef.current;

      setLobbyPlayerId(socket.id || "");

      if (!roomId) return;

      if (joinedRoomId && joinedRoomId === roomId && permaId) {
        socket.emit(
          "reconnect_to_room",
          { roomId, permaId },
          (res: ReconnectResponse | { error: string }) => {
            if ("error" in res) {
              setView("home");
              return;
            }

            useGameStore.getState().setPlayerId(socket.id || "");
            useGameStore.getState().setPlayers(res.room.players);
            useGameStore.getState().setMaxPlayers(res.room.maxPlayers);
            setRoomId(roomId);
            setView(res.room.started ? "game" : "lobby");

            if (res.game) {
              // Not using setGameInstance to avoid rerender issues
              useGameStore.getState().setGameInstance(res.game);
            }
          }
        );
        return;
      }

      socket.emit("check_room", { roomId }, (res: CheckRoomResponse) => {
        if (!res.exists) return;

        setMode("join");
        setRoomId(roomId);
        setView("createJoin");
      });
    };

    const handleLobbyUpdate = (data: LobbyUpdatePayload) => {
      setLobbyPlayers(data.players);
      setMaxLobbyPlayers(data.maxPlayers);

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
      const socketId = socket.id || "";
      useGameStore.getState().setPlayerId(socketId);

      sessionStorage.setItem("playerId", socketId);
      sessionStorage.setItem("joinedRoomId", data.roomId);

      permaIdRef.current = socketId;
      joinedRoomIdRef.current = data.roomId;

      initializeGame(data.game);
      setView("game");
    };

    socket.on("connect", handleConnect);
    socket.on("lobby_update", handleLobbyUpdate);
    socket.on("game_start", handleGameStart);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("lobby_update", handleLobbyUpdate);
      socket.off("game_start", handleGameStart);
    };
  }, [hydrated]);

  /**
   * --------------------------------------------------------
   *  STABLE SERVER + FIRST CLIENT RENDER
   * --------------------------------------------------------
   */
  if (!hydrated) {
    return <Loader />;
  }

  /**
   * --------------------------------------------------------
   *  VIEW RENDERING
   * --------------------------------------------------------
   */
  if (
    joinedRoomIdRef.current &&
    roomIdRef.current &&
    joinedRoomIdRef.current === roomIdRef.current
  ) {
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
