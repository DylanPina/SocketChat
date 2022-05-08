import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface chatSliceState {
	chats: any;
	selectedChat: any;
	fetchChatsAgain: boolean;
}

const initialState: chatSliceState = {
	selectedChat: null,
	chats: null,
	fetchChatsAgain: false,
};

export const chatSlice = createSlice({
	name: "chats",
	initialState,
	reducers: {
		setChats: (state, action) => {
			state.chats = action.payload;
		},
		setSelectedChat: (state, action) => {
			state.selectedChat = action.payload;
		},
		setFetchChatsAgain: (state, action) => {
			state.fetchChatsAgain = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setSelectedChat, setChats, setFetchChatsAgain } = chatSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectChatSlice = (state: RootState) => state.chats;

export default chatSlice.reducer;
