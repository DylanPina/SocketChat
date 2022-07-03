import express from "express";
import { connectDB } from "./services/db";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
import path from "path";
import cors from "cors";
require("dotenv").config({ path: path.resolve("../.env") });

// Using PORT from .env
const PORT = process.env.PORT || 5000;
// Connecting to MongoDB
connectDB();

// Initializing our express app
const app = express();
// Preventing CORS errors
app.use(cors());
// Accepting JSON data
app.use(express.json());

app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error handling for API
app.use(notFound);
app.use(errorHandler);

// Listening on port
const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

/* -----------------------------------DEPLOYMENT-------------------------------------------- */
const __dirname1 = path.resolve();
console.log(path.join(__dirname1, "../client/build"));
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname1, "../client/build")));
	app.get("*", (req, res) => res.sendFile(path.resolve(__dirname1, "../client", "build", "index.html")));
} else {
	app.get("/", (req, res) => res.send("API is Running"));
}
/* ----------------------------------------------------------------------------------------- */

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
		var chat = newMessageRecieved.chat;

		if (!chat.users) return console.error("chat.users not defined");

		chat.users.forEach((user) => {
			if (user._id == newMessageRecieved.sender._id) return;
			socket.in(user._id).emit("message recieved", newMessageRecieved);
		});
	});

	socket.off("setup", (userData) => {
		console.log("User disconnected");
		socket.leave(userData._id);
	});
});
