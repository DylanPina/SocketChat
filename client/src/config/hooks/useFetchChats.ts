import axios from 'axios';
import { useAppDispatch } from "../../redux/redux-hooks";
import { toast } from "react-toastify";
import { setChats } from '../../redux/chats/chats.slice';

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

    return fetchChats;
}
