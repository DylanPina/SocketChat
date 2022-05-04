import { useAppSelector } from "../redux/redux-hooks";

const ChatPage = () => {
	const { username } = useAppSelector((state) => state.userInfo);

	return <div></div>;
};

export default ChatPage;
