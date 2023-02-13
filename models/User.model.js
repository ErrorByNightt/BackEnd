import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String
    },
    userName: {
        type: String
    },
    Image: {
        type: String
    },
    mail: {
        type: String
    },
    password: {
        type: String
    },
    balance: {
        type: Number
    },
    walletID: {
        type: Number
    },
    birthDate: {
        type: Date
    },
    },
    {
        timestamps: true
    });

export default model("User", userSchema)