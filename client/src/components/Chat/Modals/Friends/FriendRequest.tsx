import React from "react";
import { User } from "../../../../types/user.types";
import { useAppDispatch, useAppSelector } from "../../../../redux/redux-hooks";
import axios from "axios";

import { Tooltip } from "@mui/material";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "../../../../styles/ChatPage/Modals/FriendsModal.module.css";
import { setFriends, setIncomingFriendRequests } from "../../../../redux/user/user.slice";

interface IProps {
	friendReq: User;
}

const FriendRequest: React.FC<IProps> = ({ friendReq }) => {
	const user = useAppSelector((state: any) => state.userInfo);

	const dispatch = useAppDispatch();

	const acceptFriendRequest = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post("/api/user/acceptFriendRequest", { friendId: friendReq._id }, config);
			toast.success(`${friendReq.username} has been added as a friend!`, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			dispatch(setFriends(data.friends));
			dispatch(setIncomingFriendRequests(data.setIncomingFriendRequests));
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

	const declineFriendRequest = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post("/api/user/declineFriendRequest", { friendId: friendReq._id }, config);
			dispatch(setIncomingFriendRequests(data.setIncomingFriendRequests));
			toast.info(`Declined ${friendReq.username}'s friend request`, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
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

	return (
		<div className={styles.friend_request}>
			<img src={friendReq.profilePic} alt={`${friendReq.username}'s profile pic`} className={styles.friend_profile_pic} />
			<div className={styles.friend_request_info_container}>
				<h3 className={styles.friend_request_username}>{friendReq.username}</h3>
				<span className={styles.friend_request_email}>{friendReq.email}</span>
			</div>
			<div className={styles.accept_decline_container}>
				<Tooltip title="Accept" arrow>
					<button className={styles.accept} onClick={() => acceptFriendRequest()}>
						<FaUserPlus size="100%" />
					</button>
				</Tooltip>
				<Tooltip title="Decline" arrow>
					<button className={styles.decline} onClick={() => declineFriendRequest()}>
						<FaUserTimes size="100%" />
					</button>
				</Tooltip>
			</div>
		</div>
	);
};

export default FriendRequest;
