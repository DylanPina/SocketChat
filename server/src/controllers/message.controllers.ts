const asyncHandler = require("express-async-handler");
import Chat from "../models/chat.model";
import Message from "../models/message.model";
import User from "../models/user.model";

// Sends a message
const sendMessage = asyncHandler(async (req, res) => {
	// Extracting content and ChatID from request body
	const { content, chatId } = req.body;

	if (!content || !chatId) {
		console.error("Invalid data passed into request");
		return res.sendStatus(400).json({ error: "Invalid data passed into request" });
	}

	var newMessage = {
		sender: req.user._id, // Logged in user's ID
		content: content, // Content of the message
		chat: chatId, // Chat which the message is being sent to
	};

	try {
		// Creating a new message from our message model
		var message = await Message.create(newMessage);
		// Populate the data attributes for this message
		message = await message.populate("sender", "username profilePic");
		message = await message.populate("chat");
		message = await User.populate(message, {
			path: "chat.users",
			select: "username profilePic email",
		});

		// Updating the most latest message
		await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

		// Return the message
		res.status(200).json(message);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Fetches all messages for a particular chat
const allMessages = asyncHandler(async (req, res) => {
	try {
		// Fetching all messages based on ChatID
		const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "username profilePic email").populate("chat");

		// Return the messages
		res.status(200).json(messages);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

export { sendMessage, allMessages };
