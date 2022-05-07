import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const userSettingsModalSlice = createSlice({
	name: "userSettings",
	initialState: {
		isOpen: false,
	},
	reducers: {
		toggleUserSettings: (state) => {
			state.isOpen = !state.isOpen;
		},
	},
});

// Action creators are generated for each case reducer function
export const { toggleUserSettings } = userSettingsModalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserSettings = (state: RootState) => state.userSettingsModal;

export default userSettingsModalSlice.reducer;
