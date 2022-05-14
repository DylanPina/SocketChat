import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { setSelectedUser } from "../../../redux/modals/search.slice";
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
	const chats = useAppSelector((state) => state.chats.chats);
	const userInfo = localStorage.getItem("userInfo");
	const { token } = JSON.parse(userInfo || "");

	const dispatch = useAppDispatch();

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
				<button className={styles.start_chatting} onClick={() => accessChat(user._id)}>
					Start chatting
				</button>
				<button className={styles.add_friend}>Add friend</button>
			</div>
		</div>
	);
};

export default UserProfile;
