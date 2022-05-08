import { IconContext } from "react-icons";
import { CgClose } from "react-icons/cg";
import { useAppDispatch } from "../../../redux/redux-hooks";
import { setSelectedUser } from "../../../redux/modals/search.slice";

import styles from "../../../styles/ChatPage/Modals/UserProfile.module.css";

interface IProps {
	user: IUser;
}

interface IUser {
	createdAt: string;
	email: string;
	password: string;
	profilePic: string | null;
	updatedAt: string;
	username: string;
	__v: number;
	_id: string;
}

const UserProfile: React.FC<IProps> = ({ user }) => {
	const dispatch = useAppDispatch();

	return (
		<div className={styles.modal}>
			<div className={styles.user_profile}>
				<div onClick={() => dispatch(setSelectedUser(undefined))}>
					<IconContext.Provider value={{ className: styles.close_button }}>
						<CgClose />
					</IconContext.Provider>
				</div>
				<img className={styles.profile_pic} src={user.profilePic || ""} alt="Profile" />
				<div className={styles.info_section}>
					<div className={styles.info_container}>
						<label className={styles.info_label}>USERNAME</label>
						<h2 className={styles.username}>{user.username}</h2>
					</div>
					<div className={styles.info_container}>
						<label className={styles.info_label}>EMAIL</label>
						<h2 className={styles.email}>{user.email}</h2>
					</div>
				</div>
				<button className={styles.start_chatting}>Start chatting</button>
				<button className={styles.add_friend}>Add friend</button>
			</div>
		</div>
	);
};

export default UserProfile;
