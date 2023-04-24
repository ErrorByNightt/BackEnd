import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import user from './routes/User.route.js';
import courses from './routes/Courses.route.js';
import ai from './routes/Ai.route.js';
import code from './routes/Coding.route.js';
import compile from './routes/Compile.route.js';

import hangman from './routes/Hangman.route.js';
import blog from './routes/Blog.route.js';
import { Server } from "socket.io";
import { createServer } from 'http';
import morgan from "morgan";
import connectDb from "./config/db.js";

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

import { NotFoundError, errorHandler } from "./middlewares/error-handler.js";
import Room from "./models/Room.js";

//import Room from "./models/Room.js";
//import Player from "./models/Player.js";

const app = express();

dotenv.config();
// badel hedhi ki bech taamel docker-compose up DOCKERSERVERURL
const hostname = process.env.SERVERURL;
const port = process.env.SERVERPORT;

const server = createServer(app);
const io = new Server(server);

//info on req : GET /route ms -25
app.use(morgan("tiny"));

app.use(cors());
connectDb();

//allow to read files in folder uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '/uploads');
app.use('/uploads', express.static(publicDir));

//bech taati acces lel dossier media li fih les images, localhost:9095/media/fifa.jpg
app.use("/uploads", express.static("media"));
//app.use("/media/courses", express.static("courses"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const rooms = new Map();

io.on('connection', (socket) => {
  // Create a new room with the provided name and max number of players
  socket.on('createRoom', async (name) => {
    console.log(name);
    try {
      let room = new Room();
      let player = {
        socketID: socket.id,
        name,
        playerType: 'DEFENSE'
      };
      room.players.push(player);
      room.turn = player;
      room = await room.save();
      console.log(room);
      const roomId = room._id.toString();
      socket.join(roomId);

      io.to(roomId).emit("createRoomSuccess", room);
    } catch (e) {
      console.log(e);

    }
  });
  socket.on('joinRoom', async ({ name, roomId }) => {
    try {
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        socket.emit("errorOccurred", "Please enter a valid room ID.");
        return;
      }
      let room = await Room.findById(roomId);
      if (room.isJoin) {
        let player = {
          name,
          socketID: socket.id,
          playerType: "ATTACK",
        };
        socket.join(roomId);
        room.players.push(player);
        room.isJoin = false;
        room = await room.save();
        io.to(roomId).emit("joinRoomSuccess", room);
        io.to(roomId).emit("updatePlayers", room.players);
        io.to(roomId).emit("updateRoom", room);
      } else {
        socket.emit(
          "errorOccurred",
          "The game is in progress, try again later."
        );
      }
    } catch (e) {
      console.log(e);
    }
  })
  // Disconnect from the server and leave any active room
  socket.on('disconnect', () => {
    for (const [roomId, room] of rooms.entries()) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        io.to(roomId).emit('playerLeft', socket.id);
      }
    }
  });
});

//BSH TESTI 
app.use("/user", user);
app.use("/courses", courses);
app.use("/ai", ai);
app.use("/code", code);
app.use("/compile", compile);
app.use("/hangman", hangman);
app.use("/blog", blog);

app.use(NotFoundError);
app.use(errorHandler);

server.listen(port, hostname, () => {
  console.log(`Server running on ${hostname}:${port}`);
});