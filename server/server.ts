import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import http from "http";
import { Server, Socket } from "socket.io";

import { RoomManager } from "./lib/RoomManager.js";
import { Room } from "./lib/Room.js";
import { Game } from "./lib/Game.js";
import type { LobbyPlayer } from "./types/index.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

const PORT = Number(process.env.SOCKET_PORT) || 3001;
const DELETE_ROOM_AFTER_MS = 1000 * 60 * 60; // 1 hour

const httpServer = http.createServer();
const io = new Server(httpServer, {
  path: "/socket.io",
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const roomManager = new RoomManager();

/* ----------------------------------------------------
   HELPERS
---------------------------------------------------- */

function emitLobbyUpdate(room: Room) {
  io.in(room.id).emit("lobby_update", {
    game: room.game,
    maxPlayers: room.maxPlayers,
    roomId: room.id,
    hostId: room.hostId,
  });
}

function startGameInRoom(room: Room) {
  room.game.players = room.connectedPlayers;
  if (room.playerOrder === "manual") {
    const hostId = room.game.players.find((p) => p.permaId === room.hostId)?.id;
    setTimeout(() => {
      io.to(hostId!).emit("manual_order", {
        game: room.game,
      });
    }, 10);
  } else {
    room.game.startGame();

    io.in(room.id).emit("game_start", {
      roomId: room.id,
      players: room.game.players,
      hostId: room.hostId,
      game: room.game,
    });
  }
}

/* ----------------------------------------------------
   SOCKET CONNECTION
---------------------------------------------------- */

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  /* -----------------------------
     CHECK ROOM
  ----------------------------- */
  socket.on("check_room", ({ roomId }, cb) => {
    cb({ exists: roomManager.exists(roomId) });
  });

  /* -----------------------------
     CREATE GAME
  ----------------------------- */
  socket.on(
    "create_game",
    ({ name, maxPlayers, portrait, playerOrder, roomId }, callback) => {
      if (roomManager.exists(roomId)) {
        return callback({ error: "Game name already exists." });
      }

      const room = roomManager.createRoom({
        id: roomId,
        hostId: socket.id,
        maxPlayers,
        playerOrder,
      });

      const game = room.game;

      game.addPlayers([
        {
          id: socket.id,
          permaId: socket.id,
          name,
          portrait,
          connected: true,
        },
      ]);

      socket.join(room.id);
      socket.data.roomId = room.id;

      callback({ roomId: room.id, game: game });

      emitLobbyUpdate(room);
    }
  );

  /* -----------------------------
     JOIN GAME
  ----------------------------- */
  socket.on(
    "join_game",
    (
      {
        name,
        roomId,
        portrait,
      }: { name: string; roomId: string; portrait: string },
      callback
    ) => {
      const room = roomManager.get(roomId);
      if (!room) return callback({ error: "Room not found." });
      if (room.game.started)
        return callback({ error: "Game already started." });
      if (room.isFull) return callback({ error: "Room is full." });

      if (room.game.players.some((p) => p.name === name)) {
        return callback({
          error: "Name exists in the room already.",
        });
      }

      if (
        room.game.players.some(
          (p) =>
            p.portrait === portrait && !portrait.includes("player-portrait-0")
        )
      ) {
        return callback({ error: "Portrait exists in the room already." });
      }

      const player: LobbyPlayer = {
        id: socket.id,
        permaId: socket.id,
        name,
        portrait,
        connected: true,
      };

      if (player) {
        room.cancelDeletion();
      } else {
        return callback({ error: "Player could not be added." });
      }

      room.game.addPlayers([player]);
      socket.join(room.id);
      socket.data.roomId = room.id;

      callback({
        roomId: room.id,
        players: room.game.players,
        resPlayerOrder: room.playerOrder,
      });
      emitLobbyUpdate(room);

      if (room.isFull) {
        startGameInRoom(room);
      }
    }
  );

  /* -----------------------------
     MANUAL GAME START
  ----------------------------- */
  socket.on("start_manual_game", ({ roomId, playersId }) => {
    const room = roomManager.get(roomId);
    if (!room) return;

    room.game.startGame(playersId);

    io.in(room.id).emit("game_start", {
      roomId: room.id,
      players: room.game.players,
      hostId: room.hostId,
      game: room.game,
    });
  });

  /* -----------------------------
     DISCONNECT
  ----------------------------- */
  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = roomManager.get(roomId);
    if (!room) return;

    room.game.markDisconnected(socket.id);

    io.in(room.id).emit("player_disconnected", {
      players: room.game.players,
      game: room.game,
    });

    if (room.isEmpty) {
      room.scheduleDeletion(DELETE_ROOM_AFTER_MS, () => {
        roomManager.deleteRoom(room.id);
      });
    }
  });

  /* -----------------------------
     RECONNECT
  ----------------------------- */
  socket.on(
    "reconnect_to_room",
    ({ roomId, permaId }: { roomId: string; permaId: string }, callback) => {
      const room = roomManager.get(roomId);
      if (!room) {
        return callback({ error: "Room not found", code: "ROOM_NOT_FOUND" });
      }

      const player = room.game.reconnectPlayer(permaId, socket.id);
      if (player) {
        room.cancelDeletion();
      } else {
        return callback({ error: "Player not in room", code: "NOT_IN_ROOM" });
      }

      socket.join(room.id);
      socket.data.roomId = room.id;

      if (room.game.started && room.game) {
        const gamePlayer = room.game.players.find((p) => p.permaId === permaId);
        if (gamePlayer) gamePlayer.id = socket.id;
        io.in(room.id).emit("game_update", room.game);
      } else {
        emitLobbyUpdate(room);

        if (room.isFull) {
          startGameInRoom(room);
        }
      }

      callback({
        success: true,
        game: room.game,
        maxPlayers: room.maxPlayers,
      });
    }
  );

  /* ----------------------------------------------------
     GAME EVENTS
     (UNCHANGED — these already belong to Game)
  ---------------------------------------------------- */

  socket.on("startNewRound", ({ roomId }) => {
    const room = roomManager.get(roomId);
    if (!room?.game) return;

    room.game.startNewRound();
    io.in(room.id).emit("game_update", room.game);
  });

  socket.on("setPhase", ({ roomId, playerIndex, playerId, phase }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.setPhase(playerIndex, phase);

    io.to(playerId).emit("game_update", room.game);
  });

  socket.on("setModal", ({ roomId, playerIndex, playerId, modal }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.setModal(playerIndex, modal);

    io.to(playerId).emit("game_update", room.game);
  });

  socket.on("handleRoleModalClose", ({ roomId, playerIndex, playerId }) => {
    const room = roomManager.get(roomId);
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
      const room = roomManager.get(roomId);
      if (!room || !room.game) return;

      room.game.setStatusBannerAll(statusBanner.text, statusBanner.loading);

      io.in(single ? playerId : roomId).emit("game_update", room.game);
    }
  );

  // SELECT CHANCELLOR
  socket.on(
    "handleNominateChancellorModalClose",
    ({ roomId, chancellorId }) => {
      const room = roomManager.get(roomId);
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
      const room = roomManager.get(roomId);
      if (!room || !room.game) return;

      const allVoted = room.game.handleVoteModalClose(playerIndex, vote);

      io.in(allVoted ? roomId : playerId).emit("game_update", room.game);
    }
  );

  socket.on("handleShowPresidentHand", ({ roomId, playerIndex }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleShowPresidentHand(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handlePresidentHandModalClose",
    ({ roomId, playerIndex, discard }) => {
      const room = roomManager.get(roomId);
      if (!room || !room.game) return;

      room.game.handlePresidentHandModalClose(playerIndex, discard);

      io.in(roomId).emit("game_update", room.game);
    }
  );

  socket.on("handleChancellorHandModalClose", ({ roomId, enact }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleChancellorHandModalClose(enact);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handleElectionTrackerModalClose",
    ({ roomId, playerIndex, playerId }) => {
      const room = roomManager.get(roomId);
      if (!room || !room.game) return;

      const updateRoom = room.game.handleElectionTrackerModalClose(playerIndex);

      io.in(updateRoom ? roomId : playerId).emit("game_update", room.game);
    }
  );

  socket.on(
    "handlePolicyEnactedModalClose",
    ({ roomId, playerIndex, playerId }) => {
      const room = roomManager.get(roomId);
      if (!room || !room.game) return;

      room.game.handlePolicyEnactedModalClose(playerIndex);

      io.in(playerId).emit("game_update", room.game);
    }
  );

  socket.on("handlePeekModalClose", ({ roomId, playerIndex }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handlePeekModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleInvestigateModalClose", ({ roomId, playerIndex }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleInvestigateModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleInvestigateResultModalClose", ({ roomId, playerIndex }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleInvestigateResultModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handleSpecialElectionModalClose",
    ({ roomId, newPresidentIndex }) => {
      const room = roomManager.get(roomId);
      if (!room || !room.game) return;

      room.game.handleSpecialElectionModalClose(newPresidentIndex);

      io.in(roomId).emit("game_update", room.game);
    }
  );

  socket.on("handleExecutionModalClose", ({ roomId, playerIndex }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleExecutionModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleExecutionResultModalClose", ({ roomId, playerIndex }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleExecutionResultModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleVetoUnlockedModalClose", ({ roomId, playerIndex }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleVetoUnlockedModalClose(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleVeto", ({ roomId, playerIndex }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleVeto(playerIndex);

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handleProposeVetoModalClose",
    ({ roomId, playerIndex, oblige }) => {
      const room = roomManager.get(roomId);
      if (!room || !room.game) return;

      room.game.handleProposeVetoModalClose(playerIndex, oblige);

      io.in(roomId).emit("game_update", room.game);
    }
  );

  socket.on("gameEnded", ({ roomId, playerId, action }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    if (action === "restart") {
      const players = room.game.players;
      room.game = new Game(roomId, room.hostId);

      room.game.addPlayers(players);
      if (room.playerOrder === "manual") {
        const playersId: string[] = [];
        players.forEach((p) => {
          playersId.push(p.id!);
        });
        room.game.startGame(playersId);
      } else {
        room.game.startGame();
      }
    }

    if (action === "lobby") {
      room.game.playerLeft = true;
      socket.leave(roomId);
      io.in(playerId).emit("game_update", room.game, "home");
    }

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on("handleEndTerm", ({ roomId }) => {
    const room = roomManager.get(roomId);
    if (!room || !room.game) return;

    room.game.handleEndTerm();

    io.in(roomId).emit("game_update", room.game);
  });

  socket.on(
    "handleShowAffiliationModal",
    ({ roomId, playerId, playerIndex, show }) => {
      const room = roomManager.get(roomId);
      if (!room || !room.game) return;

      room.game.handleShowAffiliationModal(playerIndex, show);

      io.in(playerId).emit("game_update", room.game);
    }
  );
});

httpServer.listen(PORT, "0.0.0.0", () =>
  console.log(`Socket.io server running on port ${PORT}`)
);
