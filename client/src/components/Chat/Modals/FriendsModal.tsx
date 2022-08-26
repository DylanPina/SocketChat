import React from "react";
import { IoIosPersonAdd } from "react-icons/io";
import { IoPersonRemove } from "react-icons/io5";

import styles from "../../../styles/ChatPage/Modals/FriendsModal.module.css";

const FriendsModal = () => {
	return (
		<div className={styles.friends_modal}>
			<div className={styles.header}>
				<button className={styles.friends_option}>Friends: (0)</button>
				<button className={styles.friend_request_option}>Friend Requests: (0)</button>
			</div>
			{/* <div className={styles.friends_section}></div> */}
			<div className={styles.friend_request_section}>
				<div className={styles.friend_request}>
					<img src="https://pbs.twimg.com/media/E2rnc20XwAYjNdL.jpg:large" alt="test" className={styles.friend_request_profile_pic} />
					<div className={styles.friend_request_info_container}>
						<h3 className={styles.friend_request_username}>Herc</h3>
						<span className={styles.friend_request_email}>herc@gmail.com</span>
					</div>
					<div className={styles.accept_decline_container}>
						<button className={styles.accept}>
							<IoIosPersonAdd size="25px"/>
						</button>
						<button className={styles.decline}>
							<IoPersonRemove size="25px"/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FriendsModal;
