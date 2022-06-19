import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/redux-hooks";
import { setScreenWidth, setScreenHeight, setMediumScreen, setMobileScreen } from "./redux/screen/screen.slice";
import { setUserInfo } from "./redux/user/user.slice";

import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";

import styles from "./styles/App.module.css";
import useWindowDimensions from "./config/hooks/useWindowDimensions";

function App() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { height, width } = useWindowDimensions();

	useEffect(() => {
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			dispatch(setUserInfo(JSON.parse(userInfo)));
		}
		if (!userInfo) {
			navigate("/");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigate]);

	// FOR SCREEN WIDTH < 1050px
	useEffect(() => {
		dispatch(setScreenWidth(width));
		dispatch(setScreenHeight(height));

		if (width <= 1050) {
			dispatch(setMediumScreen(true));
		} else {
			dispatch(setMediumScreen(false));
		}

		if (width <= 600) {
			dispatch(setMobileScreen(true));
		} else {
			dispatch(setMobileScreen(false));
		}
	}, [width, []]);

	return (
		<div className={styles.app}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/chats" element={<ChatPage />} />
			</Routes>
		</div>
	);
}

export default App;
