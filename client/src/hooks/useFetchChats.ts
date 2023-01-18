import axios from "axios";
import { useAppDispatch } from "../redux/redux-hooks";
import { toast } from "react-toastify";
import { setChats } from "../redux/chats/chats.slice";
import toastConfig from "../config/ToastConfig";

export default function useFetchChats() {
	const dispatch = useAppDispatch();
	toast.configure();

	const fetchChats = async () => {
		const userInfo = localStorage.getItem("userInfo");
		const { token } = JSON.parse(userInfo || "");

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await axios.get("/api/chat", config);
			dispatch(setChats(data));
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
	};

	return fetchChats;
}
