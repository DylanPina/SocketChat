import express from "express";
import {
	sendMessage,
	allMessages,
	sendNotification,
	fetchNotifications,
	removeNotification,
	removeAllNotifications,
	removeNotificationsByChat,
} from "../controllers/message.controllers";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/notifications/send").post(protect, sendNotification);
router.route("/notifications/fetch").get(protect, fetchNotifications);
router.route("/notifications/removeOne").post(protect, removeNotification);
router.route("/notifications/removeByChat").post(protect, removeNotificationsByChat);
router.route("/notifications/removeAll").delete(protect, removeAllNotifications);

export default router;
