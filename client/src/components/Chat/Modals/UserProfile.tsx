import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { setSelectedUser } from "../../../redux/user/selected-user.slice";
import { setSelectedChat, setFetchChatsAgain, setChats } from "../../../redux/chats/chats.slice";
import { muteUser, unmuteUser } from "../../../redux/notifications/notifications.slice";
import { setFriends, setIncomingFriendRequests, setOutgoingFriendRequests } from "../../../redux/user/user.slice";
import { User } from "../../../types/user.types";
import toastConfig from "../../../config/ToastConfig";

import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { CgClose } from "react-icons/cg";
import LoadingSpinner from "../../Utils/LoadingSpinner";
import styles from "../../../styles/ChatPage/Modals/UserProfile.module.css";

interface IProps {
	selectedUser: IUser;
}

interface IUser {
	createdAt: string;
	email: string;
	password: string;
	profilePic: string | null;
	updatedAt: string;
	username: string;
	__v: number;
	_id: string;
}

toast.configure();

const UserProfile: React.FC<IProps> = ({ selectedUser }) => {
	const [userMuted, setUserMuted] = useState<boolean>(false);
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [friendRequestRecieved, setFriendRequestRecieved] = useState<boolean>(false);
	const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const user = useAppSelector((state: any) => state.userInfo);
	const { chats } = useAppSelector((state: any) => state.chats);
	const { mutedUsers } = useAppSelector((state: any) => state.notifications);
	const userInfo = localStorage.getItem("userInfo");
	const { token } = JSON.parse(userInfo || "");

	const dispatch = useAppDispatch();

	useEffect(() => {
		fetchFriends();
		fetchIncomingFriendRequests();
		fetchOutgoingFriendRequests();
		if (user.friends?.some((x: User) => x._id === selectedUser._id)) {
			setIsFriend(true);
		} else {
			setIsFriend(false);
		}

		if (user.incomingFriendRequests?.some((x: User) => x._id === selectedUser._id)) {
			setFriendRequestRecieved(true);
		} else {
			setFriendRequestRecieved(false);
		}

		if (user.outgoingFriendRequests?.some((x: User) => x._id === selectedUser._id)) {
			setFriendRequestSent(true);
		} else {
			setFriendRequestSent(false);
		}

		if (mutedUsers?.some((x: User) => x._id === selectedUser._id)) {
			setUserMuted(true);
		} else {
			setUserMuted(false);
		}
	}, []);

	const sendFriendRequest = async () => {
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await axios.post("/api/user/sendFriendRequest", { recipientId: selectedUser._id }, config);
			dispatch(setOutgoingFriendRequests(data.outgoingFriendRequests));
			setFriendRequestSent(true);
			toast.success(`Friend request sent to ${selectedUser.username}. They will be added to your friends list if they accept.`, toastConfig);
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	const unsendFriendRequest = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post("/api/user/unsendFriendRequest", { friendId: selectedUser._id }, config);
			dispatch(setOutgoingFriendRequests(data.outgoingFriendRequests));
			setFriendRequestSent(false);
			toast.success(`Friend request unsent to ${selectedUser.username}`, toastConfig);
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	const acceptFriendRequest = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post("/api/user/acceptFriendRequest", { friendId: selectedUser._id }, config);
			setIsFriend(true);
			toast.success(`${selectedUser.username} has been added as a friend!`, toastConfig);
			dispatch(setFriends(data.friends));
			dispatch(setIncomingFriendRequests(data.setIncomingFriendRequests));
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	const unaddFriend = async () => {
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await axios.post("/api/user/removeFriend", { friendId: selectedUser._id }, config);
			dispatch(setFriends(data.friends));
			setIsFriend(false);
			toast.success(`${selectedUser.username} has been unadded as a friend`, toastConfig);
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	const accessChat = async (userId: string) => {
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await axios.post("/api/chat", { userId }, config);
			// If the chat does not exisit we will just append the chat to our chat state
			if (!chats.find((chat: any) => chat._id === data._id)) setChats([data, ...chats]);
			dispatch(setSelectedChat(data));
			dispatch(setSelectedUser(undefined));
			// Re-render the myChats component
			dispatch(setFetchChatsAgain(true));
			setTimeout(() => {
				dispatch(setFetchChatsAgain(false));
			});
		} catch (error) {
			toast.error(error, toastConfig);
		}
	};

	const handleMute = async () => {
		if (userMuted) {
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const userId = selectedUser._id;
				const { data } = await axios.post("/api/user/unmuteUser", { userToUnmuteId: userId }, config);
				dispatch(unmuteUser(data));

				toast.success(`${selectedUser.username} has been unmuted`, toastConfig);
			} catch (error) {
				toast.error(error, toastConfig);
			}
		} else {
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const userId = selectedUser._id;
				const { data } = await axios.post("/api/user/muteUser", { userToMuteId: userId }, config);
				dispatch(muteUser(data));

				toast.success(`${selectedUser.username} has been muted`, toastConfig);
			} catch (error) {
				toast.error(error, toastConfig);
			}
		}
	};

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
			toast.error(error, toastConfig);
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
			toast.error(error, toastConfig);
		}
	};

	const fetchOutgoingFriendRequests = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get("/api/user/fetchOutgoingFriendRequests", config);
			dispatch(setOutgoingFriendRequests(data));
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	return (
		<div className={styles.modal}>
			<div className={styles.user_profile}>
				<div onClick={() => dispatch(setSelectedUser(undefined))}>
					<IconContext.Provider value={{ className: styles.close_button }}>
						<CgClose />
					</IconContext.Provider>
				</div>
				<img className={styles.profile_pic} src={selectedUser.profilePic || ""} alt="Profile" />
				<div className={styles.info_section}>
					<div className={styles.info_container}>
						<label className={styles.info_label}>USERNAME</label>
						<h2 className={styles.username}>{selectedUser.username}</h2>
					</div>
					<div className={styles.info_container}>
						<label className={styles.info_label}>EMAIL</label>
						<h2 className={styles.email}>{selectedUser.email}</h2>
					</div>
				</div>
				<div className={styles.buttons_container}>
					{loading && <LoadingSpinner size={"100%"} />}
					{!isFriend && !friendRequestSent && !friendRequestRecieved && (
						<button className={styles.friend_button} onClick={() => sendFriendRequest()}>
							Add friend
						</button>
					)}
					{isFriend && (
						<button className={styles.friend_button} onClick={() => unaddFriend()}>
							Unadd Friend
						</button>
					)}
					{friendRequestSent && (
						<button className={styles.friend_button} onClick={() => unsendFriendRequest()}>
							Unsend friend request
						</button>
					)}
					{friendRequestRecieved && (
						<button className={styles.friend_button} onClick={() => acceptFriendRequest()}>
							Accept friend request
						</button>
					)}
					<button className={styles.start_chatting} onClick={() => accessChat(selectedUser._id)}>
						Start chatting
					</button>
					<button className={userMuted ? styles.unmute_user : styles.mute_user} onClick={() => handleMute()}>
						{userMuted ? "Unmute user" : "Mute user"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
