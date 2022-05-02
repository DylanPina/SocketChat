export {};
const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const app = require("./app");

// Setting up .env file
dotenv.config();
// Using PORT from .env
const PORT = process.env.PORT;
// Connecting to MongoDB
connectDB();

// Listening on port
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
