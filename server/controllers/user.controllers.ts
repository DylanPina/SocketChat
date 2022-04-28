export {};
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.ts");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
	// Assigning values based off body
	const { username, email, password, profilePic } = req.body;
	// Check to see if user credientals are passed in
	if (!username || !email || !password) {
		res.status(400);
		throw new Error("Please enter all of the fields");
	}
	// Locate user with that email
	const userExists = await User.findOne({ email });
	// Checking to see if user already exists with that email
	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}
	// If the user doesn't exist, create it
	const user = await User.create({
		username,
		email,
		password,
		profilePic,
	});
	// If the user is successfully created, we send back this JSON
	if (user) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePic: user.profilePic,
			token: generateToken(user._id),
		});
	}
	// If the user is NOT successfuly created, we throw an error
	else {
		res.status(400).json({
			error: "Cannot create user",
		});
	}
});

const authUser = asyncHandler(async (req, res) => {
	// Assigning values based off body
	const { email, password } = req.body;
	// Find user with that email
	const user = await User.findOne({ email });
	// If the user exists and the password matches
	if (user && (await user.matchPassword(password))) {
		// Send back the user JSON
		res.json({
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePic: user.profilePic,
			token: generateToken(user._id),
		});
	} else {
		res.status(401).json({
			error: "User does not exist",
		});
	}
});

module.exports = { registerUser, authUser };
