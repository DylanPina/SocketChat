import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/redux-hooks";
import useWindowDimensions from "../../config/hooks/useWindowDimensions";
import OneToOneChat from "./OneToOneChat";
import GroupChat from "./GroupChat";

import styles from "../../styles/ChatPage/ChatBox.module.css";

const ChatBox = () => {
	const [smallScreen, setSmallScreen] = useState(false);
	const { selectedChat } = useAppSelector((state) => state.chats);

	// FOR SCREEN WIDTH < 1050px
	const { height, width } = useWindowDimensions();

	useEffect(() => {
		if (width < 1050) {
			setSmallScreen(true);
		} else {
			setSmallScreen(false);
		}
	}, [height, width]);

	return (
		<React.Fragment>
			{((selectedChat && smallScreen) || !smallScreen) && (
				<div className={smallScreen ? styles.chat_box_full : styles.chat_box}>{selectedChat?.isGroupChat ? <GroupChat /> : <OneToOneChat />}</div>
			)}
		</React.Fragment>
	);
};

export default ChatBox;
