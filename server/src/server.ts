import express, { Request, Response } from "express";
const dotenv = require("dotenv");
const { chats } = require("../data/data");
const connectDB = require("../config/db");

const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
	res.send("API is Running");
});

app.get("/api/chat", (req: Request, res: Response) => {
	res.send(chats);
});

app.get("/api/chat/:id", (req: Request, res: Response) => {
	const singleChat: String = chats.find((chat: any) => chat._id === req.params.id);
	res.send(singleChat);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
