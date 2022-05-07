import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const authModalSlice = createSlice({
	name: "authModal",
	initialState: {
		modal: "Login Modal",
	},
	reducers: {
		loginModal: (state) => {
			state.modal = "Login Modal";
		},
		signupModal: (state) => {
			state.modal = "Signup Modal";
		},
	},
});

// Action creators are generated for each case reducer function
export const { loginModal, signupModal } = authModalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthModal = (state: RootState) => state.authModal.modal;

export default authModalSlice.reducer;
