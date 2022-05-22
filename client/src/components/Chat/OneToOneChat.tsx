import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setFetchChatsAgain } from "../../redux/chats/chats.slice";
import { setSelectedUser } from "../../redux/modals/search.slice";
import { pushNotification } from "../../redux/notifications/notifications.slice";
import { getSender } from "../../config/ChatLogic";
import ScrollableChat from "./ScrollableChat";

import { toast } from "react-toastify";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { MdSettingsApplications } from "react-icons/md";
import LoadingSpinner from "../Utils/LoadingSpinner";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import styles from "../../styles/ChatPage/OneToOneChat.module.css";
import { Message } from "../../types/message.types";

toast.configure();

const ENDPOINT = "http://localhost:5000";
var socket: any, selectedChatCompare: any;

const OneToOneChat = () => {
	const [messages, setMessages] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [newMessage, setNewMessage] = useState<string>();
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const user = useAppSelector((state) => state.userInfo);
	const { selectedChat } = useAppSelector((state) => state.chats);
	const { notifications } = useAppSelector((state) => state.notifications);
	const dispatch = useAppDispatch();

	// For Lottie animations
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	useEffect(() => {
		socket.on("message recieved", (newMessageRecieved: Message) => {
			// We're checking to see if the newly recieved message is in the current chat
			if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
				// Checking to see if there's already a notification for the new message recieved
				if (!notifications.includes(newMessageRecieved)) {
					dispatch(pushNotification(newMessageRecieved));
					// Re-render the myChats component
					dispatch(setFetchChatsAgain(true));
					setTimeout(() => {
						dispatch(setFetchChatsAgain(false));
					});
					console.log("HIT");
				}
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	});

	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
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
						Authorization: `Bearer ${user.token}`,
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
				setMessages([...messages, data]);
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

	return (
		<>
			{selectedChat ? (
				<div className={styles.chat_area}>
					<div className={styles.header_container}>
						<button className={styles.toggle_mychats}>
							<FaArrowAltCircleLeft size={"100%"} />
						</button>
						<div className={styles.chat_title_container}>
							<img
								className={styles.chat_image}
								src={getSender(user, selectedChat.users).profilePic}
								alt="Profile"
								onClick={() => dispatch(setSelectedUser(getSender(user, selectedChat.users)))}
							/>
							<h1 className={styles.chat_title}>{getSender(user, selectedChat.users).username}</h1>
						</div>
						<button className={styles.chat_settings}>
							<MdSettingsApplications size={"100%"} />
						</button>
					</div>
					<div className={styles.chat_section}>
						{loading ? (
							<div className={styles.loading_container}>
								<LoadingSpinner size={"25%"} />
							</div>
						) : (
							<div className={styles.messages_section}>
								<ScrollableChat messages={messages} />
							</div>
						)}
						{isTyping ? (
							<div>
								<Lottie options={defaultOptions} width={"100px"} height={"50px"} style={{ marginBottom: 0, marginLeft: 0 }} />
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
