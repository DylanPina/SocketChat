import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Message } from "../../types/message.types";
import { User } from "../../types/user.types";
import { Chat } from "../../types/chat.types";

interface notificationState {
	notifications: Message[];
	mutedUsers: User[];
	mutedChats: Chat[];
}

const initialState: notificationState = {
	notifications: [],
	mutedUsers: [],
	mutedChats: [],
};

export const notificationsSlice = createSlice({
	name: "userInfo",
	initialState,
	reducers: {
		setNotifications: (state: any, action: PayloadAction<Message[] | Message | []>) => {
			state.notifications = action.payload;
		},
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
		removeNotificationsByUser: (state: any, action: PayloadAction<User>) => {
			state.notifications = state.notifications.filter((noti: Message) => noti.sender.username !== action.payload.username);
		},
		removeAllNotifications: (state: any) => {
			state.notifications = [];
		},
		setMutedUsers: (state: any, action: PayloadAction<User[]>) => {
			state.mutedUsers = action.payload;
		},
		muteUser: (state: any, action: PayloadAction<User>) => {
			state.mutedUsers.push(action.payload);
		},
		unmuteUser: (state: any, action: PayloadAction<any>) => {
			state.mutedUsers = state.mutedUsers.filter((mutedUser: User) => mutedUser._id !== action.payload._id);
		},
	},
});

// Action creators are generated for each case reducer function
export const { setNotifications, pushNotification, removeNotification, removeNotificationsByUser, removeAllNotifications, setMutedUsers, muteUser, unmuteUser } =
	notificationsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNotifications = (state: RootState) => state.notifications;

export default notificationsSlice.reducer;
