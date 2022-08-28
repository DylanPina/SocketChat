import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../../../../types/user.types";
import { useAppDispatch, useAppSelector } from "../../../../redux/redux-hooks";
import Friend from "./Friend";
import { setFriends, setIncomingFriendRequests } from "../../../../redux/user/user.slice";

import styles from "../../../../styles/ChatPage/Modals/FriendsModal.module.css";
import FriendRequest from "./FriendRequest";
import { toast } from "react-toastify";

const FriendsModal = () => {
	const [friendsSection, setFriendsSection] = useState<boolean>(true);
	const [friendRequestsSection, setFriendRequestsSection] = useState<boolean>(false);

	const user = useAppSelector((state: any) => state.userInfo);
	const dispatch = useAppDispatch();

	useEffect(() => {
		fetchFriends();
		fetchIncomingFriendRequests();
	}, [])

	const fetchFriends = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get("/api/user/fetchFriends", config);
			dispatch(setFriends(data));
		} catch (error: any) {
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

	const fetchIncomingFriendRequests = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get("/api/user/fetchIncomingFriendRequests", config);
			dispatch(setIncomingFriendRequests(data));
		} catch (error: any) {
			toast.error(error, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
	}

	return (
		<div className={styles.friends_modal}>
			<div className={styles.header}>
				<button
					className={friendsSection ? styles.option_selected : styles.option}
					onClick={() => {
						setFriendsSection(true);
						setFriendRequestsSection(false);
					}}
				>
					{`Friends: (${user.friends ? user.friends.length : 0})`}
				</button>
				<button
					className={friendRequestsSection ? styles.option_selected : styles.option}
					onClick={() => {
						setFriendsSection(false);
						setFriendRequestsSection(true);
					}}
				>
					{`Friend Requests: (${user.incomingFriendRequests ? user.incomingFriendRequests.length : 0})`}
				</button>
			</div>
			<div className={styles.friends_section}>
				{friendsSection && user.friends && user.friends.map((friend: User) => <Friend friend={friend}></Friend>)}
			</div>
			<div className={styles.friend_request_section}>
				{friendRequestsSection &&
					user.incomingFriendRequests &&
					user.incomingFriendRequests.map((friendReq: User) => <FriendRequest friendReq={friendReq}></FriendRequest>)}
			</div>
		</div>
	);
};

export default FriendsModal;
