import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Message } from "../../types/message.types";

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
			state.notifications = [...state.notifications, action.payload];
		},
	},
});

// Action creators are generated for each case reducer function
export const { pushNotification } = notificationsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNotifications = (state: RootState) => state.notifications;

export default notificationsSlice.reducer;
