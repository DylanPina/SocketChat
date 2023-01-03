import React from "react";
import { useAppSelector } from "../../redux/redux-hooks";
import OneToOneChat from "./OneToOneChat";
import GroupChat from "./GroupChat";

import styles from "../../styles/ChatPage/ChatBox.module.css";

const ChatBox = () => {
	const { selectedChat } = useAppSelector((state: any) => state.chats);
	const { mediumScreen, mobileScreen } = useAppSelector((state: any) => state.screenDimensions);
	const { myChats } = useAppSelector((state: any) => state.modals);

	return (
		<React.Fragment>
			{((selectedChat && mediumScreen) || (selectedChat && mobileScreen) || (!mediumScreen && !mobileScreen)) && (
				<div className={mediumScreen || mobileScreen || !myChats ? styles.chat_box_full : styles.chat_box}>
					{selectedChat?.isGroupChat ? <GroupChat /> : <OneToOneChat />}
				</div>
			)}
		</React.Fragment>
	);
};

export default ChatBox;
