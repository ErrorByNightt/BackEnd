import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const BlogSchema =new Schema({
    username: {
      type: String  
      },
    //every user has their own socket id 
    
    title: {type: String},
    body: {type: String},
    coverImage:{type:String},
    like :{
      type: Number,default:0
    },
    share : {type : Number,default:0},
    comment : {type : Number,default:0},
    comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],


  });

  export default model("blog", BlogSchema)  

  