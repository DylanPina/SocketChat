import { User } from "./user.types";
import { Message } from "./message.types";

export interface Chat {
	chatName: string;
	createdAt: string;
	isGroupChat: boolean;
	latestMessage: Message;
	updatedAt: string;
	users: [User];
	__v: number;
	_id: string;
}
