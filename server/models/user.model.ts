export {};
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profilePic: {
			type: String,
			default: "https://www.pngitem.com/pimgs/m/146-1468281_profile-icon-png-transparent-profile-picture-icon-png.png",
		},
	},
	{ timestamps: true }
);

// Checking to see user password matches
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Before save, encrypt the password
userSchema.pre("save", async function (next) {
	if (!this.isModified) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
