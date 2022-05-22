import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { removeNotification } from "../../../redux/notifications/notifications.slice";
import { setSelectedChat } from "../../../redux/chats/chats.slice";
import { getSender } from "../../../config/ChatLogic";
import { Message } from "../../../types/message.types";

import styles from "../../../styles/ChatPage/Modals/NotificationModal.module.css";

const NotificationModal = () => {
	const user = useAppSelector((state) => state.userInfo);
	const { notifications } = useAppSelector((state) => state.notifications);
	const { selectedChat } = useAppSelector((state) => state.chats);
	const dispatch = useAppDispatch();

	useEffect(() => {
		console.log(notifications);
	}, [notifications]);

	const handleNotiClick = (noti: Message) => {
		dispatch(removeNotification(noti));
		if (selectedChat._id !== noti.chat._id) dispatch(setSelectedChat(noti.chat));
	};

	return (
		<div className={styles.noti_modal}>
			<div className={styles.noti_header_container}>
				<h1 className={styles.noti_header}>{`Notifications ${notifications.length}`}</h1>
			</div>
			<div className={styles.noti_container}>
				{!notifications.length ? (
					<h1 className={styles.no_noti}>No new notifications</h1>
				) : (
					notifications.map((noti: Message) => (
						<div className={styles.single_noti_container} key={noti._id} onClick={() => handleNotiClick(noti)}>
							{noti.chat.isGroupChat ? (
								<h1 className={styles.single_noti}>{`New message in ${noti.chat.chatName}`}</h1>
							) : (
								<h1 className={styles.single_noti}>{`New message from ${getSender(user, noti.chat.users).username}`}</h1>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default NotificationModal;
