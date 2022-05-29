import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/redux-hooks";
import Navbar from "../components/Chat/NavBar";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import MyProfile from "../components/Chat/Modals/MyProfile";
import UserProfile from "../components/Chat/Modals/UserProfile";
import CreateGroupChat from "../components/Chat/Modals/CreateGroupChat";

import styles from "../styles/ChatPage/ChatPage.module.css";

const ChatPage = () => {
	const { myProfile } = useAppSelector((state) => state.modals);
	const { selectedUser } = useAppSelector((state) => state.selectedUser);
	const { createGroupChat } = useAppSelector((state) => state.modals);

	return (
		<div className={styles.chat_page}>
			<Navbar />
			{selectedUser && <UserProfile user={selectedUser} />}
			{myProfile && <MyProfile />}
			{createGroupChat && <CreateGroupChat />}
			<div className={styles.chat_container}>
				<MyChats />
				<ChatBox />
			</div>
		</div>
	);
};

export default ChatPage;
