import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { useAppSelector } from "../../../redux/redux-hooks";
import toastConfig from "../../../config/ToastConfig";

import { toast } from "react-toastify";
import styles from "../../../styles/ChatPage/Modals/DeleteOneToOneChatModal.module.css";

interface IProps {
	setDeleteChatModalOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteOneToOneChatModal: React.FC<IProps> = ({ setDeleteChatModalOpen }) => {
	const { selectedChat } = useAppSelector((state: any) => state.chats);

	const userInfo = localStorage.getItem("userInfo");
	const { token } = JSON.parse(userInfo || "");

	const handleDeleteChat = async () => {
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			await axios.post("/api/chat/deleteOneOnOneChat", { chatId: selectedChat._id }, config);
			window.location.reload();
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	return (
		<div className={styles.modal}>
			<div className={styles.card}>
				<h1 className={styles.you_sure}>Are you sure you want to delete this chat?</h1>
				<div className={styles.btn_container}>
					<button className={styles.yes} onClick={handleDeleteChat}>
						Yes
					</button>
					<button className={styles.no} onClick={() => setDeleteChatModalOpen(false)}>
						No
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteOneToOneChatModal;
