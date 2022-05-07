import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/redux-hooks";
import { setUserInfo } from "./redux/user-info/user.slice";

import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";

import styles from "./styles/App.module.css";

function App() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			dispatch(setUserInfo(JSON.parse(userInfo)));
		}
		if (!userInfo) {
			navigate("/");
		}
	}, [navigate]);

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
