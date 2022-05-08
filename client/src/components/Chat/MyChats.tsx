import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setSelectedChat, setChats, setFetchChatsAgain } from "../../redux/chats/chats.slice";
import { MdOutlineGroupAdd } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { toast } from "react-toastify";
import axios from "axios";

import styles from "../../styles/ChatPage/MyChats.module.css";
import { IconContext } from "react-icons";
import LoadingSpinner from "../Utils/LoadingSpinner";

toast.configure();

const MyChats = () => {
	const [currentUser, setCurrentUser] = useState();
	const [chatsLoading, setChatsLoading] = useState(false);

	const chats = useAppSelector((state) => state.chats.chats);
	const fetchChatsAgain = useAppSelector((state) => state.chats.fetchChatsAgain);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo) setCurrentUser(JSON.parse(userInfo));
		const { token } = JSON.parse(userInfo || "");
		const fetchChats = async () => {
			setChatsLoading(true);
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await axios.get("/api/chat", config);
				dispatch(setChats(data));
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
			setChatsLoading(false);
		};
		fetchChats();
	}, [fetchChatsAgain]);

	return (
		<div className={styles.my_chats}>
			<div className={styles.header}>
				<h1 className={styles.title}>Chats</h1>
				<button className={styles.create_groupchat}>
					New groupchat
					<IconContext.Provider value={{ className: styles.groupchat__icon_header }}>
						<MdOutlineGroupAdd />
					</IconContext.Provider>
				</button>
			</div>
			<div className={chatsLoading ? styles.chats__box_centered : styles.chats_box}>
				{chatsLoading ? (
					<LoadingSpinner size="100px" />
				) : (
					chats &&
					chats.map((chat: any) => (
						<div className={styles.chat} key={chat._id}>
							{chat.isGroupChat ? (
								<IconContext.Provider value={{ className: styles.groupchat_icon }}>
									<HiUserGroup />
								</IconContext.Provider>
							) : (
								<img className={styles.chat_pic} src={chat.users[0].profilePic || ""} alt={chat.users[0].username} />
							)}
							<h1 className={styles.chat_name}>{chat.chatName}</h1>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default MyChats;
