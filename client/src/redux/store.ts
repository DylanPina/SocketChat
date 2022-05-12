import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authModalSlice from "./modals/auth-modal.slice";
import userInfoSlice from "./user-info/user.slice";
import myProfileModalSlice from "./modals/my-profile.slice";
import userSettingsModalSlice from "./modals/user-settings.slice";
import searchSlice from "./modals/search.slice";
import chatSlice from "./chats/chats.slice";
import modalsSlice from "./modals/modals.slice";

export const store = configureStore({
	reducer: {
		userInfo: userInfoSlice,
		modals: modalsSlice,
		authModal: authModalSlice,
		myProfileModal: myProfileModalSlice,
		userSettingsModal: userSettingsModalSlice,
		searchSlice: searchSlice,
		chats: chatSlice,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
