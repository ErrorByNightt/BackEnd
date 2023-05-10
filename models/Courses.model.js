import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const coursesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
      type: String,
      required: true,
  },
  date: {
    type: Date,
    required: true,
},

nbpage: {
    type: Number,
    required: true,
},

language: {
    type: String,
    enum: {
      values: ['Java', 'C#', 'Python', 'Dart', 'Swift', 'Kotlin'],
    }
},
   
    },
    {
        timestamps: true
    });

export default model("Courses", coursesSchema)