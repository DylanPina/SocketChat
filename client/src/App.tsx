import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch } from "./redux/redux-hooks";
import { setScreenWidth, setScreenHeight, setSmallScreen } from "./redux/screen/screen.slice";
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

		if (width < 1050) {
			dispatch(setSmallScreen(true));
		} else {
			dispatch(setSmallScreen(false));
		}
	}, [height, width, []]);

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
