import express from "express";
import userRoutes from "../src/routes/user.routes";
import chatRoutes from "../src/routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";

// Initializing our express app
const app = express();
// Accepting JSON data
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error handling for API
app.use(notFound);
app.use(errorHandler);

export default app;
