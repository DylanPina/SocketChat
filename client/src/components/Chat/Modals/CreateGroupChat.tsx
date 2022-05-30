// @ts-nocheck
import { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { setFetchChatsAgain } from "../../../redux/chats/chats.slice";
import { toggleCreateGroupChat } from "../../../redux/modals/modals.slice";
import LoadingSpinner from "../../Utils/LoadingSpinner";

import { IconContext } from "react-icons";
import { toast } from "react-toastify";
import { CgClose } from "react-icons/cg";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import styles from "../../../styles/ChatPage/Modals/CreateGroupChat.module.css";

toast.configure();

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

const CreateGroupChat = () => {
	const [groupChatName, setGroupChatName] = useState<string>("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState<string>("");
	const [searchResults, setSearchResults] = useState([]);
	const [showSearchResults, setShowSearchResults] = useState(false);
	const [loading, setLoading] = useState(false);

	const user = useAppSelector((state) => state.userInfo);
	const dispatch = useAppDispatch();

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
			console.log(data);
			setLoading(false);
			setSearchResults(data);
			console.log(searchResults.length);
		} catch (error) {
			toast.error(error, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
	};

	const handleGroupChatName = (chatName: string) => {
		setGroupChatName(chatName);
	};

	const closeCreateGroupChatModal = () => {
		dispatch(toggleCreateGroupChat());
	};

	const toggleSearchResultsShown = () => {
		setShowSearchResults(!showSearchResults);
	};

	const selectUser = (user: IUser) => {
		if (selectedUsers.includes(user)) return;
		setSelectedUsers([...selectedUsers, user]);
	};

	const removeFromSelected = (user: IUser) => {
		setSelectedUsers(selectedUsers.filter((x) => user._id !== x._id));
	};

	const handleCreateGroupChat = async () => {
		console.log("Selected Users: ", selectedUsers);
		console.log("Group Chat Name: ", groupChatName);
		if (groupChatName === "" && selectedUsers.length === 0) {
			toast.warn("Please fill out all fields", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}
		if (groupChatName === "") {
			toast.warn("Please enter a group chat name", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}
		if (selectedUsers.length === 0) {
			toast.warn("Select users for group chat", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

		if (selectedUsers.length === 1) {
			toast.warn("2 users minimum are required for a groupchat", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post(
				"/api/chat/group",
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map((u) => u._id)),
				},
				config
			);

			// Re-render the myChats component
			dispatch(setFetchChatsAgain(true));
			setTimeout(() => {
				dispatch(setFetchChatsAgain(false));
			});
			closeCreateGroupChatModal();
			toast.success("New Group Chat Created!", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		} catch (error) {
			console.error(error);
			toast.warn(error.message, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
	};

	return (
		<div className={styles.modal}>
			<div className={styles.container}>
				<div onClick={closeCreateGroupChatModal}>
					<button className={styles.close_button} onClick={() => setSettingsOpen(false)}>
						<CgClose size={"80%"} />
					</button>
				</div>
				<h2 className={styles.title}>Create Group Chat</h2>
				<div className={styles.input_section}>
					<div className={styles.input_container}>
						<label className={styles.label}>Chat Name</label>
						<input type="text" className={styles.input} value={groupChatName} onChange={(e) => handleGroupChatName(e.target.value)} />
					</div>
					<div className={styles.input_container}>
						<label className={styles.label}>Users</label>

						<input type="text" className={styles.input} value={search} onChange={(e) => handleSearch(e.target.value)} />
						<div className={styles.triangle_icon} onClick={toggleSearchResultsShown}>
							{showSearchResults ? <VscTriangleUp /> : <VscTriangleDown />}
						</div>
					</div>
					{selectedUsers.length !== 0 && (
						<div className={styles.selected_user_container}>
							{selectedUsers.map((user: IUser) => (
								<div className={styles.selected_user} key={user._id}>
									<h3 className={styles.user_name_selected}>{user.username}</h3>
									<IconContext.Provider value={{ className: styles.remove_user }}>
										<CgClose onClick={() => removeFromSelected(user)} />
									</IconContext.Provider>
								</div>
							))}
						</div>
					)}
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
									<div className={styles.user_container} key={key} onClick={() => selectUser(user)}>
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
				</div>
				<button className={styles.create_btn} onClick={handleCreateGroupChat}>
					Create
				</button>
			</div>
		</div>
	);
};

export default CreateGroupChat;
