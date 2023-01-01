import app from "./app";
import { connectDB } from "../src/services/db";
import path from "path";
require("dotenv").config({ path: path.resolve("../.env") });

// Using PORT from .env
const PORT = process.env.PORT;
// Connecting to MongoDB
connectDB();

// Listening on port
const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

// This is where the magic happens
const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: "http://localhost:3000",
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
		console.log(`${userData.username} joined room: ${room}` );
	});

	socket.on("typing", (room) => socket.in(room).emit("typing"));

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

	socket.off("setup", (userData) => {
		socket.leave(userData._id);
		console.log(`${userData.username} has disconnected`)
	});
});
