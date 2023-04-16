import mongoose, { mongo } from 'mongoose';
import player from '../models/Player.js';
const { Schema, model } = mongoose;

const roomSchema = new Schema({
    //how long is the room , how many players.. (2)
  occupancy: {
    type: Number,
    default: 2,
  },
  maxRounds: {
    type: Number,
    default: 6,
  },
  currentRound: {
    required: true,
    type: Number,
    default: 1,
  },
  players : {type : [player.Schema]},

  isJoin: {
    type: Boolean,
    default: true,
  },
  
 // turn: { type : player.schema},
  turnIndex: {
    type: Number,
    default: 0,
  },
});

export default model("Room", roomSchema)