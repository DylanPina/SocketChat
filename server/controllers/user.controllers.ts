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
	const user = await User.findOne({ email }).populate("friends incomingFriendRequests outgoingFriendRequests");
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
			mutedUsers: user.mutedUsers,
			friends: user.friends,
			outgoingFriendRequests: user.outgoingFriendRequests,
			incomingFriendRequests: user.incomingFriendRequests,
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

// Updates a user's username
const changeUsername = asyncHandler(async (req, res) => {
	// Extracting the new username from request body
	const { newUsername } = req.body;

	try {
		// Find the user and update the username to the new username
		const user = await User.findByIdAndUpdate(req.user._id, { $set: { username: newUsername } }, { returnOriginal: false });
		// Return the updated user object
		res.status(200).json(user);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Updates a user's profile picture
const changeProfilePicture = asyncHandler(async (req, res) => {
	// Extracting new profile picture from request body
	const { newProfilePic } = req.body;

	try {
		// Find the user and update profile picture to new profile picture
		const user = await User.findByIdAndUpdate(req.user._id, { $set: { profilePic: newProfilePic } }, { returnOriginal: false });
		// Return the updated user object
		res.status(200).json(user);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Adds a user to the list of muted users on the user model
const muteUser = asyncHandler(async (req, res) => {
	const { userToMuteId } = req.body;

	if (userToMuteId === req.user._id) {
		res.status(400).json({ error: "Cannot mute yourself" });
		throw new Error("Cannot mute yourself");
	}

	try {
		const { username, mutedUsers } = await User.findById(req.user._id);
		let userAlreadyMuted = false;
		mutedUsers.forEach((mutedUser) => {
			if (mutedUser.toString() === userToMuteId) userAlreadyMuted = true;
		});

		if (userAlreadyMuted) {
			res.status(400).json({ error: `${username} is already muted` });
		} else {
			const userToMute = await User.findById(userToMuteId);
			await User.findByIdAndUpdate(req.user._id, { $push: { mutedUsers: userToMuteId } }, { returnOriginal: false }).populate(
				"mutedUsers",
				"username email"
			);
			res.status(200).json(userToMute);
		}
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Retrieves the list of muted users from the user model
const getMutedUsers = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("mutedUsers", "username email");
		res.status(200).json(user.mutedUsers);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Removes a user from the list of muted users on the user model
const unmuteUser = asyncHandler(async (req, res) => {
	const { userToUnmuteId } = req.body;

	try {
		const userToUnmute = await User.findById(userToUnmuteId);
		await User.findByIdAndUpdate(req.user._id, { $pull: { mutedUsers: userToUnmuteId } }, { returnOriginal: false }).populate(
			"mutedUsers",
			"username email"
		);
		res.status(200).json(userToUnmute);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Returns an array of all the user's friends
const fetchFriends = asyncHandler(async (req, res) => {
	try {
		const { friends } = await User.findById(req.user._id).populate("friends");
		res.status(200).json(friends);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Sends a friend request to a specificed user
const sendFriendRequest = asyncHandler(async (req, res) => {
	const { recipientId } = req.body;

	try {
		// Checking to see if this user is already a friend
		let alreadyFriended = false;
		const { friends, outgoingFriendRequests } = await User.findById(req.user._id);
		friends.forEach((userId) => {
			if (userId.toString() === recipientId.toString()) alreadyFriended = true;
		});
		if (alreadyFriended) {
			res.status(400).json({ error: "You are already friends with this user" });
			return;
		}
		// Checking to see if a friend request was already sent to the user
		let alreadySent = false;
		outgoingFriendRequests.forEach((userId: any) => {
			if (userId.toString() === recipientId) alreadySent = true;
		});
		// Throwing an error if a friend request has already been sent to user
		if (alreadySent) {
			res.status(400).json({ error: "A friend request was already sent to this user" });
			return;
		}
		// Append the recipient to the outgoingFriendRequests of the sender
		const sender = await User.findByIdAndUpdate(req.user._id, { $push: { outgoingFriendRequests: recipientId } }, { returnOriginal: false }).populate(
			"outgoingFriendRequests"
		);
		// Append the sender to the incomingFriendRequests of the recipient
		const recipient = await User.findByIdAndUpdate(recipientId, { $push: { incomingFriendRequests: req.user._id } }, { returnOriginal: false });
		// Return the updated outgoing friend requests
		res.status(200).json({ outgoingFriendRequests: sender.outgoingFriendRequests });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Unsends a friend request
const unsendFriendRequest = asyncHandler(async (req, res) => {
	const { friendId } = req.body;

	try {
		// Remove the outgoing friend request from the user
		const sender = await User.findByIdAndUpdate(req.user._id, { $pull: { outgoingFriendRequests: friendId } }, { returnOriginal: false }).populate(
			"outgoingFriendRequests"
		);
		// Remove the incoming friend request from the sender
		const recipient = await User.findByIdAndUpdate(friendId, { $pull: { incomingFriendRequests: req.user._id } }, { returnOriginal: false });
		// Return the updated outgoing friend requests from the sender
		res.status(200).json({ outgoingFriendRequests: sender.outgoingFriendRequests });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Accepts an incoming friend request from a specified user
const acceptFriendRequest = asyncHandler(async (req, res) => {
	const { friendId } = req.body;

	try {
		// Checking to see if the incoming friend request exists
		let friendRequestExists = false;
		const { incomingFriendRequests } = await User.findById(req.user._id);
		incomingFriendRequests.forEach((userId) => {
			if (userId.toString() === friendId.toString()) friendRequestExists = true;
		});
		// Throwing an error if the incoming friend request doesn't exist
		if (!friendRequestExists) {
			res.status(400).json({ error: "Friend request does not exist" });
			return;
		}
		// Remove the incoming friend request from incomingFriendRequests and add to friends
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ $pull: { incomingFriendRequests: friendId }, $push: { friends: friendId } },
			{ returnOriginal: false }
		).populate("friends incomingFriendRequests");
		// Remove the outgoing friend request from outgoingFriendRequests of sender and add to friends
		const sender = await User.findByIdAndUpdate(
			friendId,
			{ $pull: { outgoingFriendRequests: req.user._id }, $push: { friends: req.user._id } },
			{ returnOriginal: false }
		);
		// Return the updated friends list and incoming friend requests
		res.status(200).json({ friends: user.friends, incomingFriendRequests: user.incomingFriendRequests });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Declines an incoming friend request from a specified user
const declineFriendRequest = asyncHandler(async (req, res) => {
	const { friendId } = req.body;

	try {
		// Checking to see if the incoming friend request exists
		let friendRequestExists = false;
		const { incomingFriendRequests } = await User.findById(req.user._id);
		incomingFriendRequests.forEach((userId) => {
			if (userId.toString() === friendId.toString()) friendRequestExists = true;
		});
		// Throwing an error if the incoming friend request doesn't exist
		if (!friendRequestExists) {
			res.status(400).json({ error: "Friend request does not exist" });
			return;
		}
		// Remove the incoming friend request from incomingFriendRequests and add to friends
		const user = await User.findByIdAndUpdate(req.user._id, { $pull: { incomingFriendRequests: friendId } }, { returnOriginal: false }).populate(
			"incomingFriendRequests"
		);
		// Remove the outgoing friend request from outgoingFriendRequests of sender and add to friends
		const sender = await User.findByIdAndUpdate(friendId, { $pull: { outgoingFriendRequests: req.user._id } }, { returnOriginal: false });
		// Return the updating incoming friend requests
		res.status(200).json({ incomingFriendRequests: user.incomingFriendRequests });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Removes a friend
const removeFriend = asyncHandler(async (req, res) => {
	const { friendId } = req.body;

	try {
		// Checking to see if the friend exists
		let friendExists = false;
		const { friends } = await User.findById(req.user._id);
		friends.forEach((userId) => {
			if (userId.toString() === friendId.toString()) friendExists = true;
		});
		// Throwing an error if the friend does not exist
		if (!friendExists) {
			res.status(400).json({ error: "Friend not found" });
			return;
		}
		// Remove the friend from the user sending the request
		const user = await User.findByIdAndUpdate(req.user._id, { $pull: { friends: friendId } }, { returnOriginal: false }).populate("friends");
		// Remove the user who sent the request from the friend's friend
		const sender = await User.findByIdAndUpdate(friendId, { $pull: { friends: req.user._id } }, { returnOriginal: false });
		// Return the update friends list
		res.status(200).json({ friends: user.friends });
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Returns an array of user's incoming friend requests
const fetchIncomingFriendRequests = asyncHandler(async (req, res) => {
	try {
		const { incomingFriendRequests } = await User.findById(req.user._id).populate("incomingFriendRequests");
		res.status(200).json(incomingFriendRequests);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

// Returns an array of user's outgoing friend requests
const fetchOutgoingFriendRequests = asyncHandler(async (req, res) => {
	try {
		const { outgoingFriendRequests } = await User.findById(req.user._id).populate("outgoingFriendRequests");
		res.status(200).json(outgoingFriendRequests);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		throw new Error(error.message);
	}
});

export {
	registerUser,
	authUser,
	allUsers,
	changeProfilePicture,
	changeUsername,
	muteUser,
	getMutedUsers,
	unmuteUser,
	fetchFriends,
	sendFriendRequest,
	unsendFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
	removeFriend,
	fetchIncomingFriendRequests,
	fetchOutgoingFriendRequests,
};
