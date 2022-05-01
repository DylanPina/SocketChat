const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");

const accessChat = asyncHandler(async (req, res) => {
	// Extract userID from request body
	const { userId } = req.body;

	// Check if userID exsists
	if (!userId) {
		console.log("UserID param not sent with request");
		return res.sendStatus(400);
	}

	// Checking if chat already exists with current user
	// If the user is not in the chat, populate the chat with user
	var isChat = await Chat.find({
		isGroupChat: false,
		$and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }],
	})
		.populate("users", "-password")
		.populate("latestMessage");

	isChat = await User.populate(isChat, {
		path: "latestMessage.sender",
		select: "username profilePic email",
	});

	// Checking to see if chat exists
	if (isChat.length > 0) {
		// Send back the chat
		res.send(isChat[0]);
	} else {
		// Otherwise we create a new chat
		var chatData = {
			chatName: "sender",
			isGroupChat: false,
			users: [req.user._id, userId],
		};
		try {
			// Store it in DB
			const createdChat = await Chat.create(chatData);
			// Send created chat to user and populate user array
			const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
			res.status(200).send(FullChat);
		} catch (error) {
			res.status(400).send({ error: error });
		}
	}
});

const fetchChats = asyncHandler(async (req, res) => {
	try {
		// Fetch all user's chats then populate the chat model with user data
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMessage")
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: "latestMessage.sender",
					select: "username profilePic email",
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400).send({ error: error });
	}
});

module.exports = { accessChat, fetchChats };
