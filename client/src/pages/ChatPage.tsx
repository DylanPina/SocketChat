import { useAppSelector } from "../redux/redux-hooks";
import Navbar from "../components/Chat/NavBar";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import MyProfile from "../components/Chat/Modals/MyProfile";
import UserProfile from "../components/Chat/Modals/UserProfile";

import styles from "../styles/ChatPage/ChatPage.module.css";
import CreateGroupChat from "../components/Chat/Modals/CreateGroupChat";

const ChatPage = () => {
	const myProfileModal = useAppSelector((state) => state.myProfileModal);
	const { selectedUser } = useAppSelector((state) => state.searchSlice);
	const { createGroupChatIsOpen } = useAppSelector((state) => state.modals);

	return (
		<div className={styles.chat_page}>
			{myProfileModal.isOpen && <MyProfile />}
			{selectedUser && <UserProfile user={selectedUser} />}
			{createGroupChatIsOpen && <CreateGroupChat />}
			<Navbar />
			<div className={styles.chat_container}>
				<MyChats />
				<ChatBox />
			</div>
		</div>
	);
};

export default ChatPage;
