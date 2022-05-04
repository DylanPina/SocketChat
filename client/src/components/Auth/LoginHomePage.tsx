import React, { SetStateAction, Dispatch, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

import LoadingSpinner from "../Utils/LoadingSpinner";

import styles from "../../styles/HomePage/LoginHomePage.module.css";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface IProps {
	setAuthModal: Dispatch<SetStateAction<void>>;
}

const LoginHomePage: React.FC<IProps> = ({ setAuthModal }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordHidden, setPasswordHidden] = useState(false);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleEmailChange = (name: string) => {
		setEmail(name);
	};

	const handlePasswordChange = (password: string) => {
		setPassword(password);
	};

	const togglePasswordHidden = () => {
		setPasswordHidden(!passwordHidden);
	};

	const handleLogin = async () => {
		if (loading) {
			return;
		}

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

			// TODO: Fix error handling when user doesn't exist
			const { data } = await axios.post("/api/user/login", { email, password }, config);

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

			navigate("/chats");
		} catch (error: any) {
			toast.error(error.response.data.error, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			setLoading(false);
		}
	};

	const handleSignupAuthModal = () => {
		setAuthModal();
	};

	const handleGuestUser = () => {
		setEmail("guest@example.com");
		setPassword("123456");
	};

	return (
		<div className={styles.login_modal}>
			<h1 className={styles.title}>LOGIN</h1>
			<div className={styles.input_section}>
				<div className={styles.input_container}>
					<label className={styles.input_label}>Enter your email address</label>
					<input
						type="email"
						placeholder="Email address"
						className={styles.email_field}
						value={email}
						onChange={(e) => handleEmailChange(e.target.value)}
						required
					/>
				</div>
				<div className={styles.input_container}>
					<label className={styles.input_label}>Enter your password</label>
					<input
						type={passwordHidden ? "text" : "password"}
						placeholder="Password"
						className={styles.password_field}
						value={password}
						onChange={(e) => handlePasswordChange(e.target.value)}
						required
					/>
					<div className={styles.hidden_icon} onClick={togglePasswordHidden}>
						{passwordHidden ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
					</div>
				</div>
				<button className={styles.submit_button} onClick={handleLogin}>
					{loading ? <LoadingSpinner size={"22px"} /> : "Login"}
				</button>
				<button className={styles.signup_button} onClick={handleSignupAuthModal}>
					Click here to sign up
				</button>
				<button className={styles.guest_button} onClick={handleGuestUser}>
					Get guest user credentials
				</button>
			</div>
		</div>
	);
};

export default LoginHomePage;
