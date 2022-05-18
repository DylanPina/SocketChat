import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { setFetchChatsAgain } from "../../redux/chats/chats.slice";
import { setSelectedUser } from "../../redux/modals/search.slice";
import { getSender } from "../../config/ChatLogic";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";

import { toast } from "react-toastify";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { MdSettingsApplications } from "react-icons/md";
import styles from "../../styles/ChatPage/OneToOneChat.module.css";
import LoadingSpinner from "../Utils/LoadingSpinner";

toast.configure();

const OneToOneChat = () => {
	const [messages, setMessages] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [newMessage, setNewMessage] = useState<string>();

	const user = useAppSelector((state) => state.userInfo);
	const { selectedChat } = useAppSelector((state) => state.chats);
	const dispatch = useAppDispatch();

	useEffect(() => {
		fetchMessages();
		console.log("Re-rendered");
	}, [selectedChat]);

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
			console.log(messages);
			setLoading(false);
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

		// Typing indicator logic
	};

	const sendMessage = async (e: any) => {
		if (e.key === "Enter" && newMessage) {
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

				console.log(data);

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
				<>
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
						<input
							type="text"
							placeholder="Enter a message.."
							className={styles.message_bar}
							onChange={typingHandler}
							onKeyDown={sendMessage}
							value={newMessage}
						/>
					</div>
				</>
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
