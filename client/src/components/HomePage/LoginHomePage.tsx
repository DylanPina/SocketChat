import React, { SetStateAction, Dispatch, useState } from "react";

import styles from "../../styles/HomePage/LoginHomePage.module.css";

interface IProps {
	setAuthModal: Dispatch<SetStateAction<string>>;
}

const LoginHomePage: React.FC<IProps> = ({ setAuthModal }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleUsernameChange = (name: string) => {
		setUsername(name);
	};

	const handlePasswordChange = (password: string) => {
		setPassword(password);
	};

	const handleSignupAuthModal = () => {
		setAuthModal("Signup");
	};

	return (
		<div className={styles.login_modal}>
			<h1 className={styles.title}>LOGIN</h1>
			<div className={styles.input_container}>
				<label className={styles.input_label}>Enter your username</label>
				<input type="text" placeholder="Username" className={styles.password_field} onChange={(e) => handleUsernameChange(e.target.value)} required />
				<label className={styles.input_label}>Enter your password</label>
				<input type="text" placeholder="Password" className={styles.password_field} onChange={(e) => handlePasswordChange(e.target.value)} required />
				<button className={styles.submit_button}>Login</button>
				<button className={styles.signup_button} onClick={handleSignupAuthModal}>
					Click here to sign up
				</button>
				<button className={styles.guest_button} onClick={handleSignupAuthModal}>
					Get guest user credentials
				</button>
			</div>
		</div>
	);
};

export default LoginHomePage;
