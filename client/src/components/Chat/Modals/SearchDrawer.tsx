import LoadingSpinner from "../../Utils/LoadingSpinner";
import { Dispatch, SetStateAction, useState } from "react";
import { setSelectedUser } from "../../../redux/modals/search.slice";

import styles from "../../../styles/ChatPage/Modals/SearchDrawer.module.css";
import { useAppDispatch } from "../../../redux/redux-hooks";

interface IProps {
	searchResults: any;
	loadingResults: boolean;
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

const SearchDrawer: React.FC<IProps> = ({ searchResults, loadingResults }) => {
	const dispatch = useAppDispatch();

	return (
		<div className={styles.search__drawer_background}>
			<div className={styles.search_drawer}>
				{loadingResults ? (
					<div className={styles.loading__spinner_container}>
						<LoadingSpinner size="30px" />
					</div>
				) : searchResults.length === 0 ? (
					<h1 className={styles.no_results}>No results</h1>
				) : (
					searchResults.map((user: IUser, key: number) => (
						<div className={styles.user_container} key={key} onClick={() => dispatch(setSelectedUser(user))}>
							<img className={styles.profile_pic} src={user.profilePic || ""} alt={user.username} />
							<div className={styles.user__info_container}>
								<h2 className={styles.user_name}>{user.username}</h2>
								<h3 className={styles.email}>{user.email}</h3>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default SearchDrawer;
