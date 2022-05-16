import { useAppSelector } from "../../redux/redux-hooks";
import OneToOneChat from "./OneToOneChat";
import GroupChat from "./GroupChat";

import styles from "../../styles/ChatPage/ChatBox.module.css";

const ChatBox = () => {
	const { selectedChat } = useAppSelector((state) => state.chats);

	return <div className={styles.chat_box}>{selectedChat?.isGroupChat ? <GroupChat /> : <OneToOneChat />}</div>;
};

export default ChatBox;
