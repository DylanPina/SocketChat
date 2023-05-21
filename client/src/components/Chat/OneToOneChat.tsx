import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setSelectedChat } from "../../redux/chats/chats.slice";
import { setSelectedUser } from "../../redux/user/selected-user.slice";
import { toggleMyChats } from "../../redux/modals/modals.slice";
import { getSender } from "../../config/ChatLogic";
import { Message } from "../../types/message.types";
import Chat from "./Chat";
import toastConfig from "../../config/ToastConfig";

import { toast } from "react-toastify";
import { FaArrowAltCircleLeft, FaSkullCrossbones } from "react-icons/fa";
import { MdNotifications, MdNotificationsOff } from "react-icons/md";
import LoadingSpinner from "../Utils/LoadingSpinner";
import { Tooltip } from "@mui/material";
import styles from "../../styles/ChatPage/OneToOneChat.module.css";
import { muteUser, unmuteUser } from "../../redux/notifications/notifications.slice";
import DeleteOneOnOneChatModal from "./Modals/DeleteOneToOneChatModal";
import useFetchNotifications from "../../hooks/useFetchNotifications";
import useFetchChats from "../../hooks/useFetchChats";
import useRemoveNotification from "../../hooks/useRemoveNotifications";
import { User } from "../../types/user.types";

toast.configure();

const socket = io(process.env.REACT_APP_BACKEND_URL ?? "");
let selectedChatCompare: any;

