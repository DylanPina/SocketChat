import React, { Dispatch, SetStateAction, useState } from "react";

import styles from "../../styles/HomePage/SignupHomePage.module.css";

interface IProps {
	setAuthModal: Dispatch<SetStateAction<string>>;
}

const SignupHomePage: React.FC<IProps> = ({ setAuthModal }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [profilePic, setProfilePic] = useState<File | null>();

	const handleUsernameChange = (name: string) => {
		setUsername(name);
	};

	const handleEmailChange = (email: string) => {
		setEmail(email);
	};

	const handlePasswordChange = (password: string) => {
		setPassword(password);
	};

	const handleConfirmPasswordChange = (confirmPassword: string) => {
		setConfirmPassword(confirmPassword);
	};

	const handlePicChange = (image: File) => {
		setProfilePic(image);
	};

	const handleLoginAuthModal = () => {
		setAuthModal("Login");
	};

	return (
		<div className={styles.signup_modal}>
			<h1 className={styles.title}>SIGN UP</h1>
			<div className={styles.input_container}>
				<label className={styles.input_label}>Enter your username</label>
				<input type="text" placeholder="Username" className={styles.password_field} onChange={(e) => handleUsernameChange(e.target.value)} required />
				<label className={styles.input_label}>Enter your email address</label>
				<input
					type="text"
					placeholder="Email address"
					className={styles.password_field}
					required
					onChange={(e) => handleEmailChange(e.target.value)}
				/>
				<label className={styles.input_label}>Enter your password</label>
				<input type="text" placeholder="Password" className={styles.password_field} required onChange={(e) => handlePasswordChange(e.target.value)} />
				<label className={styles.input_label}>Confirm your password</label>
				<input
					type="text"
					placeholder="Confirm password"
					className={styles.password_field}
					required
					onChange={(e) => handleConfirmPasswordChange(e.target.value)}
				/>
				<label className={styles.input_label}>Upload a profile picture</label>
				<div className={styles.upload_container}>
					<input
						type="file"
						id="profilePic"
						name="profile picture"
						accept="image/png, image/jpeg"
						className={styles.upload_img}
						required
						onChange={(e) => handlePicChange(e.target["files"]![0])}
					/>
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
