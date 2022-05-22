import { Chat } from "./chat.types";
import { User } from "./user.types";

export interface Message {
	chat: Chat;
	content: string;
	createdAt: string;
	sender: User;
	updatedAt: string;
	users: [User];
	__v: number;
	_id: string;
}
