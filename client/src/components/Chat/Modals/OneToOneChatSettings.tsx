import { Dispatch, SetStateAction } from "react";

import { CgClose } from "react-icons/cg";
import { ImExit } from "react-icons/im";
import { MdNotificationsOff } from "react-icons/md";
import styles from "../../../styles/ChatPage/Modals/OneToOneChatSettings.module.css";

interface IProps {
	setSettingsOpen: Dispatch<SetStateAction<boolean>>;
}

const OneToOneChatSettings: React.FC<IProps> = ({ setSettingsOpen }) => {
	return (
		<div className={styles.modal}>
			<div className={styles.settings_modal}>
				<button className={styles.close} onClick={() => setSettingsOpen(false)}>
					<CgClose size={"100%"} />
				</button>
				<h1 className={styles.title}>Chat Settings</h1>
				<div className={styles.line} />
				<div className={styles.btn_container}>
					<button className={styles.mute}>
						Mute user <MdNotificationsOff size={"20px"} />
					</button>
					<button className={styles.mute}>
						Leave chat <ImExit size={"17.5px"} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default OneToOneChatSettings;
