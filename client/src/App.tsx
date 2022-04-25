import React from "react";
import { Route, Routes } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";

import styles from "./styles/App.module.css";

function App() {
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
