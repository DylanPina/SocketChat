import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
	const [chats, setChats] = useState<any>();

	const fetchChats = async () => {
		const { data } = await axios.get("/api/chat");
		setChats(data);
	};

	useEffect(() => {
		fetchChats();
	}, []);

	return (
		<div>
			{chats.map((chat: any) => {
				return <div key={chat._id}>{chat.chatName}</div>;
			})}
		</div>
	);
};

export default ChatPage;
