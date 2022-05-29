import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import userInfoSlice from "./user/user.slice";
import searchSlice from "./user/selected-user.slice";
import chatSlice from "./chats/chats.slice";
import modalsSlice from "./modals/modals.slice";
import notificationsSlice from "./notifications/notifications.slice";

export const store = configureStore({
	reducer: {
		userInfo: userInfoSlice,
		modals: modalsSlice,
		selectedUser: searchSlice,
		chats: chatSlice,
		notifications: notificationsSlice,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
