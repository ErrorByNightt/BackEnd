import Express from "express";
import * as FriendRequest from '../controllers/FriendRequest.controller.js'
const router = Express.Router()

router.get('/friendRequests', FriendRequest.getAllFrienReq)
router.post('/friendRequests', FriendRequest.addNewFriendReq)
router.put('/friendRequests/:id', FriendRequest.updateStatus)
router.delete('/friendRequests/:id', FriendRequest.deleteReq)

export default router