import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setSelectedChat } from "../../redux/chats/chats.slice";
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
import { User } from "../../types/user.types";

toast.configure();

const ENDPOINT = "http://localhost:5000";
const socket = io(ENDPOINT);
let selectedChatCompare: any;

const GroupChat = () => {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [loading, setLoading] = useState(true);
	const [newMessage, setNewMessage] = useState<string>("");
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState<User | null>(null);
	const [typingTimeout, setTypingTimeout] = useState<any | undefined>(undefined);
	const fetchChats = useFetchChats();
	const fetchNotifications = useFetchNotifications();

	const { selectedChat } = useAppSelector((state: any) => state.chats);
	const { mediumScreen, mobileScreen } = useAppSelector((state: any) => state.screenDimensions);
	const dispatch = useAppDispatch();
	const user = JSON.parse(localStorage.getItem("userInfo") || "");
	const { token } = user;

	useEffect(() => {
		socket.emit("setup", user);
		socket.on("connected", () => {
			setSocketConnected(true);
		});
		socket.on("typing", (userTyping) => setIsTyping(userTyping));
		socket.on("stop typing", () => setIsTyping(null));
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
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		selectedChatCompare = selectedChat;
		fetchMessages();
		clearGroupChatNotifications().then(() => fetchNotifications());
		fetchChats();
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

			socket.emit("join chat", user, selectedChat._id);
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
	);
};

export default GroupChat;
