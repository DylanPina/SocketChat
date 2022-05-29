import type { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export const screenDimensionsSlice = createSlice({
	name: "screenDimensionsSlice",
	initialState: {
		screenWidth: undefined,
		screenHeight: undefined,
		smallScreen: false,
	},
	reducers: {
		setScreenWidth: (state: any, action: any) => {
			state.screenWidth = action.payload;
		},
		setScreenHeight: (state: any, action: any) => {
			state.screenHeight = action.paylaod;
		},
		setSmallScreen: (state: any, action: any) => {
			state.smallScreen = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setScreenWidth, setScreenHeight, setSmallScreen } = screenDimensionsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectedScreenDimensions = (state: RootState) => state.screenDimensions;

export default screenDimensionsSlice.reducer;
