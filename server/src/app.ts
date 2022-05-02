import express from "express";
const userRoutes = require("../src/routes/user.routes");
const chatRoutes = require("../src/routes/chat.routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Initializing our express app
const app = express();
// Accepting JSON data
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// Error handling for API
app.use(notFound);
app.use(errorHandler);

module.exports = app;
