const asyncHandler = require("express-async-handler");
import User from "../models/user.model";
import generateToken from "../services/generateToken";

const registerUser = asyncHandler(async (req, res) => {
	// Assigning values based off body
	const { username, email, password, profilePic } = req.body;
	// Check to see if user credientals are passed in
	if (!username || !email || !password) {
		res.status(400);
		throw new Error("Please enter all of the fields");
	}
	// Locate user with that email
	var userExists = await User.findOne({ email });
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
		notifications: [],
	});
	// If the user is successfully created, we send back this JSON
	if (user) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePic: user.profilePic,
			token: generateToken(user._id),
			notifications: [],
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
			notifications: user.notifications,
		});
	} else {
		res.status(401).json({
			error: "User does not exist",
		});
	}
});

// /api/user?search=dylan
const allUsers = asyncHandler(async (req, res) => {
	// Extracting the search query
	const keyword = req.query.search
		? {
				$or: [
					// Keyword can either be an email OR the username
					{ username: { $regex: req.query.search, $options: "i" } },
					{ email: { $regex: req.query.search, $options: "i" } },
				],
		  }
		: {};

	// Fetch and send back all users with the keyword in their email OR username,
	// EXPECT the user making the request
	// If the keyword is empty (no search query passed in URL), it will send back ALL users
	const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
	res.send(users);
});

// Updates a user's profile picture
const changeProfilePicture = asyncHandler(async (req, res) => {
	// Extracting user and new profile picture from request body
	const { newProfilePic, userId } = req.body;

	try {
		// Find the user and update profile picture to new profile picture
		await User.findByIdAndUpdate(userId, { $set: { profilePic: newProfilePic } });
		// Return the new profile picture
		res.status(200).json(newProfilePic);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error);
	}
});

export { registerUser, authUser, allUsers, changeProfilePicture };
