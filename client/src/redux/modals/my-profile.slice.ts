import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const myProfileModalSlice = createSlice({
	name: "myProfile",
	initialState: {
		isOpen: false,
	},
	reducers: {
		toggleMyProfile: (state) => {
			state.isOpen = !state.isOpen;
		},
	},
});

// Action creators are generated for each case reducer function
export const { toggleMyProfile } = myProfileModalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectMyProfileModal = (state: RootState) => state.myProfileModal;

export default myProfileModalSlice.reducer;
