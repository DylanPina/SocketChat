import { useAppDispatch } from "../../../redux/redux-hooks";
import { toggleMyProfile } from "../../../redux/modals/my-profile.slice";

import styles from "../../../styles/ChatPage/Modals/UserSettings.module.css";
import { toggleUserSettings } from "../../../redux/modals/user-settings.slice";

const UserSettings = () => {
	const dispatch = useAppDispatch();

	const toggleMyProfileModal = () => {
		dispatch(toggleMyProfile());
		dispatch(toggleUserSettings());
	};

	return (
		<div className={styles.user_settings}>
			<ul className={styles.options}>
				<li className={styles.option} onClick={toggleMyProfileModal}>
					My Profile
				</li>
				<li className={styles.option} id={styles.logout}>
					Logout
				</li>
			</ul>
		</div>
	);
};

export default UserSettings;
