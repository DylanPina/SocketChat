require("dotenv").config();
import { connectDB } from "../src/services/db";
import app from "./app";

// Using PORT from .env
const PORT = process.env.PORT;
// Connecting to MongoDB
connectDB();

// Listening on port
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
