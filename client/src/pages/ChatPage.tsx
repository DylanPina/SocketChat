import { useAppSelector } from "../redux/redux-hooks";
import SideDrawer from "../components/Chat/NavBar";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import MyProfile from "../components/Chat/Modals/MyProfile";

import styles from "../styles/ChatPage/ChatPage.module.css";
import UserProfile from "../components/Chat/Modals/UserProfile";

const ChatPage = () => {
	const myProfileModal = useAppSelector((state) => state.myProfileModal);
	const searchState = useAppSelector((state) => state.searchSlice);

	return (
		<div className={styles.chat_page}>
			{myProfileModal.isOpen && <MyProfile />}
			{searchState.selectedUser && <UserProfile user={searchState.selectedUser} />}
			<SideDrawer />
			<div className={styles.chat_container}>
				<MyChats />
				<ChatBox />
			</div>
		</div>
	);
};

export default ChatPage;
