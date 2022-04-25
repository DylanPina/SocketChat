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
		<div className={styles.login_modal}>
			<h1 className={styles.title}>SIGN UP</h1>
			<div className={styles.input_container}>
				<input type="text" placeholder="Username" className={styles.password_field} />
				<input type="text" placeholder="Password" className={styles.password_field} />
				<input type="text" placeholder="Confirm password" className={styles.password_field} />
				<button className={styles.submit_button}>Submit</button>
				<button className={styles.signup_button} onClick={handleLoginAuthModal}>
					Click here to sign up
				</button>
			</div>
		</div>
	);
};

export default SignupHomePage;
