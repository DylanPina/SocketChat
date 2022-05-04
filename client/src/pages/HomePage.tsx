import { useAppDispatch, useAppSelector } from "../redux/redux-hooks";
import { loginModal, signupModal } from "../redux/auth-modal/authModal.slice";

import LoginHomePage from "../components/Auth/LoginHomePage";
import SignupHomePage from "../components/Auth/SignupHomePage";

import styles from "../styles/HomePage/HomePage.module.css";

const HomePage = () => {
	const authModalState = useAppSelector((state) => state.authModal.modal);
	const dispatch = useAppDispatch();

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
					<p className={styles.paragraph}>Real-time secure communication through web sockets</p>
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
