export interface User {
	_id: string;
	createdAt: string;
	email: string;
	profilePic: string;
	updatedAt: string;
	username: string;
	token: string;
	__v: number;
	notifications?: any[];
	mutedUsers?: any[];
	mutedChats?: any[];
}
