import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogic";
import { useAppSelector } from "../../redux/redux-hooks";

import styles from "../../styles/ChatPage/Chat.module.css";

interface IProps {
	messages: any;
}

const Chat: React.FC<IProps> = ({ messages }) => {
	const user = useAppSelector((state) => state.userInfo);

	return (
		<ScrollableFeed>
			{messages &&
				messages.map((m: any, i: number) => (
					<div className={styles.messages} key={m._id}>
						{(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
							<img className={styles.profile_pic} src={m.sender.profilePic} alt={m.sender.name} />
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
		</ScrollableFeed>
	);
};

export default Chat;
