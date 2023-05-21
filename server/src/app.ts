import express from "express";
import cors from "cors";
import userRoutes from "../src/routes/user.routes";
import chatRoutes from "../src/routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";

const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join("client/build")));

app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
