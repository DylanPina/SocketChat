const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected: ${connect.connection.host}`);
	} catch (error) {
		console.error(error);
		process.exit;
	}
};

export { connectDB };
