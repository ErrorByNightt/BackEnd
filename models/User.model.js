import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
    },

    userName: {
        type: String,
        required: false,
    },
    Image: {
        type: String
    },
    mail: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    balance: {
        type: Number
    },
    walletID: {
        type: Number
    },
    birthDate: {
        type: Date,
        required: false,
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
    city: {
        type: String
    }, 
    job: {
        type: String
    }, 
    school: {
        type: String
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