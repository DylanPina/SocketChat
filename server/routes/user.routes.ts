export {};
const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/user.controllers");
const { protectPassword } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protectPassword, allUsers);
router.post("/login", authUser);

module.exports = router;
