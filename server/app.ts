import path from "path";
import express from "express";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import { notFound, errorHandler } from "./middlewares/errorMiddleware";
require("dotenv").config();
console.log(process.env);
// Initializing our express app
const app = express();
// Accepting JSON data
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

/* -----------------------------------DEPLOYMENT-------------------------------------------- */
const __dirname1 = path.resolve();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname1, "../client/build")));
	app.get("*", (req, res) => res.sendFile(path.resolve(__dirname1, "../client", "build", "index.html")));
} else {
	app.get("/", (req, res) => res.send("API is Run"));
}
/* ----------------------------------------------------------------------------------------- */

// Error handling for API
app.use(notFound);
app.use(errorHandler);

export default app;
