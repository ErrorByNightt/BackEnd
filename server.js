import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import user from './routes/User.route.js';
import courses from './routes/Courses.route.js';
import ai from './routes/Ai.route.js';
import hangman from './routes/Hangman.route.js';
import blog from './routes/Blog.route.js';
import { v4 as uuidv4 } from 'uuid';
import {Server} from "socket.io";
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
//app.use(cors());



connectDb();

/*io.on("connection", (socket) => {
  console.log("connected!");
  socket.on("createRoom", async ({nickname}) => {
    console.log(nickname);
    // room is created
 /*   let room = new Room();
    let player = {
        sockeID: socket.id,
        nickname,
        playerType: 'X',

    };
    // player is stored in the room
    room.players.push(player);
    room.turn = player;
    // player is taken to the next screen*/
//  });


/*
const rooms = new Map();

io.on('connection', (socket) => {
  // Create a new room with the provided name and max number of players
  socket.on('createRoom', (name, maxPlayers) => {
    const roomId = uuidv4(); // generate a unique ID for the room
    const room = { id: roomId, name, maxPlayers, players: new Map() };
    rooms.set(roomId, room);
    socket.emit('roomCreated', roomId); // send the room ID back to the client
  });

  // Join an existing room with the provided ID and name
  socket.on('joinRoom', (roomId, name) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('roomNotFound');
      return;
    }
    if (room.players.size >= room.maxPlayers) {
      socket.emit('roomFull');
      return;
    }
    room.players.set(socket.id, name);
    socket.join(roomId);
    io.to(roomId).emit('playerJoined', { playerId: socket.id, playerName: name });
  });

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
*/
     


//bech taati acces lel dossier media li fih les images, localhost:9095/media/fifa.jpg
//app.use("/media/profile", express.static("media"));
//app.use("/media/courses", express.static("courses"));
//app.use('/blog-files', express.static('media'))

//allow to read files in folder uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '/uploads');
app.use('/uploads', express.static(publicDir));
app.use(cors());

//bech taati acces lel dossier media li fih les images, localhost:9095/media/fifa.jpg
//app.use("/media/profile", express.static("media"));
//app.use("/media/courses", express.static("courses"));
app.use('/uploads', express.static('media'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uuid = uuidv4();
console.log(uuid);




const rooms = new Map();

io.on('connection', (socket) => {
  // Create a new room with the provided name and max number of players
  socket.on('createRoom', async (name) => {
    console.log(name);
    try {
      let room = new Room();
      let player = {
        socketID:socket.id,
        name,
        playerType : 'DEFENSE'
      };
     room.players.push(player);
      room.turn = player;
      room = await room.save();
      console.log(room);
      const roomId = room._id.toString();
      socket.join(roomId);

      io.to(roomId).emit("createRoomSuccess",room);
    }catch (e){
      console.log(e);

    }
 });
socket.on('joinRoom',async({name,roomId})=>{
  try{
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


   // const roomId = uuidv4(); // generate a unique ID for the room
    //const room = { id: roomId, name, maxPlayers, players: new Map() };
   // rooms.set(roomId, room);
    //socket.emit('roomCreated', roomId); // send the room ID back to the client
 
  // Join an existing room with the provided ID and name
  /*socket.on('joinRoom', (roomId, name) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('roomNotFound');
      return;
    }
    if (room.players.size >= room.maxPlayers) {
      socket.emit('roomFull');
      return;
    }
    room.players.set(socket.id, name);
    socket.join(roomId);
    io.to(roomId).emit('playerJoined', { playerId: socket.id, playerName: name });
  });
*/
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
app.use("/hangman", hangman);
app.use("/blog", blog);

app.use(NotFoundError);
app.use(errorHandler);



server.listen(port, hostname, () => {
  console.log(`Server running on ${hostname}:${port}`);
});
