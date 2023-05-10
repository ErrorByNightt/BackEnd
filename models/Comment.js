import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;
const CommentSchema =new Schema({

    text: {type: String},
    createdAt: { type: Date, default: Date.now },



  });

  export default model("comment", CommentSchema)  