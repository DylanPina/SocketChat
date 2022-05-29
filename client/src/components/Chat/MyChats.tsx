import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setSelectedChat, setChats } from "../../redux/chats/chats.slice";
import { toggleCreateGroupChat } from "../../redux/modals/modals.slice";
import { getSender } from "../../config/ChatLogic";
import useWindowDimensions from "../../config/hooks/useWindowDimensions";

import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { Tooltip } from "@mui/material";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineGroupAdd } from "react-icons/md";
import LoadingSpinner from "../Utils/LoadingSpinner";
import styles from "../../styles/ChatPage/MyChats.module.css";

toast.configure();

const MyChats = () => {
	const [currentUser, setCurrentUser] = useState();
	const [chatsLoading, setChatsLoading] = useState(false);
	const [smallScreen, setSmallScreen] = useState(false);
	const [smallScreenView, setSmallScreenView] = useState(false);

	const chats = useAppSelector((state) => state.chats.chats);
	const selectedChat = useAppSelector((state) => state.chats.selectedChat);
	const fetchChatsAgain = useAppSelector((state) => state.chats.fetchChatsAgain);
	const dispatch = useAppDispatch();

	const userInfo = localStorage.getItem("userInfo");

	// FOR SCREEN WIDTH < 1050px
	const { height, width } = useWindowDimensions();

	useEffect(() => {
		if (width < 1050) {
			setSmallScreen(true);
		} else {
			setSmallScreen(false);
		}
		if (!selectedChat && smallScreen) {
			setSmallScreenView(true);
		} else {
			setSmallScreenView(false);
		}
	}, [width, height, []]);

	useEffect(() => {
		if (userInfo) setCurrentUser(JSON.parse(userInfo));
		const { token } = JSON.parse(userInfo || "");
		const fetchChats = async () => {
			setChatsLoading(true);
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await axios.get("/api/chat", config);
				dispatch(setChats(data));
			} catch (error) {
				toast.error(error, {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
			setChatsLoading(false);
		};
		fetchChats();
	}, [fetchChatsAgain]);

	return (
		<React.Fragment>
			{((!selectedChat && smallScreen) || !smallScreen) && (
				<div className={!smallScreenView ? styles.my_chats : styles.my_chats_small} style={{}}>
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
									className={chat === selectedChat ? styles.chat_selected : styles.chat}
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
											<img className={styles.chat_pic} src={chat.users[0].profilePic || ""} alt={chat.users[0].username} />
											<div className={styles.chat_info_container}>
												<h1 className={styles.chat_sender_username}>{getSender(currentUser, chat.users).username}</h1>
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
