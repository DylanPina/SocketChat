import { AuthModalAction } from "./authModal.actions";
import { AuthModalType } from "./authModal.types";

const initialState = "loginModal";

const authModalReducer = (state: string = initialState, action: AuthModalAction) => {
	switch (action.type) {
		case AuthModalType.LOGIN_MODAL:
			return "loginModal";
		case AuthModalType.SIGNUP_MODAL:
			return "signupModal";
		default:
			return state;
	}
};

export default authModalReducer;
