"use client";

import { JSX, useEffect, useRef, useState } from "react";
import { socket } from "../../socket/socket";

import HomeView from "../../components/views/HomeView";
import CreateJoinView from "../../components/views/CreateJoinView";
import LobbyView from "../../components/views/LobbyView";
import GameView from "../../components/views/GameView";
import ManualOrder from "@/components/views/ManualOrder";
import RoomNotFoundView from "@/components/views/RoomNotfoundView";
import ViewTransition from "@/components/views/ViewTransition";
import Loader from "../../components/templates/Loader";
import DisconnectedView from "@/components/views/DisconnectedView";

import { useGameStore } from "../../store/game";
import type {
  LobbyUpdatePayload,
  GameStartPayload,
  ReconnectResponse,
  CheckRoomResponse,
  AppPhase,
} from "../../server/types";

export default function Page() {
  /**
   * --------------------------------------------------------
   *  APP PHASE (CONNECTION + BOOTSTRAP)
   * --------------------------------------------------------
   */
  const [phase, setPhase] = useState<AppPhase>("boot");

  /**
   * --------------------------------------------------------
   *  SESSION REFS (PERSIST ACROSS RECONNECTS)
   * --------------------------------------------------------
   */
  const roomIdRef = useRef<string | null>(null);
  const joinedRoomIdRef = useRef<string | null>(null);
  const permaIdRef = useRef<string | null>(null);

  /**
   * --------------------------------------------------------
   *  STORE ACTIONS
   * --------------------------------------------------------
   */
  const {
    view,
    setView,
    setMode,
    setGameInstance,
    initializeGame,
    setRoomId,
    setMaxPlayers,
    setPlayerId,
  } = useGameStore();

  /**
   * --------------------------------------------------------
   *  INITIAL BOOTSTRAP + SOCKET LIFECYCLE
   * --------------------------------------------------------
   */
  useEffect(() => {
    roomIdRef.current = new URLSearchParams(window.location.search).get(
      "roomId"
    );
    joinedRoomIdRef.current = sessionStorage.getItem("joinedRoomId");
    permaIdRef.current = sessionStorage.getItem("playerId");

    const handleConnect = () => {
      setPhase("resolving");
      resolveSession();
    };

    const handleDisconnect = () => {
      setPhase("reconnecting");
      if (!socket.connected) {
        socket.connect();
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  /**
   * --------------------------------------------------------
   *  SESSION RESOLUTION (RUNS ON CONNECT + RECONNECT)
   * --------------------------------------------------------
   */
  const resolveSession = () => {
    const roomId = roomIdRef.current;
    const joinedRoomId = joinedRoomIdRef.current;
    const permaId = permaIdRef.current;

    /**
     * Cold entry (no room)
     */
    if (!roomId) {
      setView("home");
      setPhase("ready");
      return;
    }

    /**
     * Reconnect flow
     */

    if (joinedRoomId === roomId && permaId) {
      socket.emit(
        "reconnect_to_room",
        { roomId, permaId },
        (res: ReconnectResponse | { error: string }) => {
          if ("error" in res) {
            resetToHome();
            return;
          }
          if (res.game) {
            setPlayerId(socket.id || "");
            setMaxPlayers(res.maxPlayers);
            setRoomId(roomId);
            setView(res.game.started ? "game" : "lobby");
            initializeGame(res.game);
          }

          setPhase("ready");
        }
      );
      return;
    }

    /**
     * Fresh join → existence check
     */
    socket.emit("check_room", { roomId }, (res: CheckRoomResponse) => {
      if (!res.exists) {
        setView("roomNotFound");
      } else {
        setMode("join");
        setRoomId(roomId);
        setView("createJoin");
      }

      setPhase("ready");
    });
  };

  /**
   * --------------------------------------------------------
   *  IN-SESSION SOCKET EVENTS
   * --------------------------------------------------------
   */
  useEffect(() => {
    const handleLobbyUpdate = (data: LobbyUpdatePayload) => {
      setGameInstance(data.game);
      setMaxPlayers(data.maxPlayers);

      const player = data.game.players.find((p) => p.id === socket.id);

      // ✅ FIX: keep ref in sync with URL
      permaIdRef.current = player!.permaId;
      roomIdRef.current = data.roomId;
      joinedRoomIdRef.current = data.roomId;

      window.history.replaceState(
        {},
        document.title,
        `/?roomId=${data.roomId}`
      );

      if (!useGameStore.getState().gameInstance) {
        setView("lobby");
      }
    };

    const handleGameStart = (data: GameStartPayload) => {
      // sessionStorage.setItem("playerId", socketId);
      // sessionStorage.setItem("joinedRoomId", data.roomId);
      setPlayerId(socket.id || "");
      initializeGame(data.game);
      setView("game");
    };

    socket.on("lobby_update", handleLobbyUpdate);
    socket.on("game_start", handleGameStart);

    return () => {
      socket.off("lobby_update", handleLobbyUpdate);
      socket.off("game_start", handleGameStart);
    };
  }, []);

  /**
   * --------------------------------------------------------
   *  HELPERS
   * --------------------------------------------------------
   */
  const resetToHome = () => {
    sessionStorage.clear();
    setRoomId(null);
    setView("home");
    setPhase("ready");
  };

  /**
   * --------------------------------------------------------
   *  RENDER GATES
   * --------------------------------------------------------
   */
  if (phase === "boot" || phase === "resolving") {
    return <Loader />;
  }

  if (phase === "reconnecting") {
    return <DisconnectedView setPhase={setPhase} />;
  }

  /**
   * --------------------------------------------------------
   *  VIEW RESOLUTION
   * --------------------------------------------------------
   */
  const renderView = (): JSX.Element | null => {
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
      case "manualOrder":
        return <ManualOrder />;
      case "game":
        return <GameView />;
      case "roomNotFound":
        return <RoomNotFoundView />;
      default:
        return null;
    }
  };

  return <ViewTransition viewKey={view}>{renderView()}</ViewTransition>;
}
