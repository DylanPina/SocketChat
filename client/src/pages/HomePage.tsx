import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/redux-hooks";
import { loginModal, signupModal } from "../redux/modals/auth-modal.slice";

import LoginHomePage from "../components/Auth/LoginHomePage";
import SignupHomePage from "../components/Auth/SignupHomePage";

import styles from "../styles/HomePage/HomePage.module.css";
const HomePage = () => {
	const authModalState = useAppSelector((state) => state.authModal.modal);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const userInfo = localStorage.getItem("userInfo");

		if (userInfo) {
			const userInfoJSON = JSON.parse(userInfo);
			if (userInfoJSON) {
				navigate("/chats");
			}
		}
	}, [navigate]);

	const displayLoginModal = () => {
		dispatch(loginModal());
	};

	const displaySignupModal = () => {
		dispatch(signupModal());
	};

	return (
		<div className={styles.page}>
			<div className={styles.content_container}>
				<div className={styles.title_container}>
					<h1 className={styles.title}>⚡SocketChat⚡</h1>
					<p className={styles.subtitle}>Real-time secure communication through web sockets</p>
				</div>
				<div className={styles.auth_container}>
					{authModalState === "Login Modal" ? (
						<LoginHomePage setAuthModal={displaySignupModal} />
					) : authModalState === "Signup Modal" ? (
						<SignupHomePage setAuthModal={displayLoginModal} />
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