const OneToOneChat = () => {
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [newMessage, setNewMessage] = useState<string>("");
	const [userMuted, setUserMuted] = useState<boolean>(false);
	const [socketConnected, setSocketConnected] = useState<boolean>(false);
	const [typing, setTyping] = useState<boolean>(false);
	const [isTyping, setIsTyping] = useState<User | null>(null);
	const [typingTimeout, setTypingTimeout] = useState<any | undefined>(undefined);
	const [deleteChatModalOpen, setDeleteChatModalOpen] = useState<boolean>(false);
	const fetchChats = useFetchChats();
	const fetchNotifications = useFetchNotifications();

	const { selectedChat } = useAppSelector((state: any) => state.chats);
	const { mediumScreen, mobileScreen } = useAppSelector((state: any) => state.screenDimensions);
	const { mutedUsers } = useAppSelector((state: any) => state.notifications);
	const dispatch = useAppDispatch();
	const removeNotification = useRemoveNotification();
	const user = JSON.parse(localStorage.getItem("userInfo") || "");
	const { token } = user;

	useEffect(() => {
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", (userTyping) => setIsTyping(userTyping));
		socket.on("stop typing", () => setIsTyping(null));
		socket.on("message recieved", (newMessageRecieved: Message) => {
			// We're checking to see if the newly recieved message is in the current chat
			if (selectedChatCompare && selectedChatCompare._id === newMessageRecieved.chat._id) {
				setMessages((oldMessages: Array<Message>) => [...oldMessages, newMessageRecieved]);
			}
			fetchChats();
		});
		socket.on("notification recieved", async (newNotificationRecieved: Message) => {
			// We're checking to see if the newly recieved notification is in the current chat
			if (selectedChatCompare && selectedChatCompare._id === newNotificationRecieved.chat._id) {
				removeNotification(token, newNotificationRecieved);
			} else {
				fetchNotifications();
			}
		});

		return () => {
			socket.off("connected");
			socket.off("typing");
			socket.off("stop typing");
			socket.off("message recieved");
			socket.off("notification recieved");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		selectedChatCompare = selectedChat;
		fetchMessages();
		clearChatNotifications().then(() => fetchNotifications());
		getUserIsMuted();
		fetchChats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChat]);

	const fetchMessages = async () => {
		if (!selectedChat || !token) return;

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};

			setLoading(true);
			const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
			setMessages(data);
			setLoading(false);

			socket.emit("join chat", user, selectedChat._id);
		} catch (error: any) {
			toast.error("Failed to fetch messages", toastConfig);
		}
	};

	const clearChatNotifications = async () => {
		if (!selectedChat) return;

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			await axios.post(
				"/api/message/notifications/removeByChat",
				{ chatId: selectedChat._id },
				config
			);
		} catch (error: any) {
			toast.error(error.response.data.error, toastConfig);
		}
	};

	const typingHandler = (e: any) => {
		setNewMessage(e.target.value);

		if (!typing) {
			setTyping(true);
			socket.emit("typing", { room: selectedChat._id, userTyping: user });
			setTypingTimeout(setTimeout(typingTimeoutFunction, 3000));
		} else {
			clearTimeout(typingTimeout);
			setTypingTimeout(setTimeout(typingTimeoutFunction, 3000));
		}
	};

	const typingTimeoutFunction = () => {
		setTyping(false);
		socket.emit("stop typing", selectedChat._id);
	};

	const sendMessage = async (e: any) => {
		if (e.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};

				const { data } = await axios.post(
					"/api/message",
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				socket.emit("new message", data);
				setNewMessage("");
				setMessages((oldMessages: Array<Message>) => [...oldMessages, data]);

				await axios
					.post(
						"/api/message/notifications/send",
						{
							messageId: data._id,
							chatId: selectedChat._id,
						},
						config
					)
					.then(() => socket.emit("new notification", data));
			} catch (error: any) {
				toast.error(error, toastConfig);
			}
		}
	};

	const handleToggleMyChats = () => {
		if (!mediumScreen && !mobileScreen) {
			dispatch(toggleMyChats());
		}

		if (mediumScreen || mobileScreen) {
			dispatch(setSelectedChat(null));
		}
	};

	const handleMute = async () => {
		if (userMuted) {
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await axios.post(
					"/api/user/unmuteUser",
					{ userToUnmuteId: getSender(user, selectedChat.users)._id },
					config
				);
				dispatch(unmuteUser(data));
				setUserMuted(false);
				toast.success(
					`${getSender(user, selectedChat.users).username} has been unmuted`,
					toastConfig
				);
			} catch (error: any) {
				toast.error(error, toastConfig);
			}
		} else {
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await axios.post(
					"/api/user/muteUser",
					{ userToMuteId: getSender(user, selectedChat.users)._id },
					config
				);
				dispatch(muteUser(data));
				setUserMuted(true);
				toast.success(
					`${getSender(user, selectedChat.users).username} has been muted`,
					toastConfig
				);
			} catch (error: any) {
				toast.error(error, toastConfig);
			}
		}
	};

	const getUserIsMuted = () => {
		mutedUsers.forEach((mutedUser: any) => {
			if (mutedUser._id === getSender(user, selectedChat.users)._id) setUserMuted(true);
		});
	};

	return (
		<>
			{selectedChat ? (
				<div className={styles.chat_area}>
					<div className={styles.header_container}>
						<Tooltip title="Toggle chats menu" arrow>
							<button className={styles.toggle_mychats} onClick={handleToggleMyChats}>
								<FaArrowAltCircleLeft size={"85%"} />
							</button>
						</Tooltip>
						<div className={styles.chat_title_container}>
							<img
								className={styles.chat_image}
								src={getSender(user, selectedChat.users).profilePic}
								alt="Profile"
								onClick={() => dispatch(setSelectedUser(getSender(user, selectedChat.users)))}
							/>
							<h1 className={styles.chat_title}>{getSender(user, selectedChat.users).username}</h1>
						</div>

						<div className={styles.mute_leave_container}>
							<Tooltip
								title={`${userMuted ? "Unmute" : "Mute"} ${
									getSender(user, selectedChat.users).username
								}`}
								arrow
							>
								<button className={styles.mute} onClick={() => handleMute()}>
									{userMuted ? (
										<MdNotificationsOff size={"50%"} color={"white"} />
									) : (
										<MdNotifications size={"50%"} color={"white"} />
									)}
								</button>
							</Tooltip>
							<Tooltip title="Leave chat" arrow>
								<button className={styles.leave} onClick={() => setDeleteChatModalOpen(true)}>
									<FaSkullCrossbones size={"50%"} color={"white"} />
								</button>
							</Tooltip>
						</div>
						{deleteChatModalOpen && (
							<DeleteOneOnOneChatModal
								setDeleteChatModalOpen={setDeleteChatModalOpen}
							></DeleteOneOnOneChatModal>
						)}
					</div>
					<div className={styles.chat_section}>
						{loading ? (
							<div className={styles.loading_container}>
								<LoadingSpinner size={"25%"} />
							</div>
						) : (
							<div className={styles.messages_section}>
								<Chat messages={messages} isTyping={isTyping} />
							</div>
						)}
						<input
							type="text"
							placeholder="Enter a message.."
							className={styles.message_bar}
							onChange={typingHandler}
							onKeyDown={sendMessage}
							value={newMessage}
						/>
					</div>
				</div>
			) : (
				<div className={styles.message_prompt}>
					<h1 className={styles.prompt_title}>No chat selected</h1>
					<h1 className={styles.prompt_subtitle}>Click on a user or chat to start chatting</h1>
				</div>
			)}
		</>
	);
};

export default OneToOneChat;
