const asyncHandler = require("express-async-handler");
import Chat from "../models/chat.model";
import Message from "../models/message.model";
import User from "../models/user.model";
import { allMessages } from "./message.controllers";

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
		} catch (error: any) {
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
	} catch (error: any) {
		res.status(400).send({ error: error });
	}
});

const fetchChatById = asyncHandler(async (req, res) => {
	try {
		// Fetch all user's from the chat then populate the chat model with user data
		Chat.find({ _id: req.params.chatId })
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
	} catch (error: any) {
		res.status(400).send({ error: error });
	}
});

const createGroupChat = asyncHandler(async (req, res) => {
	// Check to see if users and groupchat name were passed in
	if (!req.body.users || !req.body.name) {
		return res.status(400).send({ message: "Please fill out the fields" });
	}

	// Parse incoming users into an object
	var users = JSON.parse(req.body.users);

	// Check if there are more than 2 users
	if (users.length < 2) {
		return res.status(400).send("More than 2 users are required to make a groupchat");
	}

	// Push the current user into the groupchat
	users.push(req.user);

	try {
		// Make a new groupchat
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users: users,
			isGroupChat: true,
			groupAdmin: req.user, // The groupchat admin will be the user sending the request
		});

		// Populate the groupchat and send result back to user
		const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");

		res.status(200).json(fullGroupChat);
	} catch (error: any) {
		res.status(400).send({ error: error });
	}
});

const renameGroup = asyncHandler(async (req, res) => {
	// Extract chatID & the new group chat name from request body
	const { chatId, newChatName } = req.body;

	// Find and update the name of the groupchat
	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{
			chatName: newChatName,
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!updatedChat) {
		res.status(404);
		throw new Error("Chat not found");
	} else {
		res.status(200).json(updatedChat);
	}
});

const addToGroup = asyncHandler(async (req, res) => {
	// Extract chatID and userID from request body
	const { chatId, userId } = req.body;

	// Add the user who's ID was passed into body into the chat
	const added = await Chat.findByIdAndUpdate(
		chatId,
		{
			$push: { users: userId },
		},
		{ new: true }
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	// Check if groupchat was found and send data back to client
	if (!added) {
		res.status(404);
		throw new Error("Chat Not Found");
	} else {
		res.status(200).json(added);
	}
});

const removeFromGroup = asyncHandler(async (req, res) => {
	// Extract chatID and userID from request body
	const { chatId, userId } = req.body;

	// Add the user who's ID was passed into body into the chat
	const removed = await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull: { users: userId },
		},
		{ new: true }
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	// Check if groupchat was found and send data back to client
	if (!removed) {
		res.status(400);
		throw new Error("Failed to remove user from group");
	} else {
		res.status(200).json(removed);
	}
});

const deleteOneOnOneChat = asyncHandler(async (req, res) => {
	const { chatId } = req.body;
	// Remove all messages associated with chat
	const messages = await Message.deleteMany({ chat: chatId });
	// Remove the chat
	const chat = await Chat.findByIdAndRemove(chatId);
	res.status(200).json({ deletedChat: chat, deletedMessages: messages });
});

const deleteGroupChat = asyncHandler(async (req, res) => {
	const { chatId } = req.body;
	// Make sure the user sending the request is the group admin
	const chatToDelete = await Chat.findById(chatId);
	if (chatToDelete.groupAdmin.toString() === req.user._id.toString()) {
		// Remove all messages associated with chat
		const messages = await Message.deleteMany({ chat: chatId });
		// Remove the chat
		const chat = await Chat.findByIdAndRemove(chatId);
		res.status(200).json({ deletedChat: chat, deletedMessages: messages });
	} else {
		res.status(400).json({ error: "User sending request is not group admin" });
	}
});

export { accessChat, fetchChats, fetchChatById, createGroupChat, renameGroup, addToGroup, removeFromGroup, deleteOneOnOneChat, deleteGroupChat };
