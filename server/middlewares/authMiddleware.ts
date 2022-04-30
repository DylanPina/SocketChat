export {};
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const protectPassword = asyncHandler(async (req, res, next) => {
	let token;

	// Checking if token is a "Bearer" token
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			// Remove "Bearer" and extract token
			token = req.headers.authorization.split(" ")[1];

			// Decodes token ID
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Find the user in our DB and return it WITHOUT password
			req.user = await User.findById(decoded.id).select("-password");

			next();
		} catch (error) {
			res.status(401);
			throw new Error("Not authorized, no token");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

module.exports = { protectPassword };
