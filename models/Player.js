import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const playerSchema = Schema({
    name: {
      type: String,
      trim: true,
    },
    //every user has their own socket id 
    
    socketID: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    playerType: {
      required: true,
      type: String,
    },
  });
  export default model("player", playerSchema)  

