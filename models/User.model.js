import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },

    userName: {
        type: String,
        required: true,
    },
    Image: {
        type: String
    },
    mail: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number
    },
    walletID: {
        type: Number
    },
    birthDate: {
        type: Date,
        required: true,
    },
    rank: {
        type: String,
        default: 'Unranked',
        enum: {
            values: ['Unranked', 'Bronze', 'Silver', 'Gold'],
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    etat: {
        type: String,
        default: 'active',
        enum: {
            values: ['banned', 'active', 'deactivated'],
        }
    },

    otp: {
        type: Number,
        default: '2456'
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    achievements: [{ type: Schema.Types.ObjectId, ref: "Achievements" }],
    badges: [{ type: Schema.Types.ObjectId, ref: "Badges" }],
    courses: [{ type: Schema.Types.ObjectId, ref: "Courses" }],
    gamesPlayed: [{ type: Schema.Types.ObjectId, ref: "Jeux" }]
},
    {
        timestamps: true
    });

export default model("User", userSchema)