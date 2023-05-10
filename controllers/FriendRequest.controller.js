import User from '../models/User.model.js';
import FriendRequest from '../models/friendRequest.js';

import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

let friendRequests = [];


//returns a list of all friend requests
export async function getAllFrienReq(req, res) {
  try {
    const docs = await FriendRequest.find({}).lean();
    const array = [];
    for (let index = 0; index < docs.length; index++) {
      const user = await User.find({ _id: docs[index].senderId }).lean();
      array.push(user);
    }
    res.status(200).json({ docs, array });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

//adds a new friend request
export async function addNewFriendReq(req, res) {
  var mail = req.body.mail
  const user = await User.findOne({ mail })
  const receiverId = user.id;
  const senderId = req.body.senderId;
  const friendRequest = new FriendRequest({
    senderId: senderId,
    receiverId: receiverId,
    status: "pending"
  })
  friendRequest.save()
    .then(frreq => {
      res.status(200).json({ frreq: frreq })
    })
    .catch(err => {
      res.json({
        error: err
      })
    })
}


//updates the status of a friend request with the specified ID
export async function updateStatus(req, res) {
  const id = req.params.id;
  const status = req.body.status;
  const friendRequest = await FriendRequest.findOneAndUpdate(
    { _id: id },
    {
      status: status
    },
    { new: true } // return the updated request object
  );
  friendRequest.save().then(docs => {
    docs.status = status
    res.status(200).json({
      message: "Accepted"
    })
  })
}


//deletes the friend request with the specified ID
export async function deleteReq(req, res) {
  const id = req.params.id;
  const friendRequestIndex = friendRequests.findIndex(request => request.id === id);
  if (friendRequestIndex !== -1) {
    friendRequests.splice(friendRequestIndex, 1);
    res.status(200).send();
  } else {
    res.status(404).send();
  }
}
