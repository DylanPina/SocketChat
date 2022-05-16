import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setFetchChatsAgain } from "../../redux/chats/chats.slice";
import { setSelectedUser } from "../../redux/modals/search.slice";
import { getSender } from "../../config/ChatLogic";

import { FaArrowAltCircleLeft } from "react-icons/fa";
import { MdSettingsApplications } from "react-icons/md";
import styles from "../../styles/ChatPage/OneToOneChat.module.css";

const OneToOneChat = () => {
	const user = useAppSelector((state) => state.userInfo);
	const { selectedChat } = useAppSelector((state) => state.chats);
	const dispatch = useAppDispatch();

	return (
		<>
			{selectedChat ? (
				<>
					<div className={styles.header_container}>
						<button className={styles.toggle_mychats}>
							<FaArrowAltCircleLeft size={"100%"} />
						</button>
						<div className={styles.chat_title_container}>
							<img
								className={styles.chat_image}
								src={getSender(user, selectedChat.users).profilePic}
								alt="Profile"
								onClick={() => dispatch(setSelectedUser(getSender(user, selectedChat.users)))}
							/>
							<h1 className={styles.chat_title}>{getSender(user, selectedChat.users).username}</h1>
						</div>
						<button className={styles.chat_settings}>
							<MdSettingsApplications size={"100%"} />
						</button>
					</div>
					<div className={styles.chat_section}>This is a single chat</div>
				</>
			) : (
				<div className={styles.message_prompt}>
					<h1 className={styles.prompt_title}>No chat selected</h1>
					<h1 className={styles.prompt_subtitle}>Click on a user or chat to start chatting</h1>
				</div>
			)}
		</>
	);
};

export default OneToOneChat;
