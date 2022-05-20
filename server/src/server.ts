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
	console.log(`Connected to socket.io`);
});
