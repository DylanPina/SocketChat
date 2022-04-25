import React, { Dispatch, SetStateAction } from "react";

import styles from "../../styles/HomePage/SignupHomePage.module.css";

interface IProps {
	setAuthModal: Dispatch<SetStateAction<string>>;
}

const SignupHomePage: React.FC<IProps> = ({ setAuthModal }) => {
	const handleLoginAuthModal = () => {
		setAuthModal("Login");
	};

	return (
		<div className={styles.signup_modal}>
			<h1 className={styles.title}>SIGN UP</h1>
			<div className={styles.input_container}>
				<label className={styles.input_label}>Enter your username</label>
				<input type="text" placeholder="Username" className={styles.password_field} />
				<label className={styles.input_label}>Enter your password</label>
				<input type="text" placeholder="Password" className={styles.password_field} />
				<label className={styles.input_label}>Confirm your password</label>
				<input type="text" placeholder="Confirm password" className={styles.password_field} />
				<label className={styles.input_label}>Upload a profile picture</label>
				<div className={styles.upload_container}>
					<input type="file" id="avatar" name="profile picture" accept="image/png, image/jpeg" className={styles.upload_img} />
				</div>
				<button className={styles.signup_button}>Sign up</button>
				<button className={styles.login_button} onClick={handleLoginAuthModal}>
					Login
				</button>
			</div>
		</div>
	);
};

export default SignupHomePage;
