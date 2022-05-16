import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setFetchChatsAgain } from "../../redux/chats/chats.slice";
import { setSelectedUser } from "../../redux/modals/search.slice";
import { getSender } from "../../config/ChatLogic";

import { IconContext } from "react-icons/lib";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { MdSettingsApplications } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import GroupChatSettings from "./Modals/GroupChatSettings";

import styles from "../../styles/ChatPage/GroupChat.module.css";

const GroupChat = () => {
	const [settingsOpen, setSettingsOpen] = useState(false);

	const user = useAppSelector((state) => state.userInfo);
	const { selectedChat } = useAppSelector((state) => state.chats);
	const dispatch = useAppDispatch();

	return (
		<>
			<div className={styles.header_container}>
				<button className={styles.toggle_mychats}>
					<FaArrowAltCircleLeft size={"100%"} />
				</button>
				<div className={styles.chat_title_container}>
					<IconContext.Provider value={{ className: styles.groupchat_icon }}>
						<HiUserGroup size={"100%"} />
					</IconContext.Provider>
					<h1 className={styles.chat_title}>{selectedChat.chatName}</h1>
				</div>
				<button className={styles.chat_settings} onClick={() => setSettingsOpen(true)}>
					<MdSettingsApplications size={"100%"} />
				</button>
			</div>
			<div className={styles.chat_section}>This is a groupchat</div>
			{settingsOpen && <GroupChatSettings setSettingsOpen={setSettingsOpen} />}
		</>
	);
};

export default GroupChat;
