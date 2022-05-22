import { User } from "./user.types";

export interface Message {
	chat: string;
	content: string;
	createdAt: string;
	sender: User;
	updatedAt: string;
	users: [User];
	__v: number;
	_id: string;
}
