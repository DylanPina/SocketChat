import React, { useEffect } from "react";
import { useAppSelector } from "../../redux/redux-hooks";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogic";
import ScrollableFeed from "react-scrollable-feed";

import { Tooltip } from "@mui/material";
import styles from "../../styles/ChatPage/Chat.module.css";
import { User } from "../../types/user.types";
import TypingIndicator from "../Utils/TypingIndicator";

interface IProps {
	messages: any;
	isTyping: User | null;
}

const Chat: React.FC<IProps> = ({ messages, isTyping }) => {
	const user = useAppSelector((state) => state.userInfo);

	return (
		<ScrollableFeed>
			{messages &&
				messages.map((m: any, i: number) => (
					<div className={styles.messages} key={m._id}>
						{(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
							<Tooltip title={`${m.sender.username}`} arrow>
								<img className={styles.profile_pic} src={m.sender.profilePic} alt={m.sender.username} />
							</Tooltip>
						)}
						<span
							className={styles.single_message}
							style={{
								backgroundColor: `${m.sender._id === user._id ? "#f09030" : "rgb(196, 196, 196, 0.75)"}`,
								marginLeft: isSameSenderMargin(messages, m, i, user._id),
								marginTop: isSameUser(messages, m, i) ? 5 : 10,
							}}
						>
							{m.content}
						</span>
					</div>
				))}
			{isTyping && (
				<div className={styles.is_typing_container}>
					<Tooltip title={`${isTyping.username}`} arrow>
						<img className={styles.profile_pic} src={isTyping.profilePic} alt={isTyping.username} />
					</Tooltip>
					<TypingIndicator />
				</div>
			)}
		</ScrollableFeed>
	);
};

export default Chat;
