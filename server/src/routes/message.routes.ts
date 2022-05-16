import express from "express";
import { sendMessage, allMessages } from "../controllers/message.controllers";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

export default router;
