import express from "express";
import { registerUser, authUser, allUsers, changeProfilePicture, changeUsername } from "../controllers/user.controllers";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.route("/changeUsername").post(protect, changeUsername);
router.route("/changePic").post(protect, changeProfilePicture);

export default router;
