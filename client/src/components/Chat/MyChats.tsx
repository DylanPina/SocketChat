import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setSelectedChat } from "../../redux/chats/chats.slice";
import { toggleCreateGroupChat } from "../../redux/modals/modals.slice";
import { getSender } from "../../config/ChatLogic";

import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { Tooltip } from "@mui/material";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineGroupAdd } from "react-icons/md";
import LoadingSpinner from "../Utils/LoadingSpinner";
import styles from "../../styles/ChatPage/MyChats.module.css";
import useFetchNotifications from "../../hooks/useFetchNotifications";
import useFetchChats from "../../hooks/useFetchChats";

toast.configure();

const MyChats = () => {
	const [chatsLoading, setChatsLoading] = useState(false);
	const [smallScreenView, setSmallScreenView] = useState(false);
	const [largeScreenView, setLargeScreenView] = useState(false);

	const user = useAppSelector((state: any) => state.userInfo);
	const chats = useAppSelector((state: any) => state.chats.chats);
	const selectedChat = useAppSelector((state: any) => state.chats.selectedChat);
	const { myChats } = useAppSelector((state: any) => state.modals);
	const { mediumScreen, mobileScreen } = useAppSelector((state: any) => state.screenDimensions);
	const dispatch = useAppDispatch();
	const fetchNotifications = useFetchNotifications();
	const fetchChats = useFetchChats();

	useEffect(() => {
		fetchChats();
		fetchNotifications();
	}, []);

	useEffect(() => {
		if ((!selectedChat && mediumScreen) || (!selectedChat && mobileScreen)) setSmallScreenView(true);
		else setSmallScreenView(false);

		if (!mediumScreen && !mobileScreen) setLargeScreenView(true);
		else setLargeScreenView(false);
	}, [mediumScreen, mobileScreen, []]);

	return (
		<React.Fragment>
			{((!selectedChat && mediumScreen) || (!selectedChat && mobileScreen) || (largeScreenView && myChats)) && (
				<div className={!smallScreenView ? styles.my_chats : styles.my_chats_small}>
					<div className={styles.header}>
						<h1 className={styles.title}>Chats</h1>
						<Tooltip title="Create a new groupchat" arrow>
							<button className={styles.create_groupchat} onClick={() => dispatch(toggleCreateGroupChat())}>
								<IconContext.Provider value={{ className: styles.groupchat_icon_header }}>
									<MdOutlineGroupAdd />
								</IconContext.Provider>
							</button>
						</Tooltip>
					</div>
					<div className={chatsLoading ? styles.chats_box_centered : styles.chats_box}>
						{chatsLoading ? (
							<LoadingSpinner size="100px" />
						) : (
							chats &&
							chats.map((chat: any) => (
								<div
									className={chat?._id === selectedChat?._id ? styles.chat_selected : styles.chat}
									key={chat._id}
									onClick={() => dispatch(setSelectedChat(chat))}
								>
									{chat.isGroupChat ? (
										<>
											<IconContext.Provider value={{ className: styles.groupchat_icon }}>
												<HiUserGroup />
											</IconContext.Provider>
											<div className={styles.chat_info_container}>
												<h1 className={styles.chat_name}>{chat.chatName}</h1>
												{chat.latestMessage && (
													<p className={styles.chat_latest_msg_sender}>
														{`${chat.latestMessage.sender.username}: `}
														<span className={styles.chat_latest_msg}>{chat.latestMessage.content}</span>
													</p>
												)}
											</div>
										</>
									) : (
										<>
											<img className={styles.chat_pic} src={getSender(user, chat.users).profilePic} alt={chat.users[0].username} />
											<div className={styles.chat_info_container}>
												<h1 className={styles.chat_sender_username}>{getSender(user, chat.users).username}</h1>
												{chat.latestMessage && (
													<p className={styles.chat_latest_msg_sender}>
														{`${chat.latestMessage.sender.username}: `}
														<span className={styles.chat_latest_msg}>{chat.latestMessage.content}</span>
													</p>
												)}
											</div>
										</>
									)}
								</div>
							))
						)}
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default MyChats;
