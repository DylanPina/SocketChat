import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { toggleSearchDrawerOpen } from "../../redux/modals/search.slice";
import { toggleUserSettings } from "../../redux/modals/user-settings.slice";
import SearchDrawer from "./Modals/SearchDrawer";
import UserSettings from "./Modals/UserSettings";
import NotificationModal from "./Modals/NotificationModal";
import useWindowDimensions from "../../config/hooks/useWindowDimensions";

import { toast } from "react-toastify";
import { IconContext } from "react-icons";
import { FaUserFriends } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import styles from "../../styles/ChatPage/NavBar.module.css";

toast.configure();

const NavBar = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loadingResults, setLoadingResults] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);
	const [userSettings, setUserSettings] = useState(false);
	const [notificationModal, setNotificationModal] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [mobileSearch, setMobileSearch] = useState(false);

	const dispatch = useAppDispatch();

	const user = useAppSelector((state) => state.userInfo);
	const userSettingsModal = useAppSelector((state) => state.userSettingsModal);
	const searchSlice = useAppSelector((state) => state.searchSlice);
	const { notifications } = useAppSelector((state) => state.notifications);

	// FOR MOBILE SCREENS
	const { height, width } = useWindowDimensions();

	useEffect(() => {
		if (width < 600) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
		console.log(isMobile);
		console.log(`Mobile search: ${mobileSearch}`);
	}, [height, width]);

	const toggleUserSettingsModal = () => {
		dispatch(toggleUserSettings());
	};

	const handleSearch = async (searchQuery: string) => {
		setSearch(searchQuery);
		try {
			setLoadingResults(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(`/api/user?search=${searchQuery}`, config);
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
	};

	return (
		<React.Fragment>
			<div className={styles.navbar} style={{ justifyContent: isMobile && mobileSearch ? "center" : "space-between" }}>
				{((isMobile && !mobileSearch) || !isMobile) && <h1 className={styles.title}>⚡SocketChat⚡</h1>}
				{((isMobile && mobileSearch) || !isMobile) && (
					<div className={styles.search_bar}>
						<button className={styles.search_icon} onClick={() => setMobileSearch(!mobileSearch)}>
							<FaSearchengin size={"100%"} />
						</button>
						<input
							className={styles.search_input}
							type="text"
							value={search}
							placeholder="Search"
							onChange={(e: any) => {
								handleSearch(e.target.value);
							}}
							onFocus={() => dispatch(toggleSearchDrawerOpen())}
							onBlur={() => {
								setTimeout(() => {
									dispatch(toggleSearchDrawerOpen());
								}, 100);
							}}
						/>
					</div>
				)}
				{((isMobile && !mobileSearch) || !isMobile) && (
					<div className={styles.user_features}>
						{isMobile && (
							<button className={styles.search_icon} onClick={() => setMobileSearch(!mobileSearch)}>
								<FaSearchengin size={"100%"} />
							</button>
						)}
						<>
							<Tooltip title="Friends" arrow>
								<button className={styles.friends_icon}>
									<FaUserFriends size={"100%"} />
								</button>
							</Tooltip>
							<Tooltip title="Notifications" arrow>
								<button className={styles.notifications_icon} onClick={() => setNotificationModal(!notificationModal)}>
									<MdNotifications size={"100%"} />
								</button>
							</Tooltip>
							{notifications.length > 0 && (
								<div className={styles.notifications_badge}>
									<h1 className={styles.notifications_badge_number}>!</h1>
								</div>
							)}
							<Tooltip title="Profile" arrow>
								<button className={styles.profile_pic_btn}>
									<img className={styles.profile_pic} src={user.profilePic} alt="Profile" onClick={toggleUserSettingsModal} />
								</button>
							</Tooltip>
						</>
					</div>
				)}
				{searchSlice.searchDrawerOpen && <SearchDrawer searchResults={searchResult} loadingResults={loadingResults} />}
			</div>
			{notificationModal && <NotificationModal />}
			{userSettingsModal.isOpen && <UserSettings />}
		</React.Fragment>
	);
};

export default NavBar;
