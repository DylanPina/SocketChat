import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Message } from "../../types/message.types";
import { Chat } from "../../types/chat.types";

interface notificationState {
	notifications: Message[];
}

const initialState: notificationState = {
	notifications: [],
};

export const notificationsSlice = createSlice({
	name: "userInfo",
	initialState,
	reducers: {
		pushNotification: (state: any, action: PayloadAction<Message>) => {
			let alreadySent = false;
			state.notifications.forEach((noti: Message) => {
				if (noti._id === action.payload._id) {
					alreadySent = true;
				}
			});
			if (!alreadySent) {
				state.notifications = [...state.notifications, action.payload];
			}
		},
		removeNotification: (state: any, action: PayloadAction<Message>) => {
			state.notifications = state.notifications.filter((noti: Message) => noti._id !== action.payload._id);
		},
	},
});

// Action creators are generated for each case reducer function
export const { pushNotification, removeNotification } = notificationsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNotifications = (state: RootState) => state.notifications;

export default notificationsSlice.reducer;
