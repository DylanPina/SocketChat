import React from "react";
import { useAppSelector } from "../../redux/redux-hooks";
import OneToOneChat from "./OneToOneChat";
import GroupChat from "./GroupChat";

import styles from "../../styles/ChatPage/ChatBox.module.css";

const ChatBox = () => {
	const { selectedChat } = useAppSelector((state) => state.chats);
	const { smallScreen } = useAppSelector((state) => state.screenDimensions);

	return (
		<React.Fragment>
			{((selectedChat && smallScreen) || !smallScreen) && (
				<div className={smallScreen ? styles.chat_box_full : styles.chat_box}>{selectedChat?.isGroupChat ? <GroupChat /> : <OneToOneChat />}</div>
			)}
		</React.Fragment>
	);
};

export default ChatBox;
