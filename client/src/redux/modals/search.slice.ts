import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const searchSlice = createSlice({
	name: "searchSlice",
	initialState: {
		searchDrawerOpen: false,
		selectedUser: undefined,
	},
	reducers: {
		toggleSearchDrawerOpen: (state) => {
			state.searchDrawerOpen = !state.searchDrawerOpen;
		},
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { toggleSearchDrawerOpen, setSelectedUser } = searchSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserSettings = (state: RootState) => state.userSettingsModal;

export default searchSlice.reducer;
