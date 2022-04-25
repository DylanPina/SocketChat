import React, { SetStateAction, Dispatch } from "react";

import styles from "../../styles/HomePage/LoginHomePage.module.css";

interface IProps {
	setAuthModal: Dispatch<SetStateAction<string>>;
}

const LoginHomePage: React.FC<IProps> = ({ setAuthModal }) => {
	const handleSignupAuthModal = () => {
		setAuthModal("Signup");
	};

	return (
		<div className={styles.login_modal}>
			<h1 className={styles.title}>LOGIN</h1>
			<div className={styles.input_container}>
				<input type="text" placeholder="Username" className={styles.password_field} />
				<input type="text" placeholder="Password" className={styles.password_field} />
				<button className={styles.submit_button}>Login</button>
				<button className={styles.signup_button} onClick={handleSignupAuthModal}>
					Click here to sign up
				</button>
				<button className={styles.guest_button} onClick={handleSignupAuthModal}>
					Get Guest User Credentials
				</button>
			</div>
		</div>
	);
};

export default LoginHomePage;
