import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../redux/redux-hooks";
import { toggleMyProfile } from "../../../redux/modals/modals.slice";
import { setUserInfo, setUserProfilePic } from "../../../redux/user/user.slice";
import { IconContext } from "react-icons";
import { CgClose } from "react-icons/cg";

import { toast } from "react-toastify";
import LoadingSpinner from "../../Utils/LoadingSpinner";
import styles from "../../../styles/ChatPage/Modals/MyProfile.module.css";
import { setFetchChatsAgain } from "../../../redux/chats/chats.slice";

const MyProfile = () => {
	const [newProfilePic, setNewProfilePic] = useState<string>("");
	const [profilePicLoading, setProfilePicLoading] = useState<boolean>(false);
	const [disableUpdate, setDisableUpdate] = useState<boolean>(true);
	const [editingUsername, setEditingUsername] = useState<boolean>(false);
	const fileInput = useRef<any>(null);

	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.userInfo);
	const [username, setUsername] = useState<string>(user.username);

	useEffect(() => {
		setUsername(user.username);
	}, []);

	const toggleMyProfileModal = () => {
		dispatch(toggleMyProfile());
	};

	const handleProfilePicChange = async (image: File) => {
		setProfilePicLoading(true);
		if (image === undefined) {
			toast.error("Please select an image", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}
		if (image.type === "image/jpeg" || image.type === "image/png") {
			const data = new FormData();
			data.append("file", image);
			data.append("upload_preset", "kiuxrcpz");

			axios
				.post("https://api.cloudinary.com/v1_1/dsp7595/image/upload", data)
				.then(async (data: any) => {
					setNewProfilePic(data.data.secure_url);
					setProfilePicLoading(false);
					setDisableUpdate(false);
				})
				.catch((error: any) => {
					toast.error(error.message, {
						position: toast.POSITION.TOP_CENTER,
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
					});
				});
		} else {
			toast.error("File must be .jpeg or .png", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
	};

	const updateProfilePic = async () => {
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			await axios.post("/api/user/changePic", { userId: user._id, newProfilePic }, config);
			dispatch(setUserProfilePic(newProfilePic));
			toast.success("Profile picture has been updated", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		} catch (error: any) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
		// Update local storage with new user information
		const userInfo: any = localStorage.getItem("userInfo");
		const updatedUserInfo = JSON.parse(userInfo);
		updatedUserInfo.profilePic = newProfilePic;
		localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
		// Update redux state with new user information
		dispatch(setUserInfo(updatedUserInfo));
	};

	const handleUsernameChange = (newUsername: string) => {
		if (newUsername !== user.username) {
			setDisableUpdate(false);
		} else {
			setDisableUpdate(true);
		}
		if (newUsername.length < 3) {
			toast.warn("Username must contain atleast 3 characters", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			return;
		}
		setUsername(newUsername);
	};

	const updateUsername = async () => {
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			await axios.post("/api/user/changeUsername", { newUsername: username }, config);
			toast.success("Username has been updated", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		} catch (error: any) {
			toast.error(error.message, {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
		// Update local storage with new user information
		const userInfo: any = localStorage.getItem("userInfo");
		const updatedUserInfo = JSON.parse(userInfo);
		updatedUserInfo.username = username;
		localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
		// Update redux state with new user information
		dispatch(setUserInfo(updatedUserInfo));
	};

	const handleUpdateInfo = async () => {
		if (!disableUpdate) {
			if (newProfilePic !== "") {
				updateProfilePic();
			}
			if (username !== user.username) {
				updateUsername();
			}
			// Re-render the myChats component
			dispatch(setFetchChatsAgain(true));
			setTimeout(() => {
				dispatch(setFetchChatsAgain(false));
			});
		}
		setDisableUpdate(true);
		setEditingUsername(false);
	};

	return (
		<div className={styles.modal}>
			<div className={styles.my_profile}>
				<div onClick={toggleMyProfileModal}>
					<IconContext.Provider value={{ className: styles.close_button }}>
						<CgClose />
					</IconContext.Provider>
				</div>
				{profilePicLoading ? (
					<div className={styles.pic_loading_container}>
						<LoadingSpinner size={"80%"} />
					</div>
				) : (
					<img className={styles.profile_pic} src={newProfilePic !== "" ? newProfilePic : user.profilePic} alt="Profile" />
				)}
				<button className={styles.change_pic} onClick={() => fileInput.current.click()}>
					Change profile picture
					<input
						type="file"
						id="profilePic"
						name="profile picture"
						accept="image/png, image/jpeg"
						style={{ display: "none" }}
						ref={fileInput}
						className={styles.upload_img}
						required
						onChange={(e) => handleProfilePicChange(e.target["files"]![0])}
					/>
				</button>
				<div className={styles.info_section}>
					<div className={styles.info_container}>
						<label className={styles.info_label}>USERNAME</label>
						<div className={styles.username_container}>
							{editingUsername ? (
								<input type="text" value={username} className={styles.editing_username} onChange={(e) => handleUsernameChange(e.target.value)} />
							) : (
								<h2 className={styles.username}>{username}</h2>
							)}
							<button className={styles.edit_username_btn} onClick={() => setEditingUsername(!editingUsername)}>
								Edit
							</button>
						</div>
					</div>
					<div className={styles.info_container}>
						<label className={styles.info_label}>EMAIL</label>
						<div className={styles.email_container}>
							<h2 className={styles.email}>{user.email}</h2>
						</div>
					</div>
				</div>
				<button className={disableUpdate ? styles.update_btn_disabled : styles.update_btn} onClick={handleUpdateInfo}>
					Update
				</button>
			</div>
		</div>
	);
};

export default MyProfile;
