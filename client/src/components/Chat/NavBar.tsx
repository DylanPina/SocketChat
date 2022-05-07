import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import UserSettings from "./Modals/UserSettings";
import { toggleUserSettings } from "../../redux/modals/user-settings.slice";
import { IconContext } from "react-icons";
import { FaUserFriends } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa";

import styles from "../../styles/ChatPage/NavBar.module.css";

const NavBar = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);
	const [userSettings, setUserSettings] = useState(false);

	const dispatch = useAppDispatch();

	const user = useAppSelector((state) => state.userInfo);
	const userSettingsModal = useAppSelector((state) => state.userSettingsModal);

	const toggleUserSettingsModal = () => {
		dispatch(toggleUserSettings());
	};

	return (
		<>
			<div className={styles.navbar}>
				<h1 className={styles.title}>⚡SocketChat⚡</h1>
				<div className={styles.search_bar}>
					<IconContext.Provider value={{ className: styles.search_icon }}>
						<FaSearchengin />
					</IconContext.Provider>
					<input className={styles.search_input} type="text" placeholder="Search for a user" />
				</div>
				<div className={styles.user_features}>
					<IconContext.Provider value={{ className: styles.friends_icon }}>
						<FaUserFriends />
					</IconContext.Provider>
					<IconContext.Provider value={{ className: styles.notifications_icon }}>
						<MdNotifications />
					</IconContext.Provider>
					<img className={styles.profile_pic} src={user.profilePic} alt="Profile" onClick={toggleUserSettingsModal} />
				</div>
			</div>
			{userSettingsModal.isOpen && <UserSettings />}
		</>
	);
};

export default NavBar;
