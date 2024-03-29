import app from "./app";
import { connectDB } from "../src/services/db";
require("dotenv").config();

const PORT = process.env.PORT;
const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

connectDB();

const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: process.env.CLIENT_URL,
	},
});

io.on("connection", (socket) => {
	console.log("Connected to socket.io");

	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
		console.log(`${userData.username} has connected`);
	});

	socket.on("join chat", (userData, room) => {
		socket.join(room);
		console.log(`${userData.username} joined room: ${room}`);
	});

	socket.on("typing", (data) => {
		socket.in(data.room).emit("typing", data.userTyping);
	});

	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageRecieved) => {
		const chat = newMessageRecieved.chat;

		if (!chat.users) return console.error("chat.users not defined");

		chat.users.forEach((user) => {
			if (user._id !== newMessageRecieved.sender._id) {
				socket.in(user._id).emit("message recieved", newMessageRecieved);
			}
		});
	});

	socket.on("new notification", (newNotificationRecieved) => {
		const chat = newNotificationRecieved.chat;

		if (!chat.users) return console.error("chat.users not defined");

		chat.users.forEach((user) => {
			if (user._id !== newNotificationRecieved.sender._id) {
				socket.in(user._id).emit("notification recieved", newNotificationRecieved);
			}
		});
	});

	socket.off("setup", (userData) => {
		socket.leave(userData._id);
		console.log(`${userData.username} has disconnected`);
	});
});
