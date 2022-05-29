import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { toggleMyProfile } from "../../../redux/modals/modals.slice";
import { IconContext } from "react-icons";
import { CgClose } from "react-icons/cg";

import styles from "../../../styles/ChatPage/Modals/MyProfile.module.css";

const MyProfile = () => {
	const user = useAppSelector((state) => state.userInfo);
	const dispatch = useAppDispatch();

	const toggleMyProfileModal = () => {
		dispatch(toggleMyProfile());
	};

	return (
		<div className={styles.modal}>
			<div className={styles.my_profile}>
				<div onClick={toggleMyProfileModal}>
					<IconContext.Provider value={{ className: styles.close_button }}>
						<CgClose />
					</IconContext.Provider>
				</div>
				<img className={styles.profile_pic} src={user.profilePic} alt="Profile" />
				<button className={styles.change_pic}>Change Avatar</button>
				<div className={styles.info_section}>
					<div className={styles.info_container}>
						<label className={styles.info_label}>USERNAME</label>
						<div className={styles.username_container}>
							<h2 className={styles.username}>{user.username}</h2>
							<button className={styles.edit_username}>Edit</button>
						</div>
					</div>
					<div className={styles.info_container}>
						<label className={styles.info_label}>EMAIL</label>
						<div className={styles.email_container}>
							<h2 className={styles.email}>{user.email}</h2>
							<button className={styles.edit_email}>Edit</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyProfile;
