import express from "express";
import { registerUser, authUser, allUsers, changeProfilePicture } from "../controllers/user.controllers";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.post("/changePic", changeProfilePicture);

export default router;
