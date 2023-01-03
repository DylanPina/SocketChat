import axios from 'axios';
import { useAppDispatch } from "../../redux/redux-hooks";
import { setNotifications } from "../../redux/notifications/notifications.slice";
import { toast } from "react-toastify";

export default function useFetchNotifications() {
    const dispatch = useAppDispatch();
    toast.configure();

    const fetchNotifications = async () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "");
        const { token } = userInfo;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get("/api/message/notifications/fetch", config);
            dispatch(setNotifications(data));
        } catch (error) {
            toast.error(error, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return fetchNotifications;
}
