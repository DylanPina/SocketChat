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

export default router;
