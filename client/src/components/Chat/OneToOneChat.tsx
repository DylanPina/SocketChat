import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setFetchChatsAgain, setSelectedChat } from "../../redux/chats/chats.slice";
import { setSelectedUser } from "../../redux/user/selected-user.slice";
import { toggleMyChats } from "../../redux/modals/modals.slice";
import { getSender } from "../../config/ChatLogic";
import { Message } from "../../types/message.types";
import Chat from "./Chat";

import { toast } from "react-toastify";
import { FaArrowAltCircleLeft, FaSkullCrossbones } from "react-icons/fa";
import { MdNotifications, MdNotificationsOff } from "react-icons/md";
import LoadingSpinner from "../Utils/LoadingSpinner";
import animationData from "../../animations/typing.json";
import { Tooltip } from "@mui/material";
import styles from "../../styles/ChatPage/OneToOneChat.module.css";
import { muteUser, unmuteUser } from "../../redux/notifications/notifications.slice";
import DeleteOneOnOneChatModal from "./Modals/DeleteOneToOneChatModal";

toast.configure();

const ENDPOINT = "https://socket-chat-dsp.herokuapp.com/";
var socket: any, selectedChatCompare: any;

const OneToOneChat = () => {
	const [messages, setMessages] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [newMessage, setNewMessage] = useState<string>();
	const [userMuted, setUserMuted] = useState<boolean>(false);
	const [socketConnected, setSocketConnected] = useState<boolean>(false);
	const [typing, setTyping] = useState<boolean>(false);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [deleteChatModalOpen, setDeleteChatModalOpen] = useState<boolean>(false);

	const user = useAppSelector((state: any) => state.userInfo);
	const { selectedChat } = useAppSelector((state: any) => state.chats);
	const { mediumScreen, mobileScreen } = useAppSelector((state: any) => state.screenDimensions);
	const { mutedUsers } = useAppSelector((state: any) => state.notifications);
	const dispatch = useAppDispatch();
	const userInfo = localStorage.getItem("userInfo");
	const { token } = JSON.parse(userInfo || "");

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
		clearNotifications();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
		mutedUsers.forEach((mutedUser: any) => {
			if (mutedUser._id === getSender(user, selectedChat.users)._id) setUserMuted(true);
		});
		// Re-render the myChats component
		dispatch(setFetchChatsAgain(true));
		setTimeout(() => {
			dispatch(setFetchChatsAgain(false));
		});
	}, [selectedChat]);

	useEffect(() => {
		socket.on("message recieved", (newMessageRecieved: Message) => {
			// We're checking to see if the newly recieved message is in the current chat
			if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
				dispatch(setFetchChatsAgain(true));
				setTimeout(() => {
					dispatch(setFetchChatsAgain(false));
				});
				console.log("message recieved from sc");
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

	const clearNotifications = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
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

	const handleMute = async () => {
		if (userMuted) {
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await axios.post("/api/user/unmuteUser", { userToUnmuteId: getSender(user, selectedChat.users)._id }, config);
				dispatch(unmuteUser(data));
				setUserMuted(false);
				toast.success(`${getSender(user, selectedChat.users).username} has been unmuted`, {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
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
		} else {
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await axios.post("/api/user/muteUser", { userToMuteId: getSender(user, selectedChat.users)._id }, config);
				dispatch(muteUser(data));
				setUserMuted(true);
				toast.success(`${getSender(user, selectedChat.users).username} has been muted`, {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
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
							<Tooltip title={`${userMuted ? "Unmute" : "Mute"} ${getSender(user, selectedChat.users).username}`} arrow>
								<button className={styles.mute} onClick={() => handleMute()}>
									{userMuted ? <MdNotificationsOff size={"50%"} color={"white"} /> : <MdNotifications size={"50%"} color={"white"} />}
								</button>
							</Tooltip>
							<Tooltip title="Leave chat" arrow>
								<button className={styles.leave} onClick={() => setDeleteChatModalOpen(true)}>
									<FaSkullCrossbones size={"50%"} color={"white"} />
								</button>
							</Tooltip>
						</div>
						{deleteChatModalOpen && <DeleteOneOnOneChatModal setDeleteChatModalOpen={setDeleteChatModalOpen}></DeleteOneOnOneChatModal>}
					</div>
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
						{/* {isTyping ? (
							<div>
								<Lottie options={defaultOptions} width={"100px"} height={"50px"} style={{ marginBottom: 0, marginLeft: 0 }} />
							</div>
						) : (
							<></>
						)} */}
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
