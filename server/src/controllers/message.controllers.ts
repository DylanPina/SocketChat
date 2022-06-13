const asyncHandler = require("express-async-handler");
import Chat from "../models/chat.model";
import Message from "../models/message.model";
import User from "../models/user.model";

// Sends a message
const sendMessage = asyncHandler(async (req, res) => {
	// Extracting content and ChatID from request body
	const { content, chatId } = req.body;
	// Return an error if there is no content or chatID
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

// Sends a notification to a user
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

// Fetches all notifications for a single user
const fetchNotifications = asyncHandler(async (req, res) => {
	try {
		// Retrieve user by userID, populate and return user's notifications
		const user = await User.findById(req.user._id).populate({ path: "notifications", populate: { path: "sender chat" } });
		res.status(200).json(user.notifications);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Removes a single notification from the user's notification array
const removeNotification = asyncHandler(async (req, res) => {
	// Extracting notificationID from the request body
	const { notificationId } = req.body;
	// Finding the User who sent the request and removing the notification
	const removed = await User.findByIdAndUpdate(req.user._id, { $pull: { notifications: notificationId } });

	// Check if the notification was removed
	if (!removed) {
		res.status(400).json({ error: "Failed to remove notification" });
		throw new Error("Failed to remove notification");
	} else {
		res.status(200).json(removed.notifications);
	}
});

// Removes all notifications for a specific chat
const removeNotificationsByChat = asyncHandler(async (req, res) => {
	// Extracting chatID from the request body
	const { chatId } = req.body;
	try {
		// Fetch the user making the request
		const user = await User.findById(req.user._id);
		const usersNotifications = user.notifications;
		// Fetching all messages based on ChatID
		const messages = await Message.find({ chat: chatId }).populate("sender", "username profilePic email").populate("chat");
		// Iterate through all messages in the chat, remove all notifications
		messages.forEach(async (message) => {
			if (usersNotifications.includes(message._id)) {
				await User.findByIdAndUpdate(user, {
					$pull: { notifications: message._id },
				});
			}
		});
		// Return the notifications back
		res.status(200).json(user.notifications);
	} catch (error: any) {
		res.status(400).json({ error: error });
		throw new Error(error.message);
	}
});

// Removes all notifications from the user's notification array
const removeAllNotifications = asyncHandler(async (req, res) => {
	// Finding the user who sent the request and removing all notifications
	const removed = await User.findByIdAndUpdate(req.user._id, { $set: { notifications: [] } });
	// Check if the notifications were removed
	if (!removed) {
		res.status(400).json({ error: "Failed to remove notification" });
		throw new Error("Failed to remove notification");
	} else {
		res.status(200).json(removed.notifications);
	}
});

export { sendMessage, allMessages, sendNotification, fetchNotifications, removeNotification, removeNotificationsByChat, removeAllNotifications };
