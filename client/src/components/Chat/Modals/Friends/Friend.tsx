import React from "react";
import { User } from "../../../../types/user.types";
import { useAppDispatch } from "../../../../redux/redux-hooks";
import { setSelectedUser } from "../../../../redux/user/selected-user.slice";

import styles from "../../../../styles/ChatPage/Modals/FriendsModal.module.css";

interface IProps {
	friend: User;
}

const Friend: React.FC<IProps> = ({ friend }) => {
	const dispatch = useAppDispatch();

	return (
		<div className={styles.friend} onClick={() => dispatch(setSelectedUser(friend))}>
			<img src={friend.profilePic} alt={`${friend.username}'s profile pic`} className={styles.friend_profile_pic} />
			<div className={styles.friend_info_container}>
				<h3 className={styles.friend_username}>{friend.username}</h3>
				<span className={styles.friend_email}>{friend.email}</span>
			</div>
		</div>
	);
};

export default Friend;
