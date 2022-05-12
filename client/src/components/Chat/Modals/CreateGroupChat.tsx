import { useAppDispatch } from "../../../redux/redux-hooks";
import { IconContext } from "react-icons";
import { toggleCreateGroupChatModal } from "../../../redux/modals/modals.slice";
import { CgClose } from "react-icons/cg";

import styles from "../../../styles/ChatPage/Modals/CreateGroupChat.module.css";

const CreateGroupChat = () => {
	const dispatch = useAppDispatch();

	const closeCreateGroupChatModal = () => {
		dispatch(toggleCreateGroupChatModal());
	};

	return (
		<div className={styles.modal}>
			<div className={styles.container}>
				<div onClick={closeCreateGroupChatModal}>
					<IconContext.Provider value={{ className: styles.close_button }}>
						<CgClose />
					</IconContext.Provider>
				</div>
				<h2 className={styles.title}>Create Group Chat</h2>
				<div className={styles.input_section}>
					<div className={styles.input_container}>
						<label className={styles.label}>Chat Name</label>
						<input type="text" className={styles.input} />
					</div>
					<div className={styles.input_container}>
						<label className={styles.label}>Users</label>
						<input type="text" className={styles.input} />
					</div>
				</div>
				<button className={styles.create_btn}>Create</button>
			</div>
		</div>
	);
};

export default CreateGroupChat;
