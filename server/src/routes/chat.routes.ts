export {};
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { accessChat, fetchChats, createGroupChat } = require("../controllers/chat.controllers");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
// router.route("/grouprename").put(protect, renameGroup);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
