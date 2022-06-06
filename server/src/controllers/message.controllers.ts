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

const sendNotification = asyncHandler(async (req, res) => {
	// Extracting message from the request body
	const { messageId, chatId } = req.body;
	try {
		// Fetching the message & chat based on IDs passed in
		const message = await Message.findOne({ _id: messageId }).populate("sender", "username profilePic email").populate("chat");
		const chat = await Chat.findOne({ _id: chatId });
		// Constructing our response
		const notification = {
			message,
			chat,
		};
		// Mapping over users in the chat
		chat.users.forEach(async (user) => {
			// We obviously don't want to send the notification to the sender
			if (user.toString() !== req.user._id.toString()) {
				// Pushing the notification to the user
				await User.findByIdAndUpdate(user, {
					$push: { notifications: message },
				});
			}
		});
		// Return the notification
		res.status(200).json(notification);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

const fetchNotifications = asyncHandler(async (req, res) => {
	// Extracting the userID from the request body
	const { userId } = req.body;

	try {
		// Retrieve user by userID, populate and return user's notifications
		const user = await User.findById(userId).populate({ path: "notifications", populate: { path: "sender chat" } });
		res.status(200).json(user.notifications);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

export { sendMessage, allMessages, sendNotification, fetchNotifications };
