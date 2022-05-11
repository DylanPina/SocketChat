import { useAppDispatch } from "./../redux/redux-hooks";

export const getSender = (currentUser: any, users: any) => {
	return users[0]._id === currentUser._id ? users[1].username : users[0].username;
};
