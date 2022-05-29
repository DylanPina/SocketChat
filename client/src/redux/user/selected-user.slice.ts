import type { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
	name: "searchSlice",
	initialState: {
		selectedUser: undefined,
	},
	reducers: {
		setSelectedUser: (state: any, action: any) => {
			state.selectedUser = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setSelectedUser } = searchSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSelectedUser = (state: RootState) => state.selectedUser;

export default searchSlice.reducer;
