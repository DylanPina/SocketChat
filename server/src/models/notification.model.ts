import mongoose from "mongoose";

const notificationModel = new mongoose.Schema(
	{
		message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
		chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Message", notificationModel);

export default Notification;
