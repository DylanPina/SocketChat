import React, { useEffect, useState } from "react";

import LoginHomePage from "../components/HomePage/LoginHomePage";
import SignupHomePage from "../components/HomePage/SignupHomePage";

import styles from "../styles/HomePage/HomePage.module.css";

const HomePage = () => {
	const [authModal, setAuthModal] = useState<string>("Login");

	return (
		<div className={styles.page}>
			<div className={styles.content_container}>
				<div className={styles.title_container}>
					<h1 className={styles.title}>⚡SocketChat⚡</h1>
					<p className={styles.paragraph}>Real-time secure communication through web sockets</p>
				</div>
				<div className={styles.auth_container}>
					{authModal === "Login" ? (
						<LoginHomePage setAuthModal={setAuthModal} />
					) : authModal === "Signup" ? (
						<SignupHomePage setAuthModal={setAuthModal} />
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
