import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/redux-hooks";
import { toggleMyProfile } from "../../../redux/modals/modals.slice";
import { toggleUserSettings } from "../../../redux/modals/modals.slice";

import styles from "../../../styles/ChatPage/Modals/UserSettings.module.css";

const UserSettings = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const toggleMyProfileModal = () => {
		dispatch(toggleMyProfile());
		dispatch(toggleUserSettings());
	};

	const logoutHandler = () => {
		localStorage.removeItem("userInfo");
		dispatch(toggleUserSettings());
		navigate("/");
	};

	return (
		<div className={styles.user_settings}>
			<ul className={styles.options}>
				<li className={styles.option} onClick={toggleMyProfileModal}>
					My Profile
				</li>
				<li className={styles.option} id={styles.logout} onClick={logoutHandler}>
					Logout
				</li>
			</ul>
		</div>
	);
};

export default UserSettings;
