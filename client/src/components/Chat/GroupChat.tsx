import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setFetchChatsAgain, setSelectedChat } from "../../redux/chats/chats.slice";
import { toggleMyChats } from "../../redux/modals/modals.slice";
import Chat from "./Chat";
import GroupChatSettings from "./Modals/GroupChatSettings";
import { Message } from "../../types/message.types";

import { toast } from "react-toastify";
import { IconContext } from "react-icons/lib";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { MdSettingsApplications } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import LoadingSpinner from "../Utils/LoadingSpinner";
import styles from "../../styles/ChatPage/GroupChat.module.css";
import useFetchChats from "../../config/hooks/useFetchChats";
import useFetchNotifications from "../../config/hooks/useFetchNotifications";

toast.configure();

const ENDPOINT = "http://localhost:5000";
const socket = io(ENDPOINT);
let selectedChatCompare: any;

const GroupChat = () => {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [loading, setLoading] = useState(true);
	const [newMessage, setNewMessage] = useState<string>('');
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const fetchChats = useFetchChats();
	const fetchNotifications = useFetchNotifications();

	const { selectedChat } = useAppSelector((state: any) => state.chats);
	const { mediumScreen, mobileScreen } = useAppSelector((state: any) => state.screenDimensions);
	const dispatch = useAppDispatch();
	const user = JSON.parse(localStorage.getItem("userInfo") || "");
	const { token } = user;

	useEffect(() => {
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
		socket.on("message recieved", (newMessageRecieved: Message) => {
			// We're checking to see if the newly recieved message is in the current chat
			if (selectedChatCompare && selectedChatCompare._id === newMessageRecieved.chat._id) {
				setMessages((oldMessages: Array<Message>) => [...oldMessages, newMessageRecieved]);
			}
			fetchChats();
		});
		socket.on("notification recieved", (newNotificationRecieved: Message) => {
			// We're checking to see if the newly recieved notification is in the current chat
			if (selectedChatCompare && selectedChatCompare._id === newNotificationRecieved.chat._id) {
				clearGroupChatNotifications();
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		selectedChatCompare = selectedChat;
		fetchMessages();
		clearGroupChatNotifications();
		// Re-render the myChats component
		dispatch(setFetchChatsAgain(true));
		setTimeout(() => dispatch(setFetchChatsAgain(false)));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChat]);

	const fetchMessages = async () => {
		if (!selectedChat) return;

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

			socket.emit("join chat", selectedChat._id);
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
	};

	const clearGroupChatNotifications = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			await axios.post("/api/message/notifications/removeByChat", { chatId: selectedChat._id }, config);
		} catch (error: any) {
			toast.error(error.response.data.error, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
	};

	const typingHandler = (e: any) => {
		setNewMessage(e.target.value);
		// If the user is typing but no socket connection
		if (!socketConnected) return;
		// If the user is typing and the typing state is false
		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}
		// Debounce the typing time by 3 seconds
		let lastTypingTime: number = new Date().getTime();
		var timerLength = 3000;
		setTimeout(() => {
			var timeNow: number = new Date().getTime();
			var timeDifference = timeNow - lastTypingTime;

			if (timeDifference >= timerLength && typing) {
				socket.emit("stop typing", selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
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
				
				await axios.post(
					"/api/message/notifications/send",
					{
						messageId: data._id,
						chatId: selectedChat._id,
					},
					config
				);
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

	return (
		<div className={styles.chat_area}>
			<div className={styles.header_container}>
				<button className={styles.toggle_mychats} onClick={handleToggleMyChats}>
					<FaArrowAltCircleLeft size={"85%"} />
				</button>
				<div className={styles.chat_title_container}>
					<IconContext.Provider value={{ className: styles.groupchat_icon }}>
						<HiUserGroup size={"100%"} />
					</IconContext.Provider>
					<h1 className={styles.chat_title}>{selectedChat.chatName}</h1>
				</div>
				<button className={styles.chat_settings} onClick={() => setSettingsOpen(true)}>
					<MdSettingsApplications size={"100%"} />
				</button>
			</div>
			{settingsOpen && <GroupChatSettings setSettingsOpen={setSettingsOpen} />}
			<div className={styles.chat_section}>
				{loading ? (
					<div className={styles.loading_container}>
						<LoadingSpinner size={"25%"} />
					</div>
				) : (
					<div className={styles.messages_section}>
						<Chat messages={messages} />
					</div>
				)}
				{isTyping ? (
					<div>
						typing...
					</div>
				) : (
					<></>
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
	);
};

export default GroupChat;
