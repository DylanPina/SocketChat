const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
import { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, fetchChatById,deleteOneOnOneChat, deleteGroupChat } from "../controllers/chat.controllers";

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/:chatId").get(protect, fetchChatById);
router.route("/group").post(protect, createGroupChat);
router.route("/grouprename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/deleteOneOnOneChat").post(protect, deleteOneOnOneChat);
router.route("/deleteGroupChat").post(protect, deleteGroupChat);

export default router;
