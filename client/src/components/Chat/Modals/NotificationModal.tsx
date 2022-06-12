import { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { removeNotification } from "../../../redux/notifications/notifications.slice";
import { setSelectedChat } from "../../../redux/chats/chats.slice";
import { Message } from "../../../types/message.types";

import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { HiUserGroup } from "react-icons/hi";
import styles from "../../../styles/ChatPage/Modals/NotificationModal.module.css";

const NotificationModal = () => {
	const user = useAppSelector((state) => state.userInfo);
	const { notifications } = useAppSelector((state) => state.notifications);
	const { selectedChat } = useAppSelector((state) => state.chats);
	const dispatch = useAppDispatch();

	useEffect(() => {
		console.log(notifications);
	}, [notifications]);

	const handleNotiClick = async (noti: Message) => {
		console.log(noti);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			console.log(user.token);
			const { data } = await axios.post("/api/message/notifications/removeOne", { notificationId: noti._id }, config);
			console.log(data);
		} catch (error: any) {
			toast.error(error, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
		if (!selectedChat || selectedChat._id.toString() !== noti.chat._id.toString()) {
			dispatch(setSelectedChat(noti.chat));
		}
		dispatch(removeNotification(noti));
	};

	return (
		<div className={styles.noti_modal}>
			<div className={styles.noti_header_container}>
				<h1 className={styles.noti_header}>{`Notifications: ${notifications.length}`}</h1>
			</div>
			<div className={styles.noti_container}>
				{!notifications.length ? (
					<h1 className={styles.no_noti}>No new notifications</h1>
				) : (
					notifications.map((noti: Message) => (
						<>
							{noti.chat?.isGroupChat ? (
								<div className={styles.single_noti_container} key={noti._id} onClick={() => handleNotiClick(noti)}>
									<IconContext.Provider value={{ className: styles.groupchat_icon }}>
										<HiUserGroup />
									</IconContext.Provider>
									<div className={styles.single_noti_content_container}>
										<h1 className={styles.single_noti_sender_name}>{noti.chat.chatName}</h1>
										<p className={styles.single_noti_msg_content}>{noti.content}</p>
									</div>
								</div>
							) : (
								<div className={styles.single_noti_container} key={noti._id} onClick={() => handleNotiClick(noti)}>
									<img src={`${noti.sender?.profilePic}`} alt={`${noti.sender?.username}`} className={styles.sender_profile_pic} />
									<div className={styles.single_noti_content_container}>
										<h3 className={styles.single_noti_sender_name}>{noti.sender.username}</h3>
										<p className={styles.single_noti_msg_content}>{noti.content}</p>
									</div>
								</div>
							)}
						</>
					))
				)}
			</div>
		</div>
	);
};

export default NotificationModal;
