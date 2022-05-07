import { useAppDispatch } from "../../../redux/redux-hooks";
import { toggleMyProfile } from "../../../redux/modals/my-profile.slice";
import { CgClose } from "react-icons/cg";
import { IconContext } from "react-icons";

import styles from "../../../styles/ChatPage/Modals/MyProfile.module.css";

const MyProfile = () => {
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
			</div>
		</div>
	);
};

export default MyProfile;
