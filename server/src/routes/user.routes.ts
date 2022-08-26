import express from "express";
import {
	registerUser,
	authUser,
	allUsers,
	changeProfilePicture,
	changeUsername,
	muteUser,
	getMutedUsers,
	unmuteUser,
	sendFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
	removeFriend,
	fetchFriends,
	fetchOutgoingFriendRequests,
	fetchIncomingFriendRequests
} from "../controllers/user.controllers";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.route("/changeUsername").post(protect, changeUsername);
router.route("/changePic").post(protect, changeProfilePicture);
router.route("/muteUser").post(protect, muteUser);
router.route("/fetchMutedUsers").get(protect, getMutedUsers);
router.route("/unmuteUser").post(protect, unmuteUser);
router.route("/fetchFriends").get(protect, fetchFriends);
router.route("/sendFriendRequest").post(protect, sendFriendRequest);
router.route("/acceptFriendRequest").post(protect, acceptFriendRequest);
router.route("/declineFriendRequest").post(protect, declineFriendRequest);
router.route("/removeFriend").post(protect, removeFriend);
router.route("/fetchIncomingFriendRequests").get(protect, fetchIncomingFriendRequests);
router.route("/fetchOutgoingFriendRequests").get(protect, fetchOutgoingFriendRequests);

export default router;
