import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { setSelectedUser } from "../../../redux/user/selected-user.slice";
import { setSelectedChat, setFetchChatsAgain, setChats } from "../../../redux/chats/chats.slice";
import { IconContext } from "react-icons";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";

import styles from "../../../styles/ChatPage/Modals/UserProfile.module.css";

interface IProps {
	user: IUser;
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

const UserProfile: React.FC<IProps> = ({ user }) => {
	const [userMuted, setUserMuted] = useState<boolean>(false);
	const chats = useAppSelector((state: any) => state.chats.chats);
	const userInfo = localStorage.getItem("userInfo");
	const { token } = JSON.parse(userInfo || "");

	const dispatch = useAppDispatch();

	useEffect(() => {
		const fetchMutedUsers = async () => {
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await axios.get("/api/user/fetchMutedUsers", config);
				console.log(data);
				data.forEach((mutedUser: any) => {
					if (mutedUser._id === user._id) setUserMuted(true);
				});
			} catch (error) {
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
		fetchMutedUsers();
	}, []);

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

	const handleMute = async () => {
		if (userMuted) {
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const userId = user._id;
				await axios.post("/api/user/unmuteUser", { userToUnmuteId: userId }, config);
				setUserMuted(false);
				toast.success(`${user.username} has been unmuted`, {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			} catch (error) {
				toast.error(error, {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
		} else {
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const userId = user._id;
				await axios.post("/api/user/muteUser", { userToMuteId: userId }, config);
				setUserMuted(true);
				toast.success(`${user.username} has been muted`, {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			} catch (error) {
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
	};

	return (
		<div className={styles.modal}>
			<div className={styles.user_profile}>
				<div onClick={() => dispatch(setSelectedUser(undefined))}>
					<IconContext.Provider value={{ className: styles.close_button }}>
						<CgClose />
					</IconContext.Provider>
				</div>
				<img className={styles.profile_pic} src={user.profilePic || ""} alt="Profile" />
				<div className={styles.info_section}>
					<div className={styles.info_container}>
						<label className={styles.info_label}>USERNAME</label>
						<h2 className={styles.username}>{user.username}</h2>
					</div>
					<div className={styles.info_container}>
						<label className={styles.info_label}>EMAIL</label>
						<h2 className={styles.email}>{user.email}</h2>
					</div>
				</div>
				<div className={styles.buttons_container}>
					<button className={styles.add_friend}>Add friend</button>
					<button className={styles.start_chatting} onClick={() => accessChat(user._id)}>
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
