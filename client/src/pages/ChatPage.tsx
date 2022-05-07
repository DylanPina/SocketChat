import { useAppSelector } from "../redux/redux-hooks";
import SideDrawer from "../components/Chat/NavBar";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import MyProfile from "../components/Chat/Modals/MyProfile";

import styles from "../styles/ChatPage/ChatPage.module.css";

const ChatPage = () => {
	const myProfileModal = useAppSelector((state) => state.myProfileModal);

	return (
		<div className={styles.chat_page}>
			{myProfileModal.isOpen && <MyProfile />}
			<SideDrawer />
			<div className={styles.chat_container}>
				<MyChats />
				<ChatBox />
			</div>
		</div>
	);
};

export default ChatPage;
