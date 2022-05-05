import { useAppSelector } from "../redux/redux-hooks";

import SideDrawer from "../components/Chat/SideDrawer";

import styles from "../styles/ChatPage/ChatPage.module.css";

const ChatPage = () => {
	const { username } = useAppSelector((state) => state.userInfo);

	return (
		<div className={styles.chat_page}>
			<SideDrawer />
		</div>
	);
};

export default ChatPage;
