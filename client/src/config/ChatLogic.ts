export const getSender = (currentUser: any, users: any) => {
	return users[0]._id === currentUser._id ? users[1] : users[0];
};
