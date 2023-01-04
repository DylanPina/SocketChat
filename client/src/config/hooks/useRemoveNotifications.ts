import axios from 'axios';
import { useAppDispatch } from "../../redux/redux-hooks";
import { toast } from "react-toastify";
import { removeNotification as reduxRemoveNotification } from '../../redux/notifications/notifications.slice';
import { Message } from '../../types/message.types';

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
            toast.error(error, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        dispatch(reduxRemoveNotification(noti));
    }
	
    return removeNotification;
}


