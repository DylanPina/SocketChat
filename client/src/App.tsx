import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch } from "./redux/redux-hooks";
import { setScreenWidth, setScreenHeight, setMediumScreen, setMobileScreen } from "./redux/screen/screen.slice";
import { setMutedUsers } from "./redux/notifications/notifications.slice";
import { setUserInfo } from "./redux/user/user.slice";

import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";

import styles from "./styles/App.module.css";
import useWindowDimensions from "./config/hooks/useWindowDimensions";
import axios from "axios";
import { toast } from "react-toastify";

function App() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { height, width } = useWindowDimensions();
	const userInfo = localStorage.getItem("userInfo");
	const { token } = JSON.parse(userInfo || "");

	useEffect(() => {
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

	useEffect(() => {
		const fetchMutedUsers = async () => {
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await axios.get("/api/user/fetchMutedUsers", config);
				dispatch(setMutedUsers(data));
			} catch (error) {
				toast.error(error, {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
		};
		fetchMutedUsers();
	}, []);

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
