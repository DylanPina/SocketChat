import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserInfoInterface {
	username: string;
	email: string;
	profilePic: string;
	token: string;
	_id: string;
}

const initialState: UserInfoInterface = {
	username: "",
	email: "",
	profilePic: "",
	token: "",
	_id: "",
};

export const userInfoSlice = createSlice({
	name: "userInfo",
	initialState,
	reducers: {
		setUserInfo: (state, action: PayloadAction<UserInfoInterface>) => {
			Object.assign(state, action.payload);
		},
	},
});

// Action creators are generated for each case reducer function
export const { setUserInfo } = userInfoSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthModal = (state: RootState) => state.userInfo;

export default userInfoSlice.reducer;
