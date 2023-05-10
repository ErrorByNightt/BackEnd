import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const ucqSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    answer1: {
        type: String,
        required: true,
    },
    answer2: {
        type: String,
        required: true,
    },
    answer3: {
        type: String,
        required: true,
    },
    answer4: {
        type: String,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    });

export default model("Ucq", ucqSchema)