import React, { SetStateAction, Dispatch, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import styles from "../../styles/HomePage/LoginHomePage.module.css";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface IProps {
	setAuthModal: Dispatch<SetStateAction<string>>;
}

const LoginHomePage: React.FC<IProps> = ({ setAuthModal }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleEmailChange = (name: string) => {
		setEmail(name);
	};

	const handlePasswordChange = (password: string) => {
		setPassword(password);
	};

	const handleLogin = async () => {
		// TODO: add loading spinner
		setLoading(true);

		if (!email && !password) {
			toast.error("Please enter email and password", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			setLoading(false);
			return;
		}

		if (!email) {
			toast.error("Please enter your email address", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			setLoading(false);
			return;
		}

		if (!password) {
			toast.error("Please enter your password", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			setLoading(false);
			return;
		}

		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			const { data } = await axios.post("/api/user/login", { email, password }, config);

			// TODO: add popup
			toast.success("Login successful", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);

			// TODO: uncomment when chats page is completed
			// navigate("/chats");
		} catch (error) {
			// TODO: add popup
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

	const handleSignupAuthModal = () => {
		setAuthModal("Signup");
	};

	return (
		<div className={styles.login_modal}>
			<h1 className={styles.title}>LOGIN</h1>
			<div className={styles.input_container}>
				<label className={styles.input_label}>Enter your email address</label>
				<input type="text" placeholder="Email address" className={styles.email_field} onChange={(e) => handleEmailChange(e.target.value)} required />
				<label className={styles.input_label}>Enter your password</label>
				<input type="text" placeholder="Password" className={styles.password_field} onChange={(e) => handlePasswordChange(e.target.value)} required />
				<button className={styles.submit_button} onClick={handleLogin}>
					Login
				</button>
				<button className={styles.signup_button} onClick={handleSignupAuthModal}>
					Click here to sign up
				</button>
				<button className={styles.guest_button}>Get guest user credentials</button>
			</div>
		</div>
	);
};

export default LoginHomePage;
