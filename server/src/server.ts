import express from "express";
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const userRoutes = require("../routes/user.routes");

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

// API route
app.get("/", (req, res) => res.send("API is Running"));
// User routes for accessing users
app.use("/api/user", userRoutes);
// Listening on our port
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
