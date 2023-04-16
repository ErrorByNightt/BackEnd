import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const hangSchema = new Schema({
    word: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    });

export default model("hangman", hangSchema)