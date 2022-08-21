import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { removeNotification, removeAllNotifications } from "../../../redux/notifications/notifications.slice";
import { setSelectedChat } from "../../../redux/chats/chats.slice";
import { Message } from "../../../types/message.types";

import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { HiUserGroup } from "react-icons/hi";
import styles from "../../../styles/ChatPage/Modals/NotificationModal.module.css";

const NotificationModal = () => {
	const user = useAppSelector((state: any) => state.userInfo);
	const { notifications } = useAppSelector((state: any) => state.notifications);
	const { selectedChat } = useAppSelector((state: any) => state.chats);
	const dispatch = useAppDispatch();

	const handleNotiClick = async (noti: Message) => {
		if (!selectedChat || selectedChat._id.toString() !== noti.chat._id.toString()) {
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				};
				const { data } = await axios.get(`/api/chat/${noti.chat._id}`, config);
				dispatch(setSelectedChat(data[0]));
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
		}
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			await axios.post("/api/message/notifications/removeOne", { notificationId: noti._id }, config);
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
		dispatch(removeNotification(noti));
	};

	const clearNotifications = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			await axios.delete("/api/message/notifications/removeAll", config);
			dispatch(removeAllNotifications());
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
	};

	return (
		<div className={styles.noti_modal}>
			<div className={styles.noti_header_container}>
				<h1 className={styles.noti_header}>{`Notifications: ${notifications.length}`}</h1>
				<button className={styles.clear_all_btn} onClick={() => clearNotifications()}>
					Clear All
				</button>
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
