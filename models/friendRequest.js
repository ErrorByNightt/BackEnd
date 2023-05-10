import mongoose, { mongo } from 'mongoose';

const { Schema, model } = mongoose;

const friendRequestSchema  = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
      },
},
    {
        timestamps: true
    });

    export default model("FriendRequest", friendRequestSchema)