import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { State } from "../redux/root-reducer";
import * as authModalACs from "../redux/auth-modal/authModal.actions";
import { useSelector } from "react-redux";

import LoginHomePage from "../components/Auth/LoginHomePage";
import SignupHomePage from "../components/Auth/SignupHomePage";

import styles from "../styles/HomePage/HomePage.module.css";

const HomePage = () => {
	const dispatch = useDispatch();
	const { displayLoginModal, displaySignupModal } = bindActionCreators(authModalACs, dispatch);
	const authModalState = useSelector((state: State) => state.authModal);

	return (
		<div className={styles.page}>
			<div className={styles.content_container}>
				<div className={styles.title_container}>
					<h1 className={styles.title}>⚡SocketChat⚡</h1>
					<p className={styles.paragraph}>Real-time secure communication through web sockets</p>
				</div>
				<div className={styles.auth_container}>
					{authModalState === "loginModal" ? (
						<LoginHomePage setAuthModal={displaySignupModal} />
					) : authModalState === "signupModal" ? (
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
