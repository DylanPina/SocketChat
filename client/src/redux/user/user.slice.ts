import { RootState } from "../store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user.types";

const initialState: User = {
	username: "",
	email: "",
	profilePic: "",
	token: "",
	_id: "",
	createdAt: "",
	updatedAt: "",
	__v: 0,
	notifications: [],
	mutedChats: [],
	mutedUsers: [],
	friends: [],
	incomingFriendRequests: [],
	outgoingFriendRequests: [],
};

export const userInfoSlice = createSlice({
	name: "userInfo",
	initialState,
	reducers: {
		setUserInfo: (state: User, action: PayloadAction<User>) => {
			Object.assign(state, action.payload);
		},
		setUserProfilePic: (state: User, action: PayloadAction<string>) => {
			state.profilePic = action.payload;
		},
		setFriends: (state: User, action: PayloadAction<Array<User>>) => {
			state.friends = action.payload;
		},
		setIncomingFriendRequests: (state: User, action: PayloadAction<Array<User>>) => {
			state.incomingFriendRequests = action.payload;
		},
		setOutgoingFriendRequests: (state: User, action: PayloadAction<Array<User>>) => {
			state.incomingFriendRequests = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setUserInfo, setUserProfilePic, setFriends, setIncomingFriendRequests, setOutgoingFriendRequests } = userInfoSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthModal = (state: RootState) => state.userInfo;

export default userInfoSlice.reducer;
