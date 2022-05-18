import React from "react";

interface IProps {
	messages: any;
}

const ScrollableChat: React.FC<IProps> = ({ messages }) => {
	return <div>{messages.length > 0 && "hello"}</div>;
};

export default ScrollableChat;
