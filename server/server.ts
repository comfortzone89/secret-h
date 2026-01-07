import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import http from "http";
import { Server, Socket } from "socket.io";
import { Game } from "./lib/Game.js";
import type { LobbyPlayer, Player } from "./types/index.js";
import { generateRoomId } from "./helpers/index.js";
import { Lobby } from "./lib/Lobby.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

// Environment variables
const PORT = Number(process.env.SOCKET_PORT) || 3001;
// In dev, allow localhost:3000 (Next.js dev server)
// In production, allow all origins because Nginx/Ingress handles same-origin
const FRONTEND_ORIGIN =
  process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_ORIGIN || "http://localhost:3000"
    : "*";

interface GameRoom {
  id: string;
  hostId: string;
  maxPlayers: number;
  players: Player[];
  started: boolean;
  game?: Game;
}

const httpServer = http.createServer();

const io = new Server(httpServer, {
  path: "/socket.io",
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const rooms: Record<string, GameRoom> = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", ({ playerId }) => {
    socket.data.playerId = playerId;
  });

  // Check that the room exists
  socket.on("check_room", ({ roomId }, cb) => {
    const exists =
      !!rooms[roomId] || // if you're tracking rooms yourself
      io.sockets.adapter.rooms.has(roomId); // adapter-level check
    if (typeof cb === "function") cb({ exists });
    else socket.emit("room_check_result", { exists });
  });

  // CREATE GAME
  socket.on(
    "create_game",
    (
      data: { name: string; maxPlayers: number; portrait: string },
      callback
    ) => {
      const { name, maxPlayers, portrait } = data;
      const roomId = generateRoomId();
      const player: LobbyPlayer = {
        id: socket.id,
        permaId: socket.id,
        name,
        portrait,
      };

      const room: Lobby = {
        id: roomId,
        hostId: socket.id,
        maxPlayers,
        players: [player],
        started: false,
      };

      rooms[roomId] = room;
      socket.join(roomId);

      // ✅ Store the roomId in the socket
      socket.data.roomId = roomId;
      console.log("Socket data:", socket.data);

      console.log(`${name} created room ${roomId}`);

      // Return room info to creator
      callback({ roomId, players: room.players });

      // Update the room
      io.in(roomId).emit("lobby_update", {
        players: room.players,
        maxPlayers: room.maxPlayers,
        roomId: room.id,
      });
    }
  );

  // JOIN GAME
  socket.on(
    "join_game",
    (data: { name: string; roomId: string; portrait: string }, callback) => {
      const { name, roomId, portrait } = data;
      const room = rooms[roomId];
      socket.data.roomId = roomId;
      if (!room) return callback({ error: "Room not found." });
      if (room.started) return callback({ error: "Game already started." });
      if (room.players.length >= room.maxPlayers)
        return callback({ error: "Room full" });

      const player: LobbyPlayer = {
        id: socket.id,
        permaId: socket.id,
        name,
        portrait,
      };
      room.players.push(player);
      socket.join(roomId);

      console.log(`${name} joined room ${roomId}`);

      callback({ roomId, players: room.players });

      io.in(roomId).emit("lobby_update", {
        players: room.players,
        maxPlayers: room.maxPlayers,
        roomId: room.id,
      });

      // --- START GAME IF ROOM FULL ---
      if (room.players.length === room.maxPlayers) {
        room.started = true;

        // Create Game instance (roles assigned automatically)
        room.game = new Game(
          roomId,
          room.hostId,
          room.players.map((p) => ({
            id: p.id,
            permaId: p.permaId,
            name: p.name,
            portrait: p.portrait,
            vote: null,
          }))
        );

        console.log("game instance created:", room.game);

        // Emit roles directly to each player
        room.players.forEach((player) => {
          const gamePlayer = room.game!.players.find((p) => p.id === player.id);
          if (gamePlayer) {
            io.to(player.id!).emit("role_assignment", {
              role: gamePlayer.role,
              party: gamePlayer.party,
              vote: null,
            });
          }
        });

        // Notify everyone the game is starting
        io.in(roomId).emit("game_start", {
          roomId: room.id,
          players: room.game.players.map((p) => ({
            id: p.id,
            name: p.name,
            portrait: p.portrait,
            vote: null,
          })),
          hostId: room.hostId,
          game: room.game,
        });
      }
    }
  );

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    // Mark disconnected, do NOT remove
    player.id = null;

    io.in(roomId).emit("player_disconnected", {
      id: player.id,
    });

    // Grace period cleanup
    setTimeout(() => {
      const stillDisconnected =
        room.players.find((p) => p.id === player.id)?.id === null;

      if (stillDisconnected) {
        room.players = room.players.filter((p) => p.id !== player.id);

        io.in(roomId).emit("lobby_update", {
          players: room.players,
          maxPlayers: room.maxPlayers,
          roomId: room.id,
        });

        if (room.players.length === 0) {
          delete rooms[roomId];
        }
      }
    }, 30_000);
  });

  socket.on(
    "reconnect_to_room",
    (
      { roomId, permaId }: { roomId: string; permaId: string },
      callback: (
        res:
          | {
              success: true;
              room: GameRoom;
              game?: Game;
            }
          | { error: string; code: "NOT_IN_ROOM" | "ROOM_NOT_FOUND" }
      ) => void
    ) => {
      console.log("Reconnect attempt:", { roomId, permaId });
      const room = rooms[roomId];
      if (!room) {
        return callback({ error: "Room not found", code: "ROOM_NOT_FOUND" });
      }

      const player = room.players.find((p) => p.permaId === permaId);

      // 🔴 HARD STOP — DO NOT JOIN ROOM
      if (!player) {
        return callback({
          error: "Player not in room",
          code: "NOT_IN_ROOM",
        });
      }

      // ✅ Valid reconnect
      player.id = socket.id;
      socket.data.roomId = roomId;

      if (room.game) {
        const gamePlayer = room.game.players.find((p) => p.permaId === permaId);

        if (gamePlayer) {
          gamePlayer.id = socket.id;
        }
      }

      socket.join(roomId);

      // Fix host reassignment
      if (room.hostId === null || room.hostId === player.id) {
        room.hostId = socket.id;
      }

      // ✅ Notify others that this player has reconnected (optional)
      io.to(roomId).emit("game_update", room.game);

      callback({
        success: true,
        room,
        game: room.game,
      });
    }
  );

  socket.on("startNewRound", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.startNewRound();

    io.to(roomId).emit("game_update", room.game);
  });

  socket.on("setPhase", ({ roomId, playerIndex, playerId, phase }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.setPhase(playerIndex, phase);

    io.to(playerId).emit("game_update", room.game);
  });

  socket.on("setModal", ({ roomId, playerIndex, playerId, modal }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.setModal(playerIndex, modal);

    io.to(playerId).emit("game_update", room.game);
  });

  socket.on("handleRoleModalClose", ({ roomId, playerIndex, playerId }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    const allConfirmed = room.game.handleRoleModalClose(playerIndex);

    // Always update the confirming player
    io.to(playerId).emit("game_update", room.game);

    // Only update everyone else when all confirmed
    if (allConfirmed) {
      io.in(roomId).emit("game_update", room.game);
    }
  });

  socket.on(
    "setStatusBanner",
    ({ roomId, playerId, statusBanner, single = true }) => {
      const room = rooms[roomId];
      if (!room || !room.game) return;

      room.game.setStatusBannerAll(statusBanner.text, statusBanner.loading);

      io.in(single ? playerId : roomId).emit("game_update", room.game);
    }
  );

  // SELECT CHANCELLOR
  socket.on(
    "handleNominateChancellorModalClose",
    ({ roomId, chancellorId }) => {
      const room = rooms[roomId];
      if (!room || !room.game) return;

      // Ensure this player is the current president
      const president = room.game.players[room.game.currentPresidentIndex!];
      if (president.id !== socket.id) {
        console.warn("Non-president tried to select chancellor:", socket.id);
        return;
      }

      room.game.handleNominateChancellorModalClose(chancellorId);

      io.in(roomId).emit("game_update", room.game);
    }
  );

  socket.on(
    "handleVoteModalClose",
    ({ roomId, playerIndex, playerId, vote }) => {
      const room = rooms[roomId];
      if (!room || !room.game) return;

      const allVoted = room.game.handleVoteModalClose(playerIndex, vote);

      io.in(allVoted ? roomId : playerId).emit("game_update", room.game);
    }
  );

  socket.on("handleShowPresidentHand", ({ roomId, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleShowPresidentHand(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handlePresidentHandModalClose",
    ({ roomId, playerIndex, discard }) => {
      const room = rooms[roomId];
      if (!room || !room.game) return;

      room.game.handlePresidentHandModalClose(playerIndex, discard);

      io.in(roomId).emit("game_update", room.game);
    }
  );

  socket.on("handleChancellorHandModalClose", ({ roomId, enact }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleChancellorHandModalClose(enact);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handleElectionTrackerModalClose",
    ({ roomId, playerIndex, playerId }) => {
      const room = rooms[roomId];
      if (!room || !room.game) return;

      const updateRoom = room.game.handleElectionTrackerModalClose(playerIndex);

      io.in(updateRoom ? roomId : playerId).emit("game_update", room.game);
    }
  );

  socket.on(
    "handlePolicyEnactedModalClose",
    ({ roomId, playerIndex, playerId }) => {
      const room = rooms[roomId];
      if (!room || !room.game) return;

      room.game.handlePolicyEnactedModalClose(playerIndex);

      io.in(playerId).emit("game_update", room.game);
    }
  );

  socket.on("handlePeekModalClose", ({ roomId, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handlePeekModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleInvestigateModalClose", ({ roomId, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleInvestigateModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleInvestigateResultModalClose", ({ roomId, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleInvestigateResultModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handleSpecialElectionModalClose",
    ({ roomId, newPresidentIndex }) => {
      const room = rooms[roomId];
      if (!room || !room.game) return;

      room.game.handleSpecialElectionModalClose(newPresidentIndex);

      io.in(roomId).emit("game_update", room.game);
    }
  );

  socket.on("handleExecutionModalClose", ({ roomId, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleExecutionModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleExecutionResultModalClose", ({ roomId, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleExecutionResultModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleVetoUnlockedModalClose", ({ roomId, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleVetoUnlockedModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleVeto", ({ roomId, playerIndex }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleVeto(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handleProposeVetoModalClose",
    ({ roomId, playerIndex, oblige }) => {
      const room = rooms[roomId];
      if (!room || !room.game) return;

      room.game.handleProposeVetoModalClose(playerIndex, oblige);

      io.in(roomId).emit("game_update", room.game);
    }
  );

  socket.on("gameEnded", ({ roomId, playerId, action }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    if (action === "restart") {
      room.game = new Game(
        roomId,
        room.hostId,
        room.game.players.map((p) => ({
          id: p.id,
          permaId: p.permaId,
          name: p.name,
          portrait: p.portrait,
          vote: null,
        }))
      );
    }

    if (action === "lobby") {
      room.game.playerLeft = true;
      socket.leave(roomId);
      io.in(playerId).emit("game_update", room.game, "home");
    }

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleEndTerm", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || !room.game) return;

    room.game.handleEndTerm();

    io.in(roomId).emit("game_update", room.game);
  });
});

httpServer.listen(PORT, "0.0.0.0", () =>
  console.log(`Socket.io server running on port ${PORT}`)
);
