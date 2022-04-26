import express from "express";
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const userRoutes = require("../routes/user.routes");
const { notFound, errorHandler } = require("../routes/middlewares/errorMiddleware");

// Setting up .env file
dotenv.config();
// Using PORT from .env
const PORT = process.env.PORT;
// Initializing our express app
const app = express();
// Accepting JSON data
app.use(express.json());
// Connecting to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/user", userRoutes);

// Error handling for API
app.use(notFound);
app.use(errorHandler);

// Listening on port
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
