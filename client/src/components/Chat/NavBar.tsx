import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { toggleSearchDrawerOpen } from "../../redux/modals/search.slice";
import axios from "axios";
import { toggleUserSettings } from "../../redux/modals/user-settings.slice";
import SearchDrawer from "./Modals/SearchDrawer";
import UserSettings from "./Modals/UserSettings";
import NotificationModal from "./Modals/NotificationModal";

import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { FaUserFriends } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa";
import styles from "../../styles/ChatPage/NavBar.module.css";

toast.configure();

const NavBar = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loadingResults, setLoadingResults] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);
	const [userSettings, setUserSettings] = useState(false);
	const [notificationModal, setNotificationModal] = useState(false);

	const dispatch = useAppDispatch();

	const user = useAppSelector((state) => state.userInfo);
	const userSettingsModal = useAppSelector((state) => state.userSettingsModal);
	const searchSlice = useAppSelector((state) => state.searchSlice);

	const toggleUserSettingsModal = () => {
		dispatch(toggleUserSettings());
	};

	const submitSearch = async (e: any) => {
		if (e.key === "Enter") {
			try {
				setLoadingResults(true);

				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				};

				const { data } = await axios.get(`/api/user?search=${search}`, config);
				console.log(data);

				setLoadingResults(false);
				setSearchResult(data);
			} catch (error) {
				toast.error(error, {
					position: toast.POSITION.TOP_LEFT,
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
				setLoadingResults(false);
			}
		}
	};

	return (
		<React.Fragment>
			<div className={styles.navbar}>
				<h1 className={styles.title}>⚡SocketChat⚡</h1>
				<div className={styles.search_bar}>
					<IconContext.Provider value={{ className: styles.search_icon }}>
						<FaSearchengin />
					</IconContext.Provider>
					<input
						className={styles.search_input}
						type="text"
						value={search}
						placeholder="Search for a user by name or email"
						onChange={(e: any) => setSearch(e.target.value)}
						onKeyDown={submitSearch}
						onFocus={() => dispatch(toggleSearchDrawerOpen())}
						onBlur={() => {
							setTimeout(() => {
								dispatch(toggleSearchDrawerOpen());
							}, 100);
						}}
					/>
				</div>
				<div className={styles.user_features}>
					<IconContext.Provider value={{ className: styles.friends_icon }}>
						<FaUserFriends />
					</IconContext.Provider>
					<button className={styles.notifications_icon} onClick={() => setNotificationModal(!notificationModal)}>
						<MdNotifications size={"100%"} />
					</button>
					<img className={styles.profile_pic} src={user.profilePic} alt="Profile" onClick={toggleUserSettingsModal} />
				</div>
			</div>
			{notificationModal && <NotificationModal />}
			{userSettingsModal.isOpen && <UserSettings />}
			{searchSlice.searchDrawerOpen && <SearchDrawer searchResults={searchResult} loadingResults={loadingResults} />}
		</React.Fragment>
	);
};

export default NavBar;
