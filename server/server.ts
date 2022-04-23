const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");

dotenv.config();

const app = express();

const PORT: String = process.env.PORT;

app.get("/", (req, res) => {
	res.send("API is Running");
});

app.get("/api/chat", (req, res) => {
	res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
	const singleChat: String = chats.find((chat) => chat._id === req.params.id);
	res.send(singleChat);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
