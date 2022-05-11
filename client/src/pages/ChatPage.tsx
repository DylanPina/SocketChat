import { useAppSelector } from "../redux/redux-hooks";
import SideDrawer from "../components/Chat/NavBar";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import MyProfile from "../components/Chat/Modals/MyProfile";
import UserProfile from "../components/Chat/Modals/UserProfile";

import styles from "../styles/ChatPage/ChatPage.module.css";

const ChatPage = () => {
	const myProfileModal = useAppSelector((state) => state.myProfileModal);
	const { selectedUser } = useAppSelector((state) => state.searchSlice);

	return (
		<div className={styles.chat_page}>
			{myProfileModal.isOpen && <MyProfile />}
			{selectedUser && <UserProfile user={selectedUser} />}
			<SideDrawer />
			<div className={styles.chat_container}>
				<MyChats />
				<ChatBox />
			</div>
		</div>
	);
};

export default ChatPage;
