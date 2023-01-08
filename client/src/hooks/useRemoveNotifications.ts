import axios from "axios";
import { useAppDispatch } from "../redux/redux-hooks";
import { toast } from "react-toastify";
import { removeNotification as reduxRemoveNotification } from "../redux/notifications/notifications.slice";
import { Message } from "../types/message.types";
import toastConfig from "../config/ToastConfig";

export default function useRemoveNotification() {
	const dispatch = useAppDispatch();
	toast.configure();

	const removeNotification = async (token: string, noti: Message) => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			await axios.post("/api/message/notifications/removeOne", { notificationId: noti._id }, config);
		} catch (error: any) {
			toast.error(error, toastConfig);
		}
		dispatch(reduxRemoveNotification(noti));
	};

	return removeNotification;
}
