import { combineReducers } from "redux";
import authModalReducer from "./auth-modal/authModal.reducer";

const reducers = combineReducers({
	authModal: authModalReducer,
});

export default reducers;

export type State = ReturnType<typeof reducers>;
