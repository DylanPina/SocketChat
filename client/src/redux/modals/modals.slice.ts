import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const modalsSlice = createSlice({
	name: "modals",
	initialState: {
		createGroupChatIsOpen: false,
	},
	reducers: {
		toggleCreateGroupChatModal: (state) => {
			state.createGroupChatIsOpen = !state.createGroupChatIsOpen;
		},
	},
});

// Action creators are generated for each case reducer function
export const { toggleCreateGroupChatModal } = modalsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModals = (state: RootState) => state.modals;

export default modalsSlice.reducer;
