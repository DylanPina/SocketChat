import React, { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import styles from "../../styles/HomePage/SignupHomePage.module.css";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

interface IProps {
	setAuthModal: Dispatch<SetStateAction<string>>;
}

const SignupHomePage: React.FC<IProps> = ({ setAuthModal }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [profilePic, setProfilePic] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleUsernameChange = (username: string) => {
		setUsername(username);
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

	const handleProfilePicUpload = (image: File) => {
		// TODO: add loading spinner
		setLoading(true);

		if (image === undefined) {
			toast.error("Please select an image", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

		if (image.type === "image/jpeg" || image.type === "image/png") {
			const data = new FormData();
			data.append("file", image);
			data.append("upload_preset", "kiuxrcpz");

			axios
				.post("https://api.cloudinary.com/v1_1/dsp7595/image/upload", data)
				.then((data) => {
					setProfilePic(data.data.secure_url);
					console.log(`Profile pic cloud URL: [${data.data.secure_url}]`);
				})
				.catch((err) => {
					toast.error(err.message, {
						position: toast.POSITION.TOP_CENTER,
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
					});
				});
			setLoading(false);
		} else {
			toast.error("File must be .jpeg or .png", {
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

	const handleSignup = async () => {
		// TODO: add loading spinner
		setLoading(true);

		if (!username || !email || !password || !confirmPassword) {
			toast.error("Please enter all required fields", {
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

		if (password !== confirmPassword) {
			toast.error("Passwords do not match", {
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

			const { data } = await axios.post("/api/user", { username, email, password, profilePic }, config);

			toast.success("Registration successful", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});

			localStorage.setItem("userInfo", JSON.stringify(data));

			setLoading(false);

			// TODO: uncomment when chat page is completed
			/* navigate("/chats"); */
		} catch (err) {
			toast.error(err, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
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
				<label className={styles.input_label}>Upload a profile picture </label>
				<div className={styles.upload_container}>
					<input
						type="file"
						id="profilePic"
						name="profile picture"
						accept="image/png, image/jpeg"
						className={styles.upload_img}
						required
						onChange={(e) => handleProfilePicUpload(e.target["files"]![0])}
					/>
				</div>
				<button className={styles.signup_button} onClick={handleSignup}>
					Sign up
				</button>
				<button className={styles.login_button} onClick={handleLoginAuthModal}>
					Login
				</button>
			</div>
		</div>
	);
};

export default SignupHomePage;
