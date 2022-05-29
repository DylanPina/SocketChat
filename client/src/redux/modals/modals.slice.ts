import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const modalsSlice = createSlice({
	name: "modals",
	initialState: {
		createGroupChat: false,
		authModal: "Login Modal",
		myProfile: false,
		userSettings: false,
		searchDrawer: false,
		myChats: true,
	},
	reducers: {
		toggleCreateGroupChat: (state) => {
			state.createGroupChat = !state.createGroupChat;
		},
		loginModal: (state) => {
			state.authModal = "Login Modal";
		},
		signupModal: (state) => {
			state.authModal = "Signup Modal";
		},
		toggleMyProfile: (state) => {
			state.myProfile = !state.myProfile;
		},
		toggleUserSettings: (state) => {
			state.userSettings = !state.userSettings;
		},
		toggleSearchDrawer: (state) => {
			state.searchDrawer = !state.searchDrawer;
		},
		toggleMyChats: (state) => {
			state.myChats = !state.myChats;
		},
	},
});

// Action creators are generated for each case reducer function
export const { toggleCreateGroupChat, loginModal, signupModal, toggleMyProfile, toggleUserSettings, toggleSearchDrawer, toggleMyChats } =
	modalsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModals = (state: RootState) => state.modals;

export default modalsSlice.reducer;
