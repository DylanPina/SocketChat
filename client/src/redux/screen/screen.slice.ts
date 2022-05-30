import type { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export const screenDimensionsSlice = createSlice({
	name: "screenDimensionsSlice",
	initialState: {
		screenWidth: undefined,
		screenHeight: undefined,
		mediumScreen: false,
		mobileScreen: false,
	},
	reducers: {
		setScreenWidth: (state: any, action: any) => {
			state.screenWidth = action.payload;
		},
		setScreenHeight: (state: any, action: any) => {
			state.screenHeight = action.paylaod;
		},
		setMediumScreen: (state: any, action: any) => {
			state.mediumScreen = action.payload;
		},
		setMobileScreen: (state: any, action: any) => {
			state.mobileScreen = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setScreenWidth, setScreenHeight, setMediumScreen, setMobileScreen } = screenDimensionsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectedScreenDimensions = (state: RootState) => state.screenDimensions;

export default screenDimensionsSlice.reducer;
