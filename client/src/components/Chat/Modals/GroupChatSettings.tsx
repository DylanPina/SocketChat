import React, { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { setFetchChatsAgain, setSelectedChat } from "../../../redux/chats/chats.slice";
import toastConfig from "../../../config/ToastConfig";

import { toast } from "react-toastify";
import LoadingSpinner from "../../Utils/LoadingSpinner";
import { CgClose } from "react-icons/cg";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import styles from "../../../styles/ChatPage/Modals/GroupChatSettings.module.css";

interface IProps {
	setSettingsOpen: Dispatch<SetStateAction<boolean>>;
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

toast.configure();

const GroupChatSettings: React.FC<IProps> = ({ setSettingsOpen }) => {
	const [groupChatName, setGroupChatName] = useState<string>("");
	const [selectedUsers, setSelectedUsers] = useState<[IUser] | any>([]);
	const [search, setSearch] = useState<string>("");
	const [searchResults, setSearchResults] = useState([]);
	const [showSearchResults, setShowSearchResults] = useState(false);
	const [loading, setLoading] = useState(false);

	const { selectedChat } = useAppSelector((state: any) => state.chats);
	const user = useAppSelector((state: any) => state.userInfo);
	const dispatch = useAppDispatch();

	const toggleSearchResultsShown = () => {
		setShowSearchResults(!showSearchResults);
	};

	const handleRename = async () => {
		if (!groupChatName) return;

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.put("/api/chat/grouprename", { chatId: selectedChat._id, newChatName: groupChatName }, config);

			dispatch(setSelectedChat(data));
			// Re-render the myChats component
			dispatch(setFetchChatsAgain(true));
			setTimeout(() => {
				dispatch(setFetchChatsAgain(false));
			});
			toast.success("Group chat renamed", toastConfig);
		} catch (error: any) {
			toast.error(error, toastConfig);
			setGroupChatName("");
		}
	};

	const handleAddUser = async (userToAdd: IUser) => {
		// Check if user is already in group
		if (selectedChat.users.find((u: IUser) => u._id === userToAdd._id)) {
			toast.error(`${user.username} is already in group`, toastConfig);
			return;
		}
		// Check if user is an admin
		if (selectedChat.groupAdmin._id !== user._id) {
			toast.error(`Only the group admin can add users to the group`, toastConfig);
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.put(
				"/api/chat/groupadd",
				{
					chatId: selectedChat._id,
					userId: userToAdd._id,
				},
				config
			);

			dispatch(setSelectedChat(data));
			// Re-render the myChats component
			dispatch(setFetchChatsAgain(true));
			setTimeout(() => {
				dispatch(setFetchChatsAgain(false));
			});
			setLoading(false);
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	const handleRemove = async (userToRemove: IUser) => {
		// Check if user is an admin and user isn't trying to remove himself
		if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
			toast.error(`Only the group admin can add users to the group`, toastConfig);
			return;
		}

		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.put(
				"/api/chat/groupremove",
				{
					chatId: selectedChat._id,
					userId: userToRemove._id,
				},
				config
			);
			dispatch(setSelectedChat(data));
			// Re-render the myChats component
			dispatch(setFetchChatsAgain(true));
			setTimeout(() => {
				dispatch(setFetchChatsAgain(false));
			});
			setLoading(false);
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	const handleLeaveGroup = async () => {
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			await axios.put(
				"/api/chat/groupremove",
				{
					chatId: selectedChat._id,
					userId: user._id,
				},
				config
			);
			dispatch(setSelectedChat(null));
			// Re-render the myChats component
			dispatch(setFetchChatsAgain(true));
			setTimeout(() => {
				dispatch(setFetchChatsAgain(false));
			});
			setLoading(false);
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	const handleSearch = async (query: string) => {
		setSearch(query);

		if (!query) {
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(`/api/user?search=${search}`, config);
			setLoading(false);
			setSearchResults(data);
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	return (
		<div className={styles.modal}>
			<div className={styles.settings_modal}>
				<button className={styles.close_button} onClick={() => setSettingsOpen(false)}>
					<CgClose size={"80%"} />
				</button>
				<h2 className={styles.chat_name}>{selectedChat.chatName}</h2>
				<div className={styles.input_section}>
					<div className={styles.input_container}>
						<label className={styles.label}>Update Chat Name</label>
						<input type="text" placeholder="" className={styles.input} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
						<button className={styles.rename_button} onClick={() => handleRename()}>
							<MdOutlineDriveFileRenameOutline size={"80%"} />
						</button>
					</div>
					<div className={styles.input_container}>
						<label className={styles.label}>Add or Remove Users</label>

						<input type="text" placeholder="" className={styles.input} value={search} onChange={(e) => handleSearch(e.target.value)} />
						<div className={styles.triangle_icon} onClick={toggleSearchResultsShown}>
							{showSearchResults ? <VscTriangleUp /> : <VscTriangleDown />}
						</div>
					</div>
					{showSearchResults && (
						<div className={styles.search_drawer}>
							{loading ? (
								<div className={styles.loading_container}>
									<LoadingSpinner size={"25px"} />
								</div>
							) : searchResults.length === 0 ? (
								<h1 className={styles.no_results}>No results</h1>
							) : (
								searchResults.map((user: any, key: number) => (
									<div className={styles.user_container} key={key} onClick={() => handleAddUser(user)}>
										<img className={styles.profile_pic} src={user.profilePic || ""} alt={user.username} />
										<div className={styles.user__info_container}>
											<h2 className={styles.user_name}>{user.username}</h2>
											<h3 className={styles.email}>{user.email}</h3>
										</div>
									</div>
								))
							)}
						</div>
					)}
					{selectedChat.users.length !== 0 && (
						<div className={styles.selected_user_container}>
							{selectedChat.users.map((user: IUser) => (
								<div className={styles.selected_user} key={user._id}>
									<h3 className={styles.user_name_selected}>{user.username}</h3>
									<button className={styles.close_button_selected} onClick={() => handleRemove(user)}>
										<CgClose size={"100%"} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				<button className={styles.leave_group} onClick={() => handleLeaveGroup()}>
					Leave Group
				</button>
			</div>
		</div>
	);
};

export default GroupChatSettings;
