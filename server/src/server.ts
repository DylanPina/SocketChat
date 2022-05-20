require("dotenv").config();
import { connectDB } from "../src/services/db";
import app from "./app";

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
		// Create a new room with ID of userData
		socket.join(userData._id);
		console.log("User ID: " + userData._id);
		socket.emit("connected");
	});

	socket.on("join chat", (room) => {
		// Create a room
		socket.join(room);
		console.log("User joined room: " + room);
	});

	socket.on("typing", (room) => socket.in(room).emit("typing"));

	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageRecieved) => {
		var chat = new newMessageRecieved.chat();

		if (!chat.users) return console.error("chat.users not defined");

		chat.users.forEach((user) => {
			if (user._id == newMessageRecieved.sender._id) return;
			socket.in(user._id).emit("message recieved", newMessageRecieved);
		});
	});
});
